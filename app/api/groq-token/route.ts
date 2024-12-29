import { NextRequest, NextResponse } from 'next/server';

const getAllowedOrigins = () => {
  if (process.env.NODE_ENV === 'development') {
    return ['http://localhost:3000', 'http://localhost'];
  }
  return [
    'https://access.enaiblr.org',
    'https://www.access.enaiblr.org',
    'https://enaiblr-access.vercel.app'
  ];
};

export async function GET(request: NextRequest) {
  try {
    const origin = request.headers.get('origin');
    console.log('Request origin:', origin);
    console.log('NODE_ENV:', process.env.NODE_ENV);

    const allowedOrigins = getAllowedOrigins();
    const isAllowedOrigin = origin && allowedOrigins.some(allowed => origin === allowed);

    // Set CORS headers
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', isAllowedOrigin ? origin : allowedOrigins[0]);
    headers.set('Access-Control-Allow-Methods', 'GET');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');

    // During development, allow all localhost origins
    if (process.env.NODE_ENV === 'development' && origin?.includes('localhost')) {
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
    if (!isAllowedOrigin) {
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
    const headers = new Headers();
    const defaultOrigin = getAllowedOrigins()[0];
    headers.set('Access-Control-Allow-Origin', process.env.NODE_ENV === 'development' ? '*' : defaultOrigin);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to get Groq token' }),
      { status: 500, headers }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  const allowedOrigins = getAllowedOrigins();
  const isAllowedOrigin = origin && allowedOrigins.some(allowed => origin === allowed);

  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', isAllowedOrigin ? origin : allowedOrigins[0]);
  headers.set('Access-Control-Allow-Methods', 'GET');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');
  
  return new NextResponse(null, { status: 204, headers });
}
