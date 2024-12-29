import { RefreshCw } from 'lucide-react'

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
            <div className="max-w-4xl mx-auto px-4 py-4 md:px-6 text-center relative">
                <h1 className="text-xl font-semibold mx-12 truncate">
                    Chat with{' '}
                    {fileName && <span className="text-blue-600">{truncateFileName(fileName)}</span>}
                </h1>
                <button
                    onClick={clearMessages}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Clear chat history"
                >
                    <RefreshCw className="w-5 h-5 text-gray-600" />
                </button>
            </div>
        </div>
    ) : (
        <div className="text-center py-8">
            <h1 className="text-4xl font-extrabold mb-2 flex flex-wrap justify-center items-center gap-x-2">
                <span>Chat with</span>
                {fileName ? (
                    <span className="text-blue-600">{truncateFileName(fileName)}</span>
                ) : (
                    <span className="text-blue-600">PDFs and Docs</span>
                )}
            </h1>
            {/* <p className="text-sm text-gray-500">
                <b>Private. Secured. Not Recorded.</b>
            </p> */}
        </div>
    );
}