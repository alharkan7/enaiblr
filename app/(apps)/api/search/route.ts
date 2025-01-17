import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

interface SearchParams {
    query: string;
    numResults: number;
    offset?: number;
    text_decorations?: boolean;
}

const EXCLUDED_TITLE_KEYWORDS = ['best', 'top', 'ai tools for'];

const isFirstWordNumber = (title: string) => {
    const firstWord = title.trim().split(/\s+/)[0];
    return /^\d+$/.test(firstWord);
};

export async function POST(request: Request) {
    const { query, numResults, offset = 0, text_decorations = false } = await request.json() as SearchParams;

    try {
        const response = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=${numResults}&offset=${offset}&text_decorations=${text_decorations}`, {
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip',
                'X-Subscription-Token': process.env.BRAVE_SEARCH_API_KEY!
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Brave Search API error:", {
                status: response.status,
                statusText: response.statusText,
                error: errorText
            });
            throw new Error(`Brave Search API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.web?.results) {
            console.error("Unexpected Brave Search API response:", data);
            throw new Error("Invalid response format from Brave Search API");
        }
        
        // Filter out results with excluded keywords in title or starting with numbers
        const filteredResults = data.web.results.filter((result: any) => {
            const titleLower = result.title.toLowerCase();
            return !EXCLUDED_TITLE_KEYWORDS.some(keyword => titleLower.includes(keyword)) && 
                   !isFirstWordNumber(result.title);
        });
        
        // Transform Brave Search results to match our app's format
        const transformedResults = {
            results: filteredResults.map((result: any) => ({
                title: result.title,
                url: result.url,
                description: result.description,
                favicon: result.meta_url?.favicon || null,
                thumbnail: result.thumbnail?.src || null,
            })),
            hasMore: data.web.results.length === numResults
        };

        return NextResponse.json(transformedResults);
    } catch (error) {
        console.error("API request error: ", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to fetch data" }, { status: 500 });
    }
}
