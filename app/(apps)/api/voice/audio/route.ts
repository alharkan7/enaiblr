"use server";

import { NextResponse } from "next/server";

const audioStore = new Map<string, ArrayBuffer>();

export async function POST(request: Request) {
  try {
    const { audioData } = await request.json();
    const id = Math.random().toString(36).substring(7);
    audioStore.set(id, Buffer.from(audioData));
    
    return NextResponse.json({ id });
  } catch (error) {
    console.error('Error storing audio:', error);
    return NextResponse.json({ error: 'Failed to store audio' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id || !audioStore.has(id)) {
      return NextResponse.json({ error: 'Audio not found' }, { status: 404 });
    }

    const audioData = audioStore.get(id)!;

    return new NextResponse(audioData, {
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Length': audioData.byteLength.toString(),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Error streaming audio:', error);
    return NextResponse.json({ error: 'Failed to stream audio' }, { status: 500 });
  }
}
