import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SEARCH_PARAMS } from '../constants';

export const useSearch = () => {
    const router = useRouter();
    const [searchResults, setSearchResults] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expandedResultIndex, setExpandedResultIndex] = useState<number | null>(null);

    const handleSearch = useCallback(async (searchQuery: string, updateURL: boolean = true) => {
        setIsLoading(true);
        setError(null);
        setExpandedResultIndex(null);

        try {
            if (updateURL) {
                router.push(`/search?q=${encodeURIComponent(searchQuery)}`, { scroll: false });
            }

            const response = await fetch("/api/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: searchQuery, ...SEARCH_PARAMS }),
            });

            if (!response.ok) throw new Error("Failed to fetch results");

            const results = await response.json();
            setSearchResults(results);
        } catch (error: any) {
            console.error("Search error:", error);
            setError(error.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    return {
        searchResults,
        isLoading,
        error,
        expandedResultIndex,
        setExpandedResultIndex,
        handleSearch,
    };
};