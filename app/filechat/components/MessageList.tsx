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
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                    >
                        <div
                            className={`rounded-lg px-4 py-2 max-w-[85%] ${message.role === 'user'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-900'
                                }`}
                        >
                            <ReactMarkdown className={`prose prose-sm max-w-none ${message.role === 'user' ? 'prose-invert !text-white' : ''
                                }`}>
                                {getVisibleContent(message.content)}
                            </ReactMarkdown>
                        </div>
                    </div>
                ))}
            </div>
            <div ref={messagesEndRef} />
        </div>
    );
}