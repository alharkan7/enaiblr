import { NextResponse } from 'next/server';
import Exa from 'exa-js';

export const dynamic = "force-dynamic";

const exa = new Exa(process.env.EXASEARCH_API_KEY!);

interface SearchParams {
    query: string;
    type: string;
    useAutoprompt: boolean;
    numResults: number;
    summary: true | undefined;
}

export async function POST(request: Request) {
    const { query, ...searchParams } = await request.json() as SearchParams;

    try {
        const results = await exa.searchAndContents(query, searchParams);
        return NextResponse.json(results);
    } catch (error) {
        console.error("API request error: ", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}
