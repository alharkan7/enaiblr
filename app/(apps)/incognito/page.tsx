'use client'

import { useState, useRef, useEffect } from 'react'
import { ChatTitle } from './components/ChatTitle'
import { MessageList } from './components/MessageList'
import { ChatInput } from './components/ChatInput'
import { useChatMessages } from './hooks/useChatMessages'
import AppsFooter from '@/components/apps-footer'
import { AppsHeader } from '@/components/apps-header'
import { motion } from 'framer-motion'

export default function MinimalistChatbot() {
    const { messages, isLoading, isStreaming, sendMessage, clearMessages } = useChatMessages();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [input, setInput] = useState('');
    const [hasUserSentMessage, setHasUserSentMessage] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [file, setFile] = useState<{ name: string; type: string; url: string } | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

            if (isMobile) {
                requestAnimationFrame(() => {
                    messagesEndRef.current?.scrollIntoView({ block: 'end' });
                });
            } else {
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setIsUploading(true);
        try {
            // Convert file to base64
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setFile({
                    name: selectedFile.name,
                    type: selectedFile.type || 'application/octet-stream',
                    url: base64String
                });
                setIsUploading(false);
            };
            reader.readAsDataURL(selectedFile);
        } catch (error) {
            console.error('Error reading file:', error);
            setIsUploading(false);
        }
    };

    const handleSendMessage = async (text: string) => {
        if (!hasUserSentMessage) {
            setHasUserSentMessage(true);
        }
        await sendMessage(text, file);
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
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
    }, []);

    return (
        <div className="flex flex-col h-[100dvh] bg-background">
            <div className="flex-none">
                <AppsHeader />
            </div>
            <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex-none">
                    <ChatTitle clearMessages={clearMessages} />
                </div>
                <div className="flex-1 overflow-y-auto">
                    <MessageList
                        messages={messages}
                        messagesEndRef={messagesEndRef}
                        onUpdate={scrollToBottom}
                        isLoading={isLoading}
                        isStreaming={isStreaming}
                    />
                </div>
                <div className="flex-none p-4">
                    <ChatInput
                        input={input}
                        setInput={setInput}
                        isLoading={isLoading}
                        fileInputRef={fileInputRef}
                        onFileSelect={handleFileSelect}
                        autoFocus={true}
                        file={file}
                        clearFile={() => {
                            setFile(null);
                            if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                            }
                        }}
                        sendMessage={handleSendMessage}
                        onFocusChange={setIsInputFocused}
                    />
                </div>
            </div>
            <div className="flex-none">
                <AppsFooter />
            </div>
        </div>
    );
}