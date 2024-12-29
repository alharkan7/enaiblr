import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const origin = request.headers.get('origin');
    console.log('Request origin:', origin);
    console.log('NODE_ENV:', process.env.NODE_ENV);

    // Set CORS headers
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', process.env.NODE_ENV === 'development' ? '*' : 'https://access.enaiblr.org');
    headers.set('Access-Control-Allow-Methods', 'GET');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');

    // During development, skip origin check
    if (process.env.NODE_ENV === 'development') {
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
    }

    // In production, check for valid origin
    if (!origin?.includes('access.enaiblr.org')) {
      console.log('Unauthorized access attempt from origin:', origin);
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 403, headers }
      );
    }

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
    return new NextResponse(
      JSON.stringify({ error: 'Failed to get Groq token' }),
      { status: 500, headers: new Headers({
        'Access-Control-Allow-Origin': process.env.NODE_ENV === 'development' ? '*' : 'https://access.enaiblr.org'
      })}
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', process.env.NODE_ENV === 'development' ? '*' : 'https://access.enaiblr.org');
  headers.set('Access-Control-Allow-Methods', 'GET');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');
  
  return new NextResponse(null, { status: 204, headers });
}
