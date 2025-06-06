import { RefreshIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';

interface ChatTitleProps {
    compact?: boolean;
    clearMessages: () => void;
    fileName?: string;
}

export function ChatTitle({ compact, clearMessages, fileName }: ChatTitleProps) {
    const truncateFileName = (name: string) => {
        if (!name) return '';

        const lastDotIndex = name.lastIndexOf('.');
        if (lastDotIndex === -1) return name;

        const nameWithoutExt = name.slice(0, lastDotIndex);
        const extension = name.slice(lastDotIndex);

        if (nameWithoutExt.length <= 20) return name;
        return `${nameWithoutExt.substring(0, 20)}...${extension}`;
    };

    return compact ? (
        <div className="border-b border-gray-200">
            <div className="max-w-4xl mx-auto p4 md:px-6 text-center relative">
                <h1 className="text-xl font-semibold mx-12 truncate">
                    Chat with{' '}
                    {fileName && <span className="text-primary">{truncateFileName(fileName)}</span>}
                </h1>
                <Button
                    onClick={clearMessages}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Clear chat history"
                >
                    <RefreshIcon size={14} />
                </Button>
            </div>
        </div>
    ) : (
        <div className="text-center py-8">
            <h1 className="text-4xl font-extrabold mb-2 flex flex-wrap justify-center items-center gap-x-2">
                <span>Chat with</span>
                {fileName ? (
                    <span className="text-primary">{truncateFileName(fileName)}</span>
                ) : (
                    <span className="text-primary">PDFs and Docs</span>
                )}
            </h1>
            {/* <p className="text-sm text-gray-500">
                <b>Private. Secured. Not Recorded.</b>
            </p> */}
        </div>
    );
}