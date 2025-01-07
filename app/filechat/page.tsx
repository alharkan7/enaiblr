'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageList } from './components/MessageList'
import { ChatInput } from './components/ChatInput'
import { DocumentPreview } from './components/DocumentPreview'
import { useFileUpload } from './hooks/useFileUpload'
import { useChatMessages } from './hooks/useChatMessages'
import AppsFooter from '@/components/apps-footer';
import { AppsHeader } from '@/components/apps-header'
import { RefreshIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';

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
    const [isInputFocused, setIsInputFocused] = useState(false);

    useEffect(() => {
        const adjustViewportHeight = () => {
            // Get the actual visible viewport height
            const visualViewport = window.visualViewport;
            const height = visualViewport ? visualViewport.height : window.innerHeight;
            document.documentElement.style.setProperty('--vh', `${height * 0.01}px`);
        };

        // Initial adjustment
        adjustViewportHeight();

        // Listen to visualViewport changes if available
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', adjustViewportHeight);
            window.visualViewport.addEventListener('scroll', adjustViewportHeight);
        }

        // Fallback listeners
        window.addEventListener('resize', adjustViewportHeight);
        window.addEventListener('orientationchange', adjustViewportHeight);

        return () => {
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', adjustViewportHeight);
                window.visualViewport.removeEventListener('scroll', adjustViewportHeight);
            }
            window.removeEventListener('resize', adjustViewportHeight);
            window.removeEventListener('orientationchange', adjustViewportHeight);
        };
    }, []);

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
        <div className="flex flex-col h-[calc(var(--vh,1vh)*100)] overflow-hidden">
            {/* Header - fixed height */}
            <div className="h-[60px] flex-shrink-0">
                <div className="fixed top-0 left-0 right-0 z-10 bg-background border-border">
                    <div className="max-w-6xl mx-auto relative">
                        {hasUserSentMessage && (
                            <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20">
                                <Button
                                    onClick={handleReset}
                                    className="md:px-2 px-2 md:h-fit"
                                    title="Clear chat history"
                                    variant="outline"
                                >
                                    <RefreshIcon size={14} />
                                </Button>
                            </div>
                        )}
                        <AppsHeader
                            title={hasUserSentMessage ? (
                                <div className="flex items-center gap-2">
                                    <span className='text-lg'>Chat with</span>
                                    {fileInfo?.fileName && (
                                        <span className="text-lg text-primary truncate max-w-[150px]">
                                            {fileInfo.fileName}
                                        </span>
                                    )}
                                </div>
                            ) : undefined}
                        />
                    </div>
                </div>
            </div>

            {/* Main content - scrollable */}
            <div className="flex-1 overflow-hidden pt-[0px]">
                {hasUserSentMessage ? (
                    <MessageList
                        messages={messages}
                        messagesEndRef={messagesEndRef}
                        onUpdate={() => {}}
                        fileInfo={fileInfo}
                        isUploading={isUploading}
                        onRemoveFile={clearFile}
                        error={error}
                        wordCount={wordCount}
                    />
                ) : (
                    <div className="h-full flex flex-col justify-center items-center gap-8 max-w-5xl mx-auto w-full px-4">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-center">Chat&nbsp;with&nbsp;PDFs <span className='text-primary'>and&nbsp;Docs</span></h1>
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
            </div>

            {/* Footer - fixed height */}
            {hasUserSentMessage && (
                <div className="h-[100px] flex-shrink-0">
                    <div className="fixed bottom-0 left-0 right-0 bg-background border-border">
                        <div className="max-w-4xl mx-auto">
                            <ChatInput
                                input={input}
                                setInput={setInput}
                                isLoading={isLoading}
                                fileInputRef={fileInputRef}
                                onFileSelect={(e) => handleFileChange(e.target.files?.[0] || null)}
                                autoFocus
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
            )}
            <div className="w-full">
                {!hasUserSentMessage && <AppsFooter />}
            </div>
        </div>
    );
}