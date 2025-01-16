import { Button } from "@/components/ui/button";
import CustomSearchInput from "./CustomSearchInput";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

interface SearchHeaderProps {
    query: string;
    setQuery: (query: string) => void;
    handleSearch: (query: string) => void;
    handleBackToHome: () => void;
    clearSearch: () => void;
}

export const SearchHeader = ({
    query,
    setQuery,
    handleSearch,
    handleBackToHome,
    clearSearch
}: SearchHeaderProps) => {
    const router = useRouter();

    const handleHomeClick = () => {
        handleBackToHome(); 
        router.push('/search');
    };

    return (
        <div className="flex items-center gap-4 min-w-0 pl-2">
            <button
                onClick={handleHomeClick}
                className="flex items-center gap-2 shrink-0">
                <ChevronLeft className="size-6 sm:hidden" />
                <span className="text-2xl font-bold hidden sm:inline">enaiblr</span>
            </button>
            <div className="flex-1 min-w-0 flex items-center gap-2">
                <div className="flex-1 min-w-0">
                    <CustomSearchInput
                        className="w-full h-10 rounded-full text-sm"
                        value={query.replace(/^AI Tools for /, '')}
                        onChange={(value) => setQuery(value)}
                        onKeyUp={(e) => e.key === 'Enter' && handleSearch(query)}
                        onClear={clearSearch}
                    />
                </div>
                <Button
                    variant="outline"
                    className="rounded-full shrink-0 hidden sm:flex"
                    onClick={() => handleSearch(query)}
                >
                    Search
                </Button>
            </div>
        </div>
    );
};