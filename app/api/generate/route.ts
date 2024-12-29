import Together from "together-ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    if (!process.env.TOGETHER_API_KEY) {
      console.error('TOGETHER_API_KEY is not set in environment variables');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { prompt, width, height } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    console.log('Generating image with prompt:', prompt);
    const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

    const response = await together.images.create({
      model: "black-forest-labs/FLUX.1-schnell-Free",
      prompt,
      width: width || 1024,
      height: height || 1024,
      steps: 4,
      n: 1,
      response_format: "b64_json" as "base64"
    });

    console.log('Image generation successful');
    return NextResponse.json({ 
      imageData: response.data[0].b64_json 
    });
  } catch (error: any) {
    console.error('Error generating image:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });

    if (error.message?.includes('rate limit')) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to generate image' },
      { status: 500 }
    );
  }
}