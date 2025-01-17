import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

interface SearchParams {
    query: string;
    numResults: number;
    offset?: number;
    text_decorations?: boolean;
}

const EXCLUDED_TITLE_KEYWORDS = ['best', 'top', 'ai tools for', 'r/', '?'];
const HIDDEN_EXCLUDE_KEYWORDS = ['best', 'top', 'youtube', 'reddit', 'forbes', 'nytimes', 'quora'];

const isFirstWordNumber = (title: string) => {
    const firstWord = title.trim().split(/\s+/)[0];
    return /^\d+$/.test(firstWord);
};

const hasYear = (title: string) => {
    // Match years from 2000-2099, considering common formats:
    // 2023, (2023), [2023], "2023"
    return /\b20\d{2}\b|\(20\d{2}\)|\[20\d{2}\]|"20\d{2}"/i.test(title);
};

const addHiddenKeywords = (query: string) => {
    const excludeTerms = HIDDEN_EXCLUDE_KEYWORDS.map(keyword => `-${keyword}`).join(' ');
    return `${query} ${excludeTerms}`;
};

export async function POST(request: Request) {
    const { query, numResults, offset = 0, text_decorations = false } = await request.json() as SearchParams;

    try {
        const enhancedQuery = addHiddenKeywords(query);
        
        // Ensure offset is between 0-9
        const validOffset = Math.min(Math.max(0, offset), 9);

        console.log("Search request:", {
            query: enhancedQuery,
            numResults,
            offset: validOffset,
            text_decorations
        });

        const response = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(enhancedQuery)}&count=${numResults}&offset=${validOffset}&text_decorations=${text_decorations}`, {
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
                error: errorText,
                query: enhancedQuery,
                offset: validOffset
            });
            return NextResponse.json({ error: `Brave Search API error: ${response.status} ${response.statusText}` }, { status: response.status });
        }

        const data = await response.json();
        
        console.log("Brave Search API response:", {
            hasWebResults: !!data.web,
            resultsCount: data.web?.results?.length,
            moreResultsAvailable: data.query?.more_results_available,
            offset: validOffset
        });
        
        if (!data.web?.results) {
            console.error("Unexpected Brave Search API response:", data);
            return NextResponse.json({ 
                results: [],
                more_results_available: false
            });
        }
        
        // Filter out results with excluded keywords in title, starting with numbers, or containing years
        const filteredResults = data.web.results.filter((result: any) => {
            const titleLower = result.title.toLowerCase();
            return !EXCLUDED_TITLE_KEYWORDS.some(keyword => titleLower.includes(keyword)) && 
                   !isFirstWordNumber(result.title) &&
                   !hasYear(result.title);
        });

        console.log("Filtered results:", {
            originalCount: data.web.results.length,
            filteredCount: filteredResults.length,
            offset: validOffset
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
            more_results_available: data.query?.more_results_available ?? false
        };

        return NextResponse.json(transformedResults);
    } catch (error) {
        console.error("API request error: ", error);
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
        }
    }
}