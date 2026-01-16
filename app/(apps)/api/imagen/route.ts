import { GoogleGenAI, PersonGeneration } from '@google/genai';
import { NextResponse } from "next/server";
import { getGeminiApiKey } from '@/lib/ai/gemini';

// Configure route segment for Vercel deployment
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function getAspectRatio(width: number, height: number): string {
  const ratio = width / height;
  if (Math.abs(ratio - 1) < 0.1) return '1:1';
  if (Math.abs(ratio - 16 / 9) < 0.1) return '16:9';
  if (Math.abs(ratio - 9 / 16) < 0.1) return '9:16';
  if (Math.abs(ratio - 4 / 3) < 0.1) return '4:3';
  if (Math.abs(ratio - 3 / 4) < 0.1) return '3:4';
  return '1:1'; // default to square
}

export async function POST(request: Request) {
  try {
    // Get the API key (user's own or fallback to .env)
    const apiKey = await getGeminiApiKey();

    const body = await request.json();
    const { prompt, width, height } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    console.log('Generating image with prompt:', prompt);
    const ai = new GoogleGenAI({
      apiKey: apiKey,
    });

    const aspectRatio = getAspectRatio(width || 1024, height || 1024);

    const response = await ai.models.generateImages({
      model: 'models/imagen-4.0-fast-generate-001',
      prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        personGeneration: PersonGeneration.ALLOW_ALL,
        aspectRatio,
      },
    });

    if (!response?.generatedImages || response.generatedImages.length === 0) {
      throw new Error('No images generated');
    }

    const imageData = response.generatedImages[0]?.image?.imageBytes;
    if (!imageData) {
      throw new Error('No image data received');
    }

    console.log('Image generation successful');
    return NextResponse.json({
      imageData
    });
  } catch (error: any) {
    console.error('Error generating image:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });

    if (error.message?.includes('rate limit') || error.message?.includes('quota')) {
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