import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export const config = {
  api: {
    bodyParser: false,
  },
  maxDuration: 300,
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const language = formData.get('language') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Initialize Groq client
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    // Create a new File object with the required properties
    const audioFile = new File(
      [arrayBuffer], 
      file.name, 
      { 
        type: file.type,
        lastModified: file.lastModified 
      }
    );

    // Create transcription using the file
    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-large-v3",
      temperature: 0.2,
      language: language,
      response_format: "verbose_json",
    });

    return NextResponse.json(transcription);

  } catch (error: any) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { 
        error: 'Transcription failed', 
        message: error.message || 'Unknown error',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}