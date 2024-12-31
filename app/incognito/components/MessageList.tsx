import ReactMarkdown from 'react-markdown'
import { Message } from './types'
import { useEffect, useRef } from 'react'

interface MessageListProps {
    messages: Message[];
    messagesEndRef: React.RefObject<HTMLDivElement>;
    onUpdate: () => void;
}

export function MessageList({ messages, messagesEndRef, onUpdate }: MessageListProps) {
    const messageListRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (messageListRef.current && messagesEndRef.current) {
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

            if (isMobile) {
                // For mobile, use a simpler, more direct approach
                requestAnimationFrame(() => {
                    messagesEndRef.current?.scrollIntoView({ block: 'end' });
                });
            } else {
                // For desktop, use container scrolling
                messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
            }
        }
    };

    // Watch for new messages and content changes
    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.role === 'assistant' || lastMessage.role === 'user') {
                scrollToBottom();
            }
        }
    }, [messages, messages[messages.length - 1]?.content]);

    // Initial scroll
    useEffect(() => {
        scrollToBottom();
        onUpdate();
    }, []);

    return (
        <>
        <div
            ref={messageListRef}
            className="flex-1 overflow-y-auto scrollbar-hide relative h-full"
        >
            <div className="max-w-4xl mx-auto px-4 pt-4 space-y-6">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`rounded-lg px-4 py-2 max-w-[85%] ${
                                message.role === 'user'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-accent text-accent-foreground'
                            }`}
                        >
                            <div className={`prose max-w-none [&_*]:text-current [&_p]:mb-0 [&_ul]:mt-0 [&_ol]:mt-0 [&_li]:text-current [&_li]:mt-0 [&_li]:mb-0 ${
                                message.role === 'user'
                                    ? '[&_p]:text-primary-foreground [&_a]:text-primary-foreground [&_li]:text-primary-foreground [&_ul]:text-primary-foreground [&_ol]:text-primary-foreground'
                                    : '[&_p]:text-accent-foreground [&_a]:text-accent-foreground [&_li]:text-accent-foreground [&_ul]:text-accent-foreground [&_ol]:text-accent-foreground'
                            }`}>
                                {message.image && (
                                    <img
                                        src={message.image}
                                        alt="Uploaded content"
                                        className="w-full h-auto object-contain rounded-lg mb-1 max-h-[300px]"
                                    />
                                )}
                                {Array.isArray(message.content) && message.content.map((content, idx) => {
                                    if ('image_url' in content) {
                                        return (
                                            <img
                                                key={idx}
                                                src={content.image_url.url}
                                                alt="Generated content"
                                                className="w-full h-auto object-contain rounded-lg mb-0 max-h-[300px]"
                                            />
                                        );
                                    }
                                    return <ReactMarkdown key={idx}>{content.text}</ReactMarkdown>;
                                })}
                                {typeof message.content === 'string' && (
                                    <ReactMarkdown>{message.content}</ReactMarkdown>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
        </div>
        <style>{`
            .prose pre, .prose code {
                white-space: pre-wrap;
                overflow-wrap: break-word;
                overflow-x: auto;
            }
        `}</style>
        </>
    );
}