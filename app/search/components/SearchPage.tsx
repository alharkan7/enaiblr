'use client';

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

import { SearchHeader } from "./SearchHeader";
import { SearchResultItem } from "./SearchResult";
import CustomSearchInput from "./CustomSearchInput";
import RenderFooter from "@/components/RenderFooter";

import { useSearch } from "../hooks/useSearch";
import { TAGS } from "../constants";
import { getRandomIcon } from "../utils";
import type { SearchPageProps } from "../types";

export default function SearchPage({ initialQuery }: SearchPageProps) {
    return (
        <Suspense fallback={
            <div className="w-full h-[100dvh] flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">Loading...</div>
            </div>
        }>
            <SearchPageContent initialQuery={initialQuery} />
        </Suspense>
    );
}

function SearchPageContent({ initialQuery }: SearchPageProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [query, setQuery] = useState(initialQuery || "");
    const [isHomePage, setIsHomePage] = useState(!initialQuery);

    const {
        searchResults,
        isLoading,
        error,
        expandedResultIndex,
        setExpandedResultIndex,
        handleSearch
    } = useSearch();

    const resultIcons = useMemo(() => {
        if (!searchResults) return [];
        return searchResults.results.map(() => getRandomIcon());
    }, [searchResults?.results]);

    useEffect(() => {
        const urlQuery = searchParams.get('q');
        if (urlQuery !== query) {
            setQuery(urlQuery || "");
            setIsHomePage(!urlQuery);
            if (urlQuery) {
                handleSearch(urlQuery, false);
            }
        }
    }, [searchParams]);

    useEffect(() => {
        document.title = query && searchResults
            ? `Search: ${query} | enaiblr`
            : 'enaiblr - AI Tools Search Engine';
    }, [query, searchResults]);

    const handleBackToHome = () => {
        router.replace("/", { scroll: false });
        setQuery("");
        setIsHomePage(true);
        setExpandedResultIndex(null);
    };

    const clearSearch = () => {
        setQuery("");
    };

    const handleTagSearch = useCallback((tag: string) => {
        const newQuery = `AI Tools for ${tag}`;
        setQuery(newQuery);
        setIsHomePage(false);
        handleSearch(newQuery);
    }, [handleSearch]);

    const handleResultClick = useCallback((index: number) => {
        setExpandedResultIndex(prev => prev === index ? null : index);
    }, []);

    if (!isHomePage && (searchResults || isLoading)) {
        return (
            <div className="flex flex-col min-h-screen search-layout">
                <SearchHeader
                    query={query}
                    setQuery={setQuery}
                    handleSearch={handleSearch}
                    handleBackToHome={handleBackToHome}
                    clearSearch={clearSearch}
                />
                <main className="container mx-auto px-5 py-8 flex-1 overflow-y-auto h-[calc(100vh-160px)]">
                    {isLoading ? (
                        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Array.from({ length: 4 }, (_, index) => (
                                <div key={index} className="p-4 rounded-xl border bg-card flex gap-4 animate-pulse">
                                    <div className="w-16 h-16 bg-muted rounded-lg"></div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                                        <div className="h-4 bg-muted rounded w-full mb-2"></div>
                                        <div className="h-4 bg-muted rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                            {searchResults.results.map((result: any, index: number) => (
                                <SearchResultItem
                                    key={index}
                                    result={result}
                                    index={index}
                                    isExpanded={expandedResultIndex === index}
                                    IconComponent={resultIcons[index]}
                                    onResultClick={handleResultClick}
                                />
                            ))}
                        </div>
                    )}
                </main>
                <div className="mt-8">
                    <RenderFooter />
                </div>
            </div>
        );
    }

    // Home view
    return (
        <div className="h-[100dvh] flex flex-col">
            <header className="sticky top-0 left-0 w-full p-4 z-10">
                <div className="container mx-auto flex justify-end">
                    <a href="mailto:enaiblr@gmail.com">
                        <Button variant="outline" className="rounded-full px-6 hidden sm:flex">
                            Contact
                        </Button>
                        <Button variant="outline" className="rounded-full sm:hidden" aria-label="Contact">
                            <Mail className="h-5 w-5" />
                        </Button>
                    </a>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center px-4 gap-8 pt-1">
                <div className="text-center space-y-2">
                    <h1 className="text-5xl tracking-tighter ibm-plex-mono-bold">
                        en<span className="text-blue-600">ai</span>blr
                    </h1>
                    <p className="text-l text-muted-foreground ibm-plex-mono-light">AI Tools Search Engine</p>
                </div>

                <div className="w-full max-w-2xl space-y-4">
                    <div className="relative">
                        <CustomSearchInput
                            className="w-full h-12 rounded-full"
                            value={query.replace(/^AI Tools for /, '')}
                            onChange={(value) => setQuery(value)}
                            onKeyUp={(e) => e.key === 'Enter' && handleSearch(query)}
                            onClear={() => clearSearch()}
                        />
                    </div>
                    <div className="flex justify-center gap-3">
                        <Button
                            variant="outline"
                            className="rounded-full px-6"
                            onClick={() => {
                                if (query.trim() !== '') {
                                    setIsHomePage(false);
                                    handleSearch(query);
                                }
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? "Searching..." : "Search"}
                        </Button>
                        <Button
                            variant="outline"
                            className="rounded-full px-6"
                            onClick={() => handleTagSearch(TAGS[Math.floor(Math.random() * TAGS.length)])}
                        >
                            Surprise Me
                        </Button>
                    </div>
                </div>

                {error && <p className="text-red-500">{error}</p>}

                <div className="hidden sm:flex flex-wrap justify-center gap-2 max-w-2xl mt-6">
                    {TAGS.map((tag) => (
                        <Button
                            key={tag}
                            variant="outline"
                            className="rounded-full text-xs h-8 hover:bg-secondary"
                            onClick={() => handleTagSearch(tag)}
                        >
                            {tag} ↗
                        </Button>
                    ))}
                </div>
            </main>

            <div className="mt-8">
                <RenderFooter />
            </div>
        </div>
    );
}