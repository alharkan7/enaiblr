import { NextResponse } from 'next/server';
import { tavily } from '@tavily/core';
import Together from 'together-ai';

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error('Invalid or empty messages array');
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage?.content?.[0]?.text) {
      throw new Error('Invalid message format');
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