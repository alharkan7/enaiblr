import { RefreshIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { AppsHeader } from '@/components/apps-header';

interface ChatTitleProps {
    compact?: boolean;
    clearMessages: () => void;
}

export function ChatTitle({ compact, clearMessages }: ChatTitleProps) {
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
            title={<><span className="text-primary">Disposable</span> Chat</>}
            leftButton={refreshButton}
        />
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