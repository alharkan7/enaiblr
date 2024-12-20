import {
  type Message,
  StreamData,
  convertToCoreMessages,
  streamObject,
  streamText,
} from 'ai';
import { z } from 'zod';

import { auth } from '@/app/(auth)/auth';
import { customModel } from '@/lib/ai';
import { models, DEFAULT_MODEL_NAME } from '@/lib/ai/models';
import { systemPrompt } from '@/lib/ai/prompts';
import {
  deleteChatById,
  getChatById,
  getDocumentById,
  saveChat,
  saveDocument,
  saveMessages,
  saveSuggestions,
} from '@/lib/db/queries';
import type { Suggestion } from '@/lib/db/schema';
import {
  generateUUID,
  getMostRecentUserMessage,
  sanitizeResponseMessages,
} from '@/lib/utils';

import { generateTitleFromUserMessage } from '../../actions';

export const maxDuration = 60;

type AllowedTools =
  | 'createDocument'
  | 'updateDocument'
  | 'requestSuggestions'
  | 'getWeather';

const blocksTools: AllowedTools[] = [
  'createDocument',
  'updateDocument',
  'requestSuggestions'
];

const weatherTools: AllowedTools[] = [];

const allTools: AllowedTools[] = [...blocksTools, ...weatherTools];

function getWeatherDescription(code: number): string {
  const weatherCodes: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    95: 'Thunderstorm',
  };
  return weatherCodes[code] || 'Unknown';
}

export async function POST(request: Request) {
  const {
    id,
    messages,
    modelId,
  }: { id: string; messages: Array<Message>; modelId: string } =
    await request.json();

  const session = await auth();

  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Get the selected model configuration
  const selectedModel = models.find(model => model.id === modelId)
    ?? models.find(model => model.id === DEFAULT_MODEL_NAME);

  if (!selectedModel) {
    return new Response('Model not found', { status: 404 });
  }

  // Create the model instance with the correct provider
  const model = customModel(selectedModel.apiIdentifier, selectedModel.provider);

  const coreMessages = convertToCoreMessages(messages);
  const userMessage = getMostRecentUserMessage(coreMessages);

  if (!userMessage) {
    return new Response('No user message found', { status: 400 });
  }

  const chat = await getChatById({ id });

  if (!chat) {
    const title = await generateTitleFromUserMessage({ message: userMessage });
    await saveChat({ id, userId: session.user.id, title });
  }

  const userMessageId = generateUUID();

  await saveMessages({
    messages: [
      { ...userMessage, id: userMessageId, createdAt: new Date(), chatId: id },
    ],
  });

  const streamingData = new StreamData();

  try {
    streamingData.append({
      type: 'user-message-id',
      content: userMessageId,
    });

    const result = streamText({
      model,
      system: systemPrompt,
      messages: coreMessages,
      maxSteps: 5,
      experimental_activeTools: allTools,
      tools: {
        getWeather: {
          description: 'Get the current weather at a location. Example: Get weather for New York (40.7128, -74.0060)',
          parameters: z.object({
            latitude: z.number().min(-90).max(90).describe('Latitude between -90 and 90'),
            longitude: z.number().min(-180).max(180).describe('Longitude between -180 and 180'),
          }),
          execute: async ({ latitude, longitude }) => {
            try {
              const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode&timezone=auto`;
              console.log('Fetching weather data from URL:', url);

              const response = await fetch(url);
              console.log('Response status:', response.status);
              console.log('Response headers:', Object.fromEntries(response.headers.entries()));

              if (!response.ok) {
                throw new Error(`Weather API request failed with status: ${response.status}`);
              }

              const weatherData = await response.json();
              console.log('Raw weather API response:', JSON.stringify(weatherData, null, 2));

              // Log the structure of the response
              console.log('Weather data keys:', Object.keys(weatherData));
              if (weatherData.current) {
                console.log('Current data keys:', Object.keys(weatherData.current));
              } else {
                console.log('No current data found in response');
              }

              // Validate the response data
              if (!weatherData?.current?.temperature_2m ||
                !weatherData?.current?.weathercode) {
                console.error('Invalid weather data structure:', weatherData);
                throw new Error(`Invalid weather data format received from API. Available data: ${JSON.stringify(weatherData)}`);
              }

              const formattedResponse = {
                current: {
                  temperature: weatherData.current.temperature_2m,
                  unit: weatherData.current_units?.temperature_2m ?? '°C',
                  weather: getWeatherDescription(weatherData.current.weathercode),
                },
                daily: {
                  sunrise: null,
                  sunset: null,
                },
              };

              console.log('Formatted weather response:', formattedResponse);
              return formattedResponse;

            } catch (error) {
              console.error('Weather API error:', error);
              throw new Error(`Failed to fetch weather data: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
          },
        },
        createDocument: {
          description: 'Create a document for a writing activity',
          parameters: z.object({
            title: z.string(),
          }),
          execute: async ({ title }) => {
            const id = generateUUID();
            let draftText = '';
            let timeoutId: NodeJS.Timeout | undefined;

            try {
              streamingData.append({
                type: 'id',
                content: id,
              });

              streamingData.append({
                type: 'title',
                content: title,
              });

              streamingData.append({
                type: 'clear',
                content: '',
              });

              const { fullStream } = streamText({
                model,
                system:
                  'Write about the given topic. Markdown is supported. Use headings wherever appropriate.',
                messages: [
                  {
                    role: 'user',
                    content: title
                  }
                ],
                experimental_providerMetadata: {
                  groq: {
                    temperature: 0.7,
                    max_tokens: 1000,
                    stream: true,
                  },
                  anthropic: {
                    temperature: 0.7,
                    max_tokens_to_sample: 1000,
                  },
                  google: {
                    temperature: 0.7,
                    maxOutputTokens: 1000,
                  }
                }
              });

              for await (const delta of fullStream) {
                const { type } = delta;
                if (type === 'text-delta') {
                  const { textDelta } = delta;
                  draftText += textDelta;
                  streamingData.append({
                    type: 'text-delta',
                    content: textDelta,
                  });
                }
              }

              if (session.user?.id) {
                await saveDocument({
                  id,
                  title,
                  content: draftText,
                  userId: session.user.id,
                });
              }

              streamingData.append({
                type: 'finish',
                content: ''
              });

              return { id, title };
            } catch (error) {
              console.error('Document creation error:', error);
              streamingData.append({
                type: 'error',
                content: 'Failed to create document'
              });
              throw error;
            }
          },
        },
        updateDocument: {
          description: 'Update an existing document',
          parameters: z.object({
            id: z.string(),
            description: z.string(),
          }),
          execute: async ({ id, description }) => {
            const document = await getDocumentById({ id });

            if (!document) {
              return {
                error: 'Document not found',
              };
            }

            const { content: currentContent } = document;
            let draftText = '';

            streamingData.append({
              type: 'clear',
              content: document.title,
            });

            const { fullStream } = streamText({
              model,
              system:
                'You are a helpful writing assistant. Based on the description, please update the piece of writing.',
              messages: [
                {
                  role: 'user',
                  content: description,
                },
                { role: 'user', content: currentContent },
              ],
              experimental_providerMetadata: {
                openai: {
                  prediction: {
                    type: 'content',
                    content: currentContent,
                  },
                },
                groq: {
                  temperature: 0.7,
                  max_tokens: 1000,
                },
                anthropic: {
                  temperature: 0.7,
                  max_tokens_to_sample: 1000,
                },
                google: {
                  temperature: 0.7,
                  maxOutputTokens: 1000,
                }
              }
            });

            for await (const delta of fullStream) {
              const { type } = delta;

              if (type === 'text-delta') {
                const { textDelta } = delta;

                draftText += textDelta;
                streamingData.append({
                  type: 'text-delta',
                  content: textDelta,
                });
              }
            }

            streamingData.append({ type: 'finish', content: '' });

            if (session.user?.id) {
              await saveDocument({
                id,
                title: document.title,
                content: draftText,
                userId: session.user.id,
              });
            }

            return {
              id,
              title: document.title,
              content: 'The document has been updated successfully.',
            };
          },
        },
        requestSuggestions: {
          description: 'Request suggestions for improving a document',
          parameters: z.object({
            documentId: z.string(),
          }),
          execute: async ({ documentId }) => {
            const document = await getDocumentById({ id: documentId });

            if (!document || !document.content) {
              return {
                error: 'Document not found',
              };
            }

            const suggestions: Array<
              Omit<Suggestion, 'userId' | 'createdAt' | 'documentCreatedAt'>
            > = [];

            const { elementStream } = streamObject({
              model,
              system:
                'You are a help writing assistant. Given a piece of writing, please offer suggestions to improve the piece of writing and describe the change. It is very important for the edits to contain full sentences instead of just words. Max 5 suggestions.',
              messages: [
                {
                  role: 'user',
                  content: document.content
                }
              ],
              output: 'array',
              schema: z.object({
                originalSentence: z.string().describe('The original sentence'),
                suggestedSentence: z.string().describe('The suggested sentence'),
                description: z
                  .string()
                  .describe('The description of the suggestion'),
              }),
              experimental_providerMetadata: {
                groq: {
                  temperature: 0.7,
                  max_tokens: 1000,
                },
                anthropic: {
                  temperature: 0.7,
                  max_tokens_to_sample: 1000,
                },
                google: {
                  temperature: 0.7,
                  maxOutputTokens: 1000,
                }
              }
            });

            for await (const element of elementStream) {
              const suggestion = {
                originalText: element.originalSentence,
                suggestedText: element.suggestedSentence,
                description: element.description,
                id: generateUUID(),
                documentId: documentId,
                isResolved: false,
              };

              streamingData.append({
                type: 'suggestion',
                content: suggestion,
              });

              suggestions.push(suggestion);
            }

            if (session.user?.id) {
              const userId = session.user.id;

              await saveSuggestions({
                suggestions: suggestions.map((suggestion) => ({
                  ...suggestion,
                  userId,
                  createdAt: new Date(),
                  documentCreatedAt: document.createdAt,
                })),
              });
            }

            streamingData.close();

            return {
              id: documentId,
              title: document.title,
              message: 'Suggestions have been added to the document',
            };
          },
        },
      },
      onFinish: async ({ response }) => {
        if (session.user?.id) {
          try {
            const responseMessagesWithoutIncompleteToolCalls =
              sanitizeResponseMessages(response.messages);

            await saveMessages({
              messages: responseMessagesWithoutIncompleteToolCalls.map(
                (message) => {
                  const messageId = generateUUID();

                  if (message.role === 'assistant') {
                    streamingData.appendMessageAnnotation({
                      messageIdFromServer: messageId,
                    });
                  }

                  return {
                    id: messageId,
                    chatId: id,
                    role: message.role,
                    content: message.content,
                    createdAt: new Date(),
                  };
                },
              ),
            });
          } catch (error) {
            console.error('Failed to save chat:', error);
            streamingData.append({
              type: 'error',
              content: 'Failed to save chat'
            });
          } finally {
            streamingData.close();
          }
        } else {
          streamingData.close();
        }
      },
      experimental_telemetry: {
        isEnabled: true,
        functionId: 'stream-text',
      },
    });

    const response = result.toDataStreamResponse({
      data: streamingData,
    });

    return response;
  } catch (error) {
    console.error('Error during streaming:', error);
    streamingData.append({
      type: 'error',
      content: 'Internal Server Error'
    });
    streamingData.close();
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const session = await auth();

  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  if (!id) {
    return new Response('Chat ID is required', { status: 400 });
  }

  try {
    await deleteChatById({ id });
    return new Response('Chat deleted successfully', { status: 200 });
  } catch (error) {
    console.error('Error deleting chat:', error);
    return new Response('Failed to delete chat', { status: 500 });
  }
}
