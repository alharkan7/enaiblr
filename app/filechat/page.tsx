'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageList } from './components/MessageList'
import { ChatInput } from './components/ChatInput'
import { DocumentPreview } from './components/DocumentPreview'
import { useFileUpload } from './hooks/useFileUpload'
import { useChatMessages } from './hooks/useChatMessages'
import RenderFooter from '@/components/RenderFooter'
import { AppsHeader } from '@/components/apps-header'
import { RefreshCw } from 'lucide-react'

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
        >
            <div className="flex-1 flex flex-col overflow-hidden relative">
                <header className="sticky top-0 left-0 w-full z-10 bg-background">
                    <div className="max-w-4xl mx-auto relative">
                        {hasUserSentMessage && (
                            <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20">
                                <button
                                    onClick={handleReset}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    title="Clear chat history"
                                >
                                    <RefreshCw className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        )}
                        <AppsHeader
                            title={hasUserSentMessage ? (
                                <div className="flex items-center gap-2">
                                    <span>Chat with</span>
                                    {fileInfo?.fileName && (
                                        <span className="text-blue-600 truncate max-w-[150px]">
                                            {fileInfo.fileName}
                                        </span>
                                    )}
                                </div>
                            ) : undefined}
                        />
                    </div>
                </header>
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
                        <div className="flex-1 flex flex-col justify-center items-center gap-8 max-w-5xl mx-auto w-full px-4">
                            <h1 className="text-4xl font-extrabold text-center">Chat&nbsp;with&nbsp;PDFs <span className='text-blue-600'>and&nbsp;Docs</span></h1>
                            {fileInfo && (
                                <div className="w-full">
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
                            <div className="w-full">
                                <ChatInput
                                    input={input}
                                    setInput={setInput}
                                    isLoading={isLoading}
                                    fileInputRef={fileInputRef}
                                    onFileSelect={(e) => handleFileChange(e.target.files?.[0] || null)}
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
                    )}
                    <div className={`flex flex-col justify-end w-full ${!hasUserSentMessage ? 'hidden' : ''}`}>
                        <div className="w-full max-w-5xl mx-auto">
                            <div className="relative">
                                <ChatInput
                                    input={input}
                                    setInput={setInput}
                                    isLoading={isLoading}
                                    fileInputRef={fileInputRef}
                                    onFileSelect={(e) => handleFileChange(e.target.files?.[0] || null)}
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