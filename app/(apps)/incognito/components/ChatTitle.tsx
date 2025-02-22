import { RefreshIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { AppsHeader } from '@/components/apps-header';

interface ChatTitleProps {
    compact?: boolean;
    clearMessages: () => void;
    hasUserSentMessage?: boolean;
    onClear?: () => void;  // New prop for handling UI reset
}

export function ChatTitle({ compact, clearMessages, hasUserSentMessage, onClear }: ChatTitleProps) {
    const refreshButton = (
        <Button 
            onClick={() => {
                clearMessages();
                onClear?.();  // Call onClear to reset the UI state
            }}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Clear chat history"
            variant="outline"
        >
            <RefreshIcon size={14} />
        </Button>
    );

    return hasUserSentMessage ? (
        <AppsHeader
            title={<><span className="text-primary">Incognito</span> Chat</>}
            leftButton={refreshButton}
        />
    ) : (
        <div className="text-center py-8">
            <h1 className="text-4xl font-extrabold mb-2">
                <span className="text-primary whitespace-nowrap">Incognito</span>{' '}
                <span className="whitespace-nowrap">AI Chat</span>
            </h1>
            <p className="text-sm text-muted-foreground">
                <b>No Limits. Not Recorded.</b>
            </p>
        </div>
    );
}