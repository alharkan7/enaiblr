import { ChevronDown, ChevronUp } from "lucide-react";
import type { SearchResult } from "../types";
import { getFaviconUrl } from "../utils"

interface SearchResultProps {
    result: SearchResult;
    index: number;
    isExpanded: boolean;
    IconComponent: any;
    onResultClick: (index: number) => void;
}

export const SearchResultItem = ({
    result,
    index,
    isExpanded,
    IconComponent,
    onResultClick
}: SearchResultProps) => {
    const faviconUrl = getFaviconUrl(result.url);

    return (
        <div
            className="p-4 rounded-xl border bg-card hover:bg-accent transition-colors flex gap-4 cursor-pointer"
            onClick={() => onResultClick(index)}
        >
            <div className="w-16 h-16 flex items-center justify-center text-primary shrink-0">
                {result.image ? (
                    <img
                        src={result.image}
                        alt={result.title}
                        className="w-8 h-8 object-contain"
                    />
                ) : faviconUrl ? (
                    <div className="flex flex-col items-center justify-center gap-2">
                        <img
                            src={faviconUrl}
                            alt={`${result.title} favicon`}
                            className="w-8 h-8 object-contain"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const iconElement = e.currentTarget.parentElement?.querySelector('.fallback-icon');
                                if (iconElement instanceof HTMLElement) {
                                    iconElement.style.display = 'block';
                                }
                            }}
                        />
                        <IconComponent className="w-8 h-8 hidden fallback-icon" />
                    </div>
                ) : (
                    <IconComponent className="w-8 h-8" />
                )}
            </div>
            <div className="flex flex-col flex-1 min-w-0">
                <h2 className="text-sm font-bold">{result.title}</h2>
                <p className={`text-xs text-muted-foreground mt-1 ${!isExpanded ? "line-clamp-3" : ""}`}>
                    {result.summary || ""}
                </p>
                <div className="flex items-center justify-between mt-2">
                    <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-blue-800 hover:text-blue-900"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {new URL(result.url).hostname.replace('www.', '')}  ↗
                    </a>
                    {result.summary && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            {isExpanded ? (
                                <>
                                    <ChevronUp className="h-4 w-4" />
                                    <span>Show less</span>
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="h-4 w-4" />
                                    <span>Show more</span>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};