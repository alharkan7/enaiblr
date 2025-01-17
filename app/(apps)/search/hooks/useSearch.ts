import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
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
    more_results_available?: boolean;
}

export const useSearch = () => {
    const router = useRouter();
    const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expandedResultIndex, setExpandedResultIndex] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMoreResults, setHasMoreResults] = useState(true);

    const handleSearch = useCallback(async (searchQuery: string, updateURL: boolean = true) => {
        setIsLoading(true);
        setError(null);
        setExpandedResultIndex(null);
        setCurrentPage(0);
        setHasMoreResults(true);

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
                    offset: 0,
                    text_decorations: false
                }),
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.error || "Failed to fetch results");
            }

            if (!Array.isArray(data.results)) {
                throw new Error("Invalid response format from API");
            }

            setSearchResults(data.results);
            setHasMoreResults(data.more_results_available ?? false);
        } catch (error: any) {
            console.error("Search error:", error);
            setError(error.message || "An error occurred");
            setSearchResults(null);
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    const loadMore = useCallback(async (searchQuery: string) => {
        if (!searchQuery || isLoadingMore || currentPage >= 9 || !hasMoreResults) return;

        setIsLoadingMore(true);
        setError(null);

        try {
            const nextOffset = currentPage + 1;

            const response = await fetch("/api/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: searchQuery,
                    ...SEARCH_PARAMS,
                    offset: nextOffset,
                    text_decorations: false
                }),
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.error || "Failed to fetch more results");
            }

            if (!Array.isArray(data.results)) {
                throw new Error("Invalid response format from API");
            }

            if (!data.more_results_available) {
                setHasMoreResults(false);
                toast.info("No more results available");
                return;
            }

            if (data.results.length === 0) {
                setHasMoreResults(false);
                toast.info("No more results available");
                return;
            }

            setSearchResults((prev: SearchResult[] | null) => {
                if (!prev) return data.results;
                
                // Filter out results with URLs that already exist in prev
                const existingUrls = new Set(prev.map(result => result.url));
                const uniqueNewResults = data.results.filter((result: SearchResult) => !existingUrls.has(result.url));
                
                if (uniqueNewResults.length === 0) {
                    setHasMoreResults(false);
                    toast.info("No new results available");
                    return prev;
                }
                
                return [...prev, ...uniqueNewResults];
            });
            setCurrentPage(nextOffset);
        } catch (error: any) {
            console.error("Load more error:", error);
            const errorMessage = typeof error === 'string' ? error : error.message || "Failed to load more results";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoadingMore(false);
        }
    }, [currentPage, isLoadingMore, hasMoreResults]);

    return {
        searchResults,
        isLoading,
        isLoadingMore,
        error,
        expandedResultIndex,
        setExpandedResultIndex,
        handleSearch,
        loadMore,
        currentPage,
        hasMoreResults
    };
};