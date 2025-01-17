import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SEARCH_PARAMS } from '../constants';

export interface SearchResult {
    title: string;
    url: string;
    description: string;
    favicon: string | null;
    thumbnail: string | null;
}

interface SearchResponse {
    results: SearchResult[];
    hasMore: boolean;
}

export const useSearch = () => {
    const router = useRouter();
    const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expandedResultIndex, setExpandedResultIndex] = useState<number | null>(null);
    const [hasMore, setHasMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);

    const handleSearch = useCallback(async (searchQuery: string, updateURL: boolean = true) => {
        setIsLoading(true);
        setError(null);
        setExpandedResultIndex(null);
        setHasMore(false);
        setCurrentPage(0);

        try {
            if (updateURL) {
                router.push(`/search?q=${encodeURIComponent(searchQuery)}`, { scroll: false });
            }

            const response = await fetch("/api/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    query: searchQuery, 
                    ...SEARCH_PARAMS,
                    offset: 0 
                }),
            });

            if (!response.ok) throw new Error("Failed to fetch results");

            const data = await response.json() as SearchResponse;
            setSearchResults(data.results);
            setHasMore(data.hasMore);
        } catch (error: any) {
            console.error("Search error:", error);
            setError(error.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    const loadMore = useCallback(async (searchQuery: string) => {
        if (!searchQuery || isLoadingMore || currentPage >= 9) return;

        setIsLoadingMore(true);
        try {
            const nextPage = currentPage + 1;

            const response = await fetch("/api/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: searchQuery,
                    ...SEARCH_PARAMS,
                    offset: nextPage
                }),
            });

            if (!response.ok) throw new Error("Failed to fetch more results");

            const data = await response.json() as SearchResponse;
            setSearchResults((prev: SearchResult[] | null) => [...(prev || []), ...data.results]);
            setHasMore(data.hasMore && nextPage < 9);
            setCurrentPage(nextPage);
        } catch (error: any) {
            console.error("Load more error:", error);
            setError(error.message || "Failed to load more results");
        } finally {
            setIsLoadingMore(false);
        }
    }, [currentPage, isLoadingMore]);

    return {
        searchResults,
        isLoading,
        isLoadingMore,
        error,
        expandedResultIndex,
        setExpandedResultIndex,
        handleSearch,
        loadMore,
        hasMore
    };
};