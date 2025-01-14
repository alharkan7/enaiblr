import { NextResponse } from 'next/server';
import { tavily } from '@tavily/core';
import { Together } from 'together-ai';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { extract } from '@extractus/article-extractor';

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages, chatMode } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error('Invalid or empty messages array');
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage?.content?.[0]?.text) {
      throw new Error('Invalid message format');
    }

    const userInput = lastMessage.content[0].text;

    // Use Gemini for article processing and follow-up questions
    if (chatMode === 'gemini') {
      try {
        let contents;
        
        // If it's the first message, extract article content
        if (messages.length === 1) {
          const article = await extract(userInput);
          if (!article?.content) {
            return NextResponse.json(
              { error: 'Could not extract content from this URL. The page might be too large or not accessible.' },
              { status: 400 }
            );
          }
          contents = [{
            role: "user",
            parts: [{ text: `Here's the content from ${userInput}:\n\n${article.content}\n\nPlease provide a comprehensive summary of this content.` }]
          }];
        } else {
          // For follow-up questions, include chat history
          contents = messages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ 
              text: Array.isArray(msg.content) 
                ? msg.content[0].text 
                : msg.content 
            }]
          }));
        }

        // Process with Gemini
        const result = await model.generateContentStream({
          contents,
          generationConfig,
        });

        // Create stream for response
        const stream = new ReadableStream({
          async start(controller) {
            try {
              // Send URL metadata only for the first message
              if (messages.length === 1) {
                const article = await extract(userInput);
                const metaData = {
                  type: 'sources',
                  sources: [{
                    url: userInput,
                    title: article?.title || 'Article',
                    snippet: article?.description || '',
                  }]
                };
                controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(metaData)}\n\n`));
              }

              // Stream Gemini response
              for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                if (chunkText) {
                  const data = { type: 'content', content: chunkText };
                  controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`));
                }
              }
              controller.close();
            } catch (error) {
              controller.error(error);
            }
          },
        });

        return new NextResponse(stream, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        });
      } catch (error) {
        console.error('Gemini processing error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to process with Gemini';
        return NextResponse.json(
          { error: errorMessage },
          { status: 500 }
        );
      }
    }

    // Convert messages to LLM format
    const llmMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content[0].text
    }));

    // Process query with LLM to include context
    const llmResponse = await together.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant. Your task is to rephrase the latest user query to include context from the chat history. Return only the rephrased query without any additional text or explanation.'
        },
        ...llmMessages
      ],
      model: 'meta-llama/Llama-Vision-Free',
      max_tokens: 256,
      temperature: 0.3,
      top_p: 0.7,
      top_k: 50,
      repetition_penalty: 1,
      stop: ['<|eot_id|>', '<|eom_id|>'],
      stream: false
    });

    if (!llmResponse.choices?.[0]?.message?.content) {
      throw new Error('Failed to process query with AI');
    }

    const processedQuery = llmResponse.choices[0].message.content;

    // Perform Tavily search with processed query
    const response = await tvly.search(processedQuery, {
      searchDepth: "advanced",
      includeAnswer: true,
      maxResults: 5
    });

    if (!response.answer) {
      throw new Error('No answer received from the server');
    }

    // Create a ReadableStream to send the response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // First, send the sources data
          const sourcesData = {
            type: 'sources',
            sources: response.results || []
          };
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(sourcesData)}\n\n`));

          // Send Tavily's answer directly
          const answerData = {
            type: 'content',
            content: response.answer
          };
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(answerData)}\n\n`));
          
          controller.close();
        } catch (error) {
          controller.error(error);
          throw error;
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error processing chat request' }, 
      { status: 500 }
    );
  }
}