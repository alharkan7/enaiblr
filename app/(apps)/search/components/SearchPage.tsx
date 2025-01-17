'use client';

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AppsHeader } from "@/components/apps-header";
import { motion, AnimatePresence } from "framer-motion";

import { SearchHeader } from "./SearchHeader";
import { SearchResultItem } from "./SearchResult";
import CustomSearchInput from "./CustomSearchInput";
import AppsFooter from '@/components/apps-footer';

import { useSearch } from "../hooks/useSearch";
import { TAGS } from "../constants";
import { getRandomIcon } from "../utils";
import type { SearchPageProps } from "../types";
import type { SearchResult } from "../hooks/useSearch";

export default function SearchPage({ initialQuery }: SearchPageProps) {
    return (
        <Suspense fallback={
            <div className="w-full h-dvh flex items-center justify-center">
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
        isLoadingMore,
        error,
        expandedResultIndex,
        setExpandedResultIndex,
        handleSearch,
        loadMore,
        hasMore
    } = useSearch();

    const resultIcons = useMemo(() => {
        if (!searchResults) return [];
        return searchResults.map(() => getRandomIcon());
    }, [searchResults]);

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
            <div className="flex flex-col min-h-dvh">
                <motion.header 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex-none sticky top-0 left-0 w-full z-10 bg-background border-b"
                >
                    <div className="container max-w-5xl mx-auto py-4 pl-4 sm:pl-0 flex items-center gap-2">
                        <div className="flex-1 min-w-0">
                            <SearchHeader
                                query={query}
                                setQuery={setQuery}
                                handleSearch={handleSearch}
                                handleBackToHome={handleBackToHome}
                                clearSearch={clearSearch}
                            />
                        </div>
                        <div className="shrink-0">
                            <AppsHeader />
                        </div>
                    </div>
                </motion.header>
                <main className="flex-1 overflow-y-auto">
                    <div className="container mx-auto px-5 pt-4 pb-0">
                        <AnimatePresence mode="wait">
                            {isLoading ? (
                                <motion.div 
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    {Array.from({ length: 6 }, (_, index) => (
                                        <div key={index} className="p-4 rounded-xl border bg-card flex gap-4 animate-pulse">
                                            <div className="size-16 bg-muted rounded-lg"></div>
                                            <div className="flex-1">
                                                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                                                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                                                <div className="h-4 bg-muted rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="results"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    {searchResults?.map((result: SearchResult, index: number) => (
                                        <SearchResultItem
                                            key={result.url}
                                            result={result}
                                            IconComponent={resultIcons[index]}
                                            isExpanded={expandedResultIndex === index}
                                            onToggleExpand={() => handleResultClick(index)}
                                        />
                                    ))}

                                    {/* Loading skeletons for "Load More" */}
                                    {isLoadingMore && (
                                        Array.from({ length: 6 }, (_, i) => (
                                            <div key={`skeleton-${i}`} className="p-4 rounded-xl border bg-card flex gap-4 animate-pulse">
                                                <div className="size-16 bg-muted rounded-lg"></div>
                                                <div className="flex-1">
                                                    <div className="h-4 bg-muted rounded w-3/4"></div>
                                                    <div className="h-3 bg-muted rounded w-1/2 mt-2"></div>
                                                    <div className="flex justify-between items-center mt-4">
                                                        <div className="h-3 bg-muted rounded w-1/3"></div>
                                                        <div className="h-3 bg-muted rounded w-8"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Load More button */}
                        {!isLoading && searchResults && searchResults.length > 0 && hasMore && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-center mt-8"
                            >
                                <Button
                                    variant="outline"
                                    onClick={() => loadMore(query)}
                                    disabled={isLoadingMore}
                                    className="min-w-[200px]"
                                >
                                    {isLoadingMore ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                            Loading...
                                        </span>
                                    ) : (
                                        'Load More'
                                    )}
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </main>
                <div className="mt-8">
                    <AppsFooter />
                </div>
            </div>
        );
    }

    // Home view
    return (
        <div className="h-dvh flex flex-col">
            <motion.header 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="sticky top-0 left-0 w-full z-10"
            >
                <AppsHeader />
            </motion.header>

            <main className="flex-1 flex flex-col items-center justify-center px-4 gap-8 pt-1">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-center space-y-2"
                >
                    <h1 className="text-4xl font-extrabold bg-clip-text">
                        AI Search Engine
                    </h1>
                    <p className="text-l text-muted-foreground">Find the Best AI Tools on the Internet</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-2xl space-y-4"
                >
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
                </motion.div>
{/* 
                {error && (
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-destructive"
                    >
                        {error}
                    </motion.p>
                )} */}

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="sm:flex sm:flex-wrap justify-center gap-2 max-w-2xl mt-6"
                >
                    <div className="sm:hidden relative">
                        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />
                        <div className="max-h-[160px] overflow-y-auto flex flex-col gap-2 px-4 scrollbar-hide">
                            {TAGS.map((tag, index) => (
                                <motion.div
                                    key={tag}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <Button
                                        variant="outline"
                                        className="rounded-full text-xs h-8 hover:bg-secondary w-full transition-colors duration-200"
                                        onClick={() => handleTagSearch(tag)}
                                    >
                                        {tag} ↗
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
                    </div>
                    <div className="hidden sm:flex sm:flex-wrap sm:justify-center gap-2">
                        {TAGS.map((tag, index) => (
                            <motion.div
                                key={tag}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <Button
                                    variant="outline"
                                    className="rounded-full text-xs h-8 hover:bg-secondary transition-colors duration-200"
                                    onClick={() => handleTagSearch(tag)}
                                >
                                    {tag} ↗
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </main>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="mt-8"
            >
                <AppsFooter />
            </motion.div>
        </div>
    );
}