import { RefreshCw } from 'lucide-react'

interface ChatTitleProps {
    compact?: boolean;
    clearMessages: () => void;
}

export function ChatTitle({ compact, clearMessages }: ChatTitleProps) {
    return compact ? (
        <div className="border-b border-input">
            <div className="max-w-4xl mx-auto p-4 md:px-6 text-center relative">
                <h1 className="text-xl font-semibold">
                    Chat with the Web
                </h1>
                <button 
                    onClick={clearMessages}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-accent rounded-full transition-colors"
                    title="Clear chat history"
                >
                    <RefreshCw className="size-5 text-muted-foreground" />
                </button>
            </div>
        </div>
    ) : (
        <div className="text-center py-8">
            <h1 className="text-4xl font-extrabold mb-2">
                <span className="whitespace-nowrap">Chat with </span>{' '}
                <span className="whitespace-nowrap">the Web</span>    
            </h1>
            {/* <p className="text-sm text-gray-500">
                <b>No Limits. Not Recorded.</b>
            </p> */}
        </div>
    );
}