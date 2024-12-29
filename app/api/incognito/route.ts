import { NextResponse } from 'next/server';
import Together from 'together-ai';

const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages, imageBase64 } = body;

    // If there's a base64 image, add it to the messages
    const messagesWithImage = imageBase64
      ? [...messages, { role: 'user', content: imageBase64 }]
      : messages;

    const response = await together.chat.completions.create({
      messages: messagesWithImage,
      model: 'meta-llama/Llama-Vision-Free',
      max_tokens: 127000,
      temperature: 0.7,
      top_p: 0.7,
      top_k: 50,
      repetition_penalty: 1,
      stop: ['<|eot_id|>', '<|eom_id|>'],
      stream: true
    });

    // Create a ReadableStream to handle the streaming response
    const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of response) {
              const content = chunk.choices[0]?.delta?.content;
              if (content) {
                // Format as SSE data
                const data = `data: ${JSON.stringify({ content })}\n\n`;
                controller.enqueue(new TextEncoder().encode(data));
              }
            }
          } catch (error) {
            controller.error(error);
          } finally {
            controller.close();
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
    return NextResponse.json({ error: 'Error processing chat request' }, { status: 500 });
  }
}
