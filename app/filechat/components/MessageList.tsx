import ReactMarkdown from 'react-markdown'
import { Message } from './types'
import { useEffect, useRef } from 'react'
import { DocumentPreview } from './DocumentPreview'

interface MessageListProps {
    messages: Message[];
    messagesEndRef: React.RefObject<HTMLDivElement>;
    onUpdate: () => void;
    fileInfo?: {
        fileName: string;
        fileType: string;
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

            if (isMobile) {
                requestAnimationFrame(() => {
                    messagesEndRef.current?.scrollIntoView({ block: 'end' });
                });
            } else {
                messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
            }
        }
    };

    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.role === 'assistant' || lastMessage.role === 'user') {
                scrollToBottom();
            }
        }
    }, [messages, messages[messages.length - 1]?.content]);

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
        <div
            ref={messageListRef}
            className="flex-1 overflow-y-auto scrollbar-hide relative h-full"
        >
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
                {messages.length > 0 && fileInfo && (
                    <div className="flex justify-end mb-4">
                        <DocumentPreview
                            fileName={fileInfo.fileName}
                            fileType={fileInfo.fileType}
                            isUploading={isUploading}
                            onRemove={onRemoveFile}
                            error={error}
                            wordCount={wordCount}
                            showRemoveButton={false}
                        />
                    </div>
                )}
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                    >
                        <div
                            className={`rounded-lg px-4 py-2 max-w-[85%] ${message.role === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-accent text-accent-foreground'
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
                        </div>
                    </div>
                ))}
            </div>
            <div ref={messagesEndRef} />
        </div>
    );
}