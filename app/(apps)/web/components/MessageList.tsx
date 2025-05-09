import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Message } from './types'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface MessageListProps {
    messages: Message[];
    messagesEndRef: React.RefObject<HTMLDivElement>;
    onUpdate: () => void;
    isLoading?: boolean; 
}

interface CollapsibleTextProps {
    content: string;
}

// Helper function to decode HTML entities
function decodeHTMLEntities(text: string) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
}

function CollapsibleText({ content }: CollapsibleTextProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="relative">
            <motion.p
                initial={false}
                animate={{ height: isExpanded ? 'auto' : '3em' }}
                className={`text-foreground/80 text-sm pr-6 ${!isExpanded ? 'line-clamp-2' : ''}`}
            >
                {content}
            </motion.p>
            <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                className="absolute bottom-0 right-0 p-1 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={isExpanded ? 'Show less' : 'Show more'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {isExpanded ? (
                    <ChevronUp className="size-4" />
                ) : (
                    <ChevronDown className="size-4" />
                )}
            </motion.button>
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
                        <AnimatePresence initial={false}>
                            {messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ 
                                        duration: 0.2,
                                        ease: "easeOut"
                                    }}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}
                                >
                                    <motion.div
                                        initial={false}
                                        animate={{ scale: 1 }}
                                        className={`max-w-[80%] rounded-2xl p-3 break-words overflow-wrap-anywhere ${message.role === 'user'
                                            ? 'bg-primary text-primary-foreground rounded-br-none'
                                            : 'bg-muted text-foreground rounded-bl-none'
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
                                                                className="max-w-full max-h-[250px] size-auto object-contain rounded-lg mb-2"
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
                                                    <motion.div 
                                                        className="mt-4 space-y-3 border-t pt-1 text-sm"
                                                        initial={false}
                                                    >
                                                        <motion.div 
                                                            className="flex items-center justify-between cursor-pointer bg-muted rounded-md pt-2"
                                                            onClick={() => toggleSourcesExpanded(message.id)}
                                                            whileHover={{ backgroundColor: 'var(--muted-hover)' }}
                                                            whileTap={{ scale: 0.98 }}
                                                        >
                                                            <div className="font-bold ">Top 5 Sources:</div>
                                                            <svg
                                                                className={`size-5 transform transition-transform duration-200 ${expandedSources[message.id] ? 'rotate-180' : ''}`
                                                                }
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M19 9l-7 7-7-7"
                                                                />
                                                            </svg>
                                                        </motion.div>
                                                        <AnimatePresence initial={false}>
                                                            {expandedSources[message.id] && (
                                                                <motion.div
                                                                    initial={{ height: 0, opacity: 0 }}
                                                                    animate={{ height: 'auto', opacity: 1 }}
                                                                    exit={{ height: 0, opacity: 0 }}
                                                                    transition={{ duration: 0.2 }}
                                                                    className="space-y-3"
                                                                >
                                                                    {message.sources.map((source, index) => (
                                                                        <div key={index} className="space-y-1">
                                                                            <a
                                                                                href={source.url}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="text-muted-foreground font-semibold hover:underline block"
                                                                            >
                                                                                {source.title}
                                                                            </a>
                                                                            {source.snippet && (
                                                                                <CollapsibleText content={decodeHTMLEntities(source.snippet)} />
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </motion.div>
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {isLoading && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex justify-start w-full"
                            >
                                <div className="max-w-[80%] rounded-2xl p-3 bg-gray-200 text-gray-800 rounded-bl-none">
                                    <div className="flex space-x-1">
                                        <div className="size-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="size-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                                        <div className="size-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
                <div ref={messagesEndRef} />
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