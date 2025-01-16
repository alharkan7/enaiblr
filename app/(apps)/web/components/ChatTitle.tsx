import { RefreshIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { AppsHeader } from '@/components/apps-header';
import { motion } from 'framer-motion';

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
        <motion.div 
            className="text-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <motion.h1 
                className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                {chatMode === 'gemini' ? 'Page Summarizer' : 'Web Search'}
            </motion.h1>
            <motion.p 
                className="text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <b>{chatMode === 'gemini' ? 'Chat with Any Page on the Internet' : 'Search the web with AI'}</b>
            </motion.p>
        </motion.div>
    );
}