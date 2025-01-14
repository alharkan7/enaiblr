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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

    return compact ? (
        <AppsHeader
            title={<>Chat with {chatMode === 'gemini' ? 'a Page' : 'the Web'}</>}
            leftButton={refreshButton}
        />
    ) : (
        <motion.div 
            className="text-center py-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.h1 
                className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
                variants={itemVariants}
            >
                {chatMode === 'gemini' ? 'Page Summarizer' : 'Web Search'}
            </motion.h1>
            <motion.p 
                className="text-sm text-muted-foreground"
                variants={itemVariants}
            >
                <b>{chatMode === 'gemini' ? 'Chat with Any Page on the Internet' : 'Search the web with AI'}</b>
            </motion.p>
        </motion.div>
    );
}