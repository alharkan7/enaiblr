'use client'

import { useState, useRef, useEffect } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { ChatTitle } from './components/ChatTitle'
import { MessageList } from './components/MessageList'
import { ChatInput } from './components/ChatInput'
import { DocumentPreview } from './components/DocumentPreview'
import { useFileUpload } from './hooks/useFileUpload'
import { useChatMessages } from './hooks/useChatMessages'
import { AnimatedBackground } from "../../components/animated-background"
import RenderFooter from '@/components/RenderFooter'

export default function Filechat() {
    const { messages, isLoading, sendMessage, clearMessages } = useChatMessages();
    const {
        isUploading,
        fileInfo,
        fileContent,
        handleFileChange,
        clearFile,
        error,
        setError,
        wordCount
    } = useFileUpload();

    useEffect(() => {
        if (error) {
            alert(error);
            setError(null);
        }
    }, [error, setError]);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [input, setInput] = useState('');
    const [hasUserSentMessage, setHasUserSentMessage] = useState(false);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (isMobile) {
                // First scroll the messages container
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });

                // Then scroll the window to ensure the input is visible
                setTimeout(() => {
                    window.scrollTo({
                        top: document.documentElement.scrollHeight,
                        behavior: 'smooth'
                    });
                }, 100);
            } else {
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    useEffect(() => {
        const scrollToBottom = () => {
            if (messagesEndRef.current) {
                // First scroll the messages container
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });

                // Then scroll the window to ensure the input is visible
                setTimeout(() => {
                    window.scrollTo({
                        top: document.documentElement.scrollHeight,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        };

        // Add a small delay when there's a file preview to ensure it's loaded
        if (fileInfo) {
            setTimeout(scrollToBottom, 100);
        } else {
            scrollToBottom();
        }
    }, [messages, fileInfo]);

    useEffect(() => {
        const adjustViewportHeight = () => {
            // Get the actual visible viewport height
            const visualViewport = window.visualViewport;
            if (visualViewport) {
                document.documentElement.style.height = `${visualViewport.height}px`;
            }
        };

        const handleKeyboardBehavior = () => {
            if (typeof window === 'undefined') return;

            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (!isMobile) return;

            // Set up viewport height
            adjustViewportHeight();

            // Update viewport height when keyboard appears/disappears
            window.visualViewport?.addEventListener('resize', adjustViewportHeight);

            return () => {
                window.visualViewport?.removeEventListener('resize', adjustViewportHeight);
            };
        };

        handleKeyboardBehavior();
    }, []);

    const handleSendMessage = async (text: string, fileContent: string | null) => {
        if (!text.trim() && !fileContent) return;

        if (!hasUserSentMessage && fileInfo) {
            setHasUserSentMessage(true);
        }
        await sendMessage(text, fileContent);
    };

    const handleReset = () => {
        clearMessages();
        clearFile();
        setInput('');
        setHasUserSentMessage(false);
    };

    return (
        <div 
            className="flex min-h-screen"
            style={{
                height: 'calc(var(--vh, 1vh) * 100)',
                minHeight: '-webkit-fill-available'
            }}
        >            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden relative">
                <AnimatedBackground />
                {hasUserSentMessage ? (
                    <ChatTitle
                        compact
                        clearMessages={handleReset}
                        fileName={fileInfo?.fileName}
                    />
                ) : null}
                <div className={`flex-1 overflow-hidden flex flex-col ${!hasUserSentMessage ? 'justify-center' : ''}`}>
                    {hasUserSentMessage ? (
                        <div className="flex-1 overflow-y-auto" ref={messagesEndRef}>
                            <MessageList
                                messages={messages}
                                messagesEndRef={messagesEndRef}
                                onUpdate={scrollToBottom}
                            />
                        </div>
                    ) : (
                        <ChatTitle clearMessages={handleReset} fileName={fileInfo?.fileName} />
                    )}
                    <div className={`flex flex-col justify-end w-full ${!hasUserSentMessage ? 'mt-0' : ''}`}>
                        <div className="w-full max-w-5xl mx-auto">
                            {fileInfo && !hasUserSentMessage && (
                                <div className="px-4">
                                    <DocumentPreview
                                        fileName={fileInfo.fileName}
                                        fileType={fileInfo.fileType}
                                        isUploading={isUploading}
                                        onRemove={clearFile}
                                        error={error}
                                        wordCount={wordCount}
                                    />
                                </div>
                            )}
                            <div className="relative">
                                <ChatInput
                                    input={input}
                                    setInput={setInput}
                                    isLoading={isLoading}
                                    fileInputRef={fileInputRef}
                                    onFileSelect={(e) => handleFileChange(e.target.files?.[0] || null)}
                                    // autoFocus={false}
                                    fileContent={fileContent}
                                    clearFile={clearFile}
                                    sendMessage={handleSendMessage}
                                    isFirstMessage={!hasUserSentMessage}
                                    isUploading={isUploading}
                                    wordCount={wordCount}
                                    error={error}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full">
                    <RenderFooter />
                </div>
            </div>
        </div>
    );
}