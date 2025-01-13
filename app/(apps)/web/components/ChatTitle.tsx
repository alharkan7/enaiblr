import { RefreshIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { AppsHeader } from '@/components/apps-header';

interface ChatTitleProps {
    compact?: boolean;
    clearMessages: () => void;
    chatMode?: 'gemini' | 'tavily';
}

export function ChatTitle({ compact, clearMessages, chatMode }: ChatTitleProps) {
    const refreshButton = (
        <Button 
            onClick={clearMessages}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Clear chat history"
            variant="outline"
        >
            <RefreshIcon size={14} />
        </Button>
    );

    return compact ? (
        <AppsHeader
            title={<>Chat with {chatMode === 'gemini' ? 'a Page' : 'the Web'}</>}
            leftButton={refreshButton}
        />
    ) : (
        <div className="text-center py-8">
            <h1 className="text-4xl font-extrabold mb-2">
                {chatMode === 'gemini' ? 'Page Summarizer' : 'Web Search'}
            </h1>
            <p className="text-sm text-muted-foreground">
                <b>{chatMode === 'gemini' ? 'Chat with Any Page on the Internet' : 'Search the web with AI'}</b>
            </p>
        </div>
    );
}