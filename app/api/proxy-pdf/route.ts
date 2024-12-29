import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'Invalid URL provided' },
        { status: 400 }
      );
    }

    console.log('Attempting to fetch PDF from:', url);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      // Parse the URL to get the hostname
      const urlObj = new URL(url);
      const referrer = `${urlObj.protocol}//${urlObj.hostname}`;

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/pdf,application/x-pdf,application/octet-stream,*/*',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Referer': referrer,
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'same-origin',
          'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"Windows"',
          'Upgrade-Insecure-Requests': '1',
          'Origin': referrer
        },
        redirect: 'follow',
        credentials: 'omit',
        mode: 'cors',
        cache: 'no-cache',
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`Failed to fetch PDF: Status ${response.status} ${response.statusText}`);
        console.error('Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (response.status === 403) {
          return NextResponse.json(
            { error: 'Access to this PDF is restricted. Please download it manually and upload as a file instead.' },
            { status: 403 }
          );
        }
        
        return NextResponse.json(
          { error: `Failed to fetch PDF: ${response.status} ${response.statusText}` },
          { status: response.status }
        );
      }

      const contentType = response.headers.get('content-type');
      console.log('Response content-type:', contentType);

      const buffer = await response.arrayBuffer();
      
      // Check if the file starts with the PDF magic number (%PDF-)
      const firstBytes = new Uint8Array(buffer.slice(0, 5));
      const magicNumber = new TextDecoder().decode(firstBytes);
      
      if (!magicNumber.startsWith('%PDF-')) {
        console.error('Invalid PDF format: Does not start with %PDF-');
        return NextResponse.json(
          { error: 'The URL does not point to a valid PDF file. Please ensure it\'s a direct link to a PDF.' },
          { status: 400 }
        );
      }

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Length': buffer.byteLength.toString(),
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Cache-Control': 'no-cache',
        },
      });

    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('Fetch error:', fetchError);
      
      const errorMessage = fetchError instanceof Error 
        ? fetchError.message 
        : 'Unknown error occurred while fetching PDF';

      return NextResponse.json(
        { error: `Failed to fetch PDF: ${errorMessage}` },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error in proxy' },
      { status: 500 }
    );
  }
}
