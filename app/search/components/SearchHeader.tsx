import { Button } from "@/components/ui/button";
import CustomSearchInput from "./CustomSearchInput";
import { useRouter } from "next/navigation";

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
        <header className="border-b">
            <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-center items-center gap-4">
                <button
                    onClick={handleHomeClick}
                    className="text-2xl font-bold tracking-tighter shrink-0 mb-0 sm:mb-0">
                    en<span className="text-blue-600">ai</span>blr
                </button>
                <div className="relative flex-1 max-w-xl w-full flex items-center">
                    <div className="relative flex-1">
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
                        className="rounded-full ml-2 hidden sm:flex"
                        onClick={() => handleSearch(query)}
                    >
                        Search
                    </Button>
                </div>
            </div>
        </header>
    );
};