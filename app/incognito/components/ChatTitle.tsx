import { RefreshCw } from 'lucide-react'

interface ChatTitleProps {
    compact?: boolean;
    clearMessages: () => void;
}

export function ChatTitle({ compact, clearMessages }: ChatTitleProps) {
    return compact ? (
        <div className="border-b border-border">
            <div className="max-w-4xl mx-auto px-4 py-4 md:px-6 text-center relative">
                <h1 className="text-xl font-semibold">
                    <span className="text-primary">Disposable</span> Chat
                </h1>
                <button 
                    onClick={clearMessages}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-muted rounded-full transition-colors"
                    title="Clear chat history"
                >
                    <RefreshCw className="size-5 text-muted-foreground" />
                </button>
            </div>
        </div>
    ) : (
        <div className="text-center py-8">
            <h1 className="text-4xl font-extrabold mb-2">
                <span className="text-primary whitespace-nowrap">Disposable</span>{' '}
                <span className="whitespace-nowrap">AI Chat</span>
            </h1>
            <p className="text-sm text-muted-foreground">
                <b>No Limits. Not Recorded.</b>
            </p>
        </div>
    );
}