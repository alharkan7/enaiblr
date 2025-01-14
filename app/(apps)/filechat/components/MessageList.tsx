import ReactMarkdown from 'react-markdown'
import { Message } from './types'
import { useEffect, useRef } from 'react'
import { DocumentPreview } from './DocumentPreview'
import { motion, AnimatePresence } from 'framer-motion'

interface MessageListProps {
    messages: Message[];
    messagesEndRef: React.RefObject<HTMLDivElement>;
    onUpdate: () => void;
    fileInfo?: {
        fileName: string;
        fileType: string;
        fileUrl?: string;
    } | null;
    isUploading?: boolean;
    onRemoveFile?: () => void;
    error?: string | null;
    wordCount?: number;
}

export function MessageList({ 
    messages, 
    messagesEndRef, 
    onUpdate,
    fileInfo,
    isUploading = false,
    onRemoveFile = () => {},
    error = null,
    wordCount
}: MessageListProps) {
    const messageListRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (messageListRef.current && messagesEndRef.current) {
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            requestAnimationFrame(() => {
                if (isMobile) {
                    messagesEndRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' });
                } else {
                    messageListRef.current!.scrollTop = messageListRef.current!.scrollHeight;
                }
            });
        }
    };

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    useEffect(() => {
        scrollToBottom();
        onUpdate();
    }, []);

    const getVisibleContent = (content: any) => {
        if (typeof content === 'string') return content;
        if (!Array.isArray(content)) return '';

        // Filter out document content and only show user input
        return content
            .filter(c => !c.text.includes('Document content:'))
            .map(c => c.text)
            .join('\n');
    };

    return (
        <div ref={messageListRef} className="h-full overflow-y-auto px-4 pb-4">
            <div className="max-w-4xl mx-auto space-y-4">
                <AnimatePresence mode="wait">
                    {messages.length > 0 && fileInfo && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex justify-end mb-4"
                        >
                            <DocumentPreview
                                fileName={fileInfo.fileName}
                                fileType={fileInfo.fileType}
                                isUploading={isUploading}
                                onRemove={onRemoveFile}
                                error={error}
                                wordCount={wordCount}
                                showRemoveButton={false}
                                fileUrl={fileInfo.fileUrl}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
                {messages.map((message, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                            duration: 0.4,
                            delay: index * 0.1,
                            ease: "easeOut"
                        }}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <motion.div
                            // whileHover={{ scale: 1.01 }}
                            className={`rounded-2xl px-4 py-2 max-w-[85%] ${message.role === 'user'
                                ? 'bg-primary text-primary-foreground rounded-br-none'
                                : 'bg-accent text-accent-foreground rounded-bl-none'
                                }`}
                        >
                            <div className={`prose prose-sm max-w-none [&_*]:text-current [&_p]:mb-0 [&_ul]:mt-0 [&_ol]:mt-0 [&_li]:text-current [&_li]:my-0 ${
                                message.role === 'user'
                                    ? '[&_p]:text-primary-foreground [&_a]:text-primary-foreground [&_li]:text-primary-foreground [&_ul]:text-primary-foreground [&_ol]:text-primary-foreground'
                                    : '[&_p]:text-accent-foreground [&_a]:text-accent-foreground [&_li]:text-accent-foreground [&_ul]:text-accent-foreground [&_ol]:text-accent-foreground'
                            }`}>
                                <ReactMarkdown>
                                    {getVisibleContent(message.content)}
                                </ReactMarkdown>
                            </div>
                        </motion.div>
                    </motion.div>
                ))}
            </div>
            <div ref={messagesEndRef} />
        </div>
    );
}