import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const origin = request.headers.get('origin');
    console.log('Request origin:', origin);
    console.log('NODE_ENV:', process.env.NODE_ENV);

    // Set CORS headers
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');  // Allow all origins temporarily
    headers.set('Access-Control-Allow-Methods', 'GET');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');

    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY is not set in environment variables');
      return new NextResponse(
        JSON.stringify({ error: 'API key configuration error' }),
        { status: 500, headers }
      );
    }

    return new NextResponse(
      JSON.stringify({ apiKey: process.env.GROQ_API_KEY }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error('Error getting Groq token:', error);
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    return new NextResponse(
      JSON.stringify({ error: 'Failed to get Groq token' }),
      { status: 500, headers }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');
  
  return new NextResponse(null, { status: 204, headers });
}
