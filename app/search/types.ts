export interface SearchResult {
    title: string;
    summary: string;
    url: string;
    image?: string;
}

export interface SearchPageProps {
    initialQuery: string;
}