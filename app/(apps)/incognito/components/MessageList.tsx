import { useEffect, useRef } from 'react';
import { Message } from './types';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { FilePreview } from './FilePreview';

interface MessageListProps {
    messages: Message[];
    messagesEndRef: React.RefObject<HTMLDivElement>;
    onUpdate: () => void;
    isLoading: boolean;
    isStreaming: boolean;
}

export function MessageList({ messages, messagesEndRef, onUpdate, isLoading, isStreaming }: MessageListProps) {
    const prevMessagesLengthRef = useRef(messages.length);

    useEffect(() => {
        if (messages.length !== prevMessagesLengthRef.current) {
            onUpdate();
            prevMessagesLengthRef.current = messages.length;
        }
    }, [messages.length, onUpdate]);

    const renderMessageContent = (content: Message['content']) => {
        if (typeof content === 'string') {
            return <ReactMarkdown>{content}</ReactMarkdown>;
        }

        return content.map((item, idx) => {
            switch (item.type) {
                case 'text':
                    return <ReactMarkdown key={idx}>{item.text}</ReactMarkdown>;
                case 'image_url':
                    return (
                        <div key={idx} className="relative flex justify-center">
                            <div className="relative">
                                <img
                                    src={item.image_url.url}
                                    alt="Uploaded"
                                    className="max-h-[300px] rounded-lg object-contain"
                                />
                            </div>
                        </div>
                    );
                case 'file_url':
                    return (
                        <FilePreview
                            key={idx}
                            file={{
                                name: item.file_url.name,
                                type: item.file_url.type,
                                url: item.file_url.url
                            }}
                            isUploading={false}
                            onRemove={() => {}}
                        />
                    );
                default:
                    return null;
            }
        });
    };

    return (
        <div className="flex flex-col space-y-4 p-4">
            {messages.map((message, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card className="p-4">
                        <div className="flex items-start gap-3">
                            <Avatar className="shrink-0">
                                <AvatarFallback>
                                    {message.role === 'assistant' ? (
                                        <Bot className="p-1" />
                                    ) : (
                                        <User className="p-1" />
                                    )}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-4 overflow-hidden">
                                {renderMessageContent(message.content)}
                            </div>
                        </div>
                    </Card>
                </motion.div>
            ))}
            {(isLoading || isStreaming) && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center space-x-2"
                >
                    <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </motion.div>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
}