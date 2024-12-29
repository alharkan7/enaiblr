import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Message } from './types'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface MessageListProps {
    messages: Message[];
    messagesEndRef: React.RefObject<HTMLDivElement>;
    onUpdate: () => void;
    isLoading?: boolean; 
}

interface CollapsibleTextProps {
    content: string;
}

function CollapsibleText({ content }: CollapsibleTextProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="relative">
            <p
                className={`text-gray-600 text-sm pr-6 ${!isExpanded ? 'line-clamp-2' : ''
                    }`}
            >
                {content}
            </p>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="absolute bottom-0 right-0 p-1 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label={isExpanded ? 'Show less' : 'Show more'}
            >
                {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                ) : (
                    <ChevronDown className="h-4 w-4" />
                )}
            </button>
        </div>
    );
}

export function MessageList({ messages, messagesEndRef, onUpdate, isLoading }: MessageListProps) {
    const messageListRef = useRef<HTMLDivElement>(null);
    const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});

    const toggleSourcesExpanded = (messageId: string) => {
        setExpandedSources(prev => ({
            ...prev,
            [messageId]: !prev[messageId]
        }));
    };

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
                style={{
                    height: '100%',
                    overscrollBehavior: 'contain',
                }}
            >
                <div className="max-w-4xl mx-auto w-full p-4 md:p-6">
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
                                <div
                                    className={`max-w-[80%] rounded-2xl p-3 break-words overflow-wrap-anywhere ${message.role === 'user'
                                        ? 'bg-blue-500 text-white rounded-br-none'
                                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                                        }`}
                                >
                                    {message.role === 'user' ? (
                                        // User message
                                        Array.isArray(message.content)
                                            ? message.content.map((content, i) => (
                                                <div key={i}>
                                                    {content.type === 'text' && content.text}
                                                    {content.type === 'image_url' && (
                                                        <img
                                                            src={content.image_url.url}
                                                            alt="Uploaded content"
                                                            className="max-w-full max-h-[250px] w-auto h-auto object-contain rounded-lg mb-2"
                                                        />
                                                    )}
                                                </div>
                                            ))
                                            : message.content
                                    ) : (
                                        // Assistant message
                                        <div className="space-y-4">
                                            <ReactMarkdown className="prose prose-sm max-w-none dark:prose-invert">
                                                {Array.isArray(message.content)
                                                    ? message.content
                                                        .filter(content => content.type === 'text')
                                                        .map(content => (content as { type: 'text', text: string }).text)
                                                        .join('\n')
                                                    : message.content}
                                            </ReactMarkdown>

                                            {message.sources && message.sources.length > 0 && (
                                                <div className="mt-4 space-y-3 border-t pt-3 text-sm">
                                                    <div className="flex items-center justify-between cursor-pointer bg-gray-100 rounded-md p-2" 
                                                         onClick={() => toggleSourcesExpanded(message.id)}>
                                                        <div className="font-bold text-gray-700">Sources:</div>
                                                        <svg
                                                            className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${expandedSources[message.id] ? 'rotate-180' : ''}`}
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>
                                                    <div 
                                                        className={`transition-all duration-200 ease-in-out overflow-hidden ${expandedSources[message.id] ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
                                                    >
                                                        <div className="space-y-3">
                                                            {message.sources.map((source, index) => (
                                                                <div key={index} className="space-y-1">
                                                                    <a
                                                                        href={source.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-blue-600 hover:underline font-medium"
                                                                    >
                                                                        {source.title}
                                                                    </a>
                                                                    <CollapsibleText content={source.content} />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start w-full">
                                <div className="max-w-[80%] rounded-2xl p-3 bg-gray-200 text-gray-800 rounded-bl-none">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div
                    ref={messagesEndRef}
                    className="h-px w-full"
                    aria-hidden="true"
                />
            </div>
            <style>{`
                .prose pre, .prose code {
                    white-space: pre-wrap;
                    overflow-wrap: break-word;
                    overflow-x: auto;
                }
                
                @keyframes bounce {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-5px);
                    }
                }
                
                .animate-bounce {
                    animation: bounce 1s infinite;
                }

                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </>
    );
}