import { ChevronDown, ChevronUp } from "lucide-react";
import type { SearchResult } from "../hooks/useSearch";
import { getFaviconUrl, decodeHtml } from "../utils";
import { LucideIcon } from "lucide-react";

interface SearchResultProps {
    result: SearchResult;
    isExpanded: boolean;
    onToggleExpand: () => void;
    IconComponent: LucideIcon;
}

export const SearchResultItem = ({
    result,
    isExpanded,
    onToggleExpand,
    IconComponent
}: SearchResultProps) => {
    const faviconUrl = result.favicon || getFaviconUrl(result.url);
    const displayUrl = new URL(result.url).hostname.replace(/^www\./, '');
    const decodedDescription = decodeHtml(result.description);

    return (
        <div
            className="p-4 rounded-xl border bg-card hover:bg-accent transition-colors flex gap-4 cursor-pointer"
            onClick={onToggleExpand}
        >
            <div className="size-16 flex items-center justify-center text-primary shrink-0">
                {faviconUrl ? (
                    <img
                        src={faviconUrl}
                        alt={`${result.title} favicon`}
                        className="size-8 object-contain rounded-md"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                        }}
                    />
                ) : null}
                <IconComponent className={`size-8 ${faviconUrl ? 'hidden fallback-icon' : ''}`} />
            </div>

            <div className="flex flex-col flex-1 min-w-0">
                <h2 className="text-sm font-bold">{decodeHtml(result.title)}</h2>
                {isExpanded && (
                    <p className="text-xs text-muted-foreground mt-1">
                        {decodedDescription}
                    </p>
                )}
                <div className="flex items-center justify-between mt-2">
                    <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-primary hover:text-primary/90"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {displayUrl} ↗
                    </a>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        {isExpanded ? (
                            <>
                                <ChevronUp className="size-4" />
                                <span>Show less</span>
                            </>
                        ) : (
                            <>
                                <ChevronDown className="size-4" />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};