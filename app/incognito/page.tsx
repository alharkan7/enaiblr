'use client'

import { useState, useRef, useEffect } from 'react'
import { ChatTitle } from './components/ChatTitle'
import { MessageList } from './components/MessageList'
import { ChatInput } from './components/ChatInput'
import { ImagePreview } from './components/ImagePreview'
import { useImageUpload } from './hooks/useImageUpload'
import { useChatMessages } from './hooks/useChatMessages'
import AppsFooter from '@/components/apps-footer';
import { AppsHeader } from '@/components/apps-header'
import { RefreshCw } from 'lucide-react'

export default function MinimalistChatbot() {
    const { messages, isLoading, sendMessage, clearMessages } = useChatMessages();
    const {
        isUploading,
        localImageUrl,
        imageBase64,
        clearImages,
        handleImageChange,
    } = useImageUpload();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [input, setInput] = useState('');
    const [hasUserSentMessage, setHasUserSentMessage] = useState(false);

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

    const handleSendMessage = async (text: string, imageBase64: string | null) => {
        if (!hasUserSentMessage) {
            setHasUserSentMessage(true);
        }
        await sendMessage(text, imageBase64);
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

        // Add a small delay when there's an image preview to ensure it's loaded
        if (localImageUrl) {
            setTimeout(scrollToBottom, 100);
        } else {
            scrollToBottom();
        }
    }, [messages, localImageUrl]);

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

    useEffect(() => {
        const handleMobileReflow = () => {
            if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
                setTimeout(() => {
                    window.scrollTo(0, 0);
                    document.body.style.display = 'none';
                    document.body.offsetHeight; // Force reflow
                    document.body.style.display = '';
                }, 100);
            }
        };

        handleMobileReflow();
    }, [messages]);

    useEffect(() => {
        // Lock body scroll when keyboard is open on mobile
        const lockBodyScroll = () => {
            if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
                document.body.style.position = 'fixed';
                document.body.style.width = '100%';
            }
        };

        const unlockBodyScroll = () => {
            if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
                document.body.style.position = '';
                document.body.style.width = '';
            }
        };

        window.addEventListener('focus', lockBodyScroll);
        window.addEventListener('blur', unlockBodyScroll);

        return () => {
            window.removeEventListener('focus', lockBodyScroll);
            window.removeEventListener('blur', unlockBodyScroll);
        };
    }, []);

    useEffect(() => {
        const handleKeyboardBehavior = () => {
            const handleResize = () => {
                if (window.innerHeight > window.screen.height * 0.7) {
                    document.body.style.overflowY = 'hidden';
                } else {
                    document.body.style.overflowY = 'auto';
                }
            };

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
            };
        };

        handleKeyboardBehavior();
    }, []);

    const handleInputImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        handleImageChange(file);
    };

    return (
        <div
            className="flex flex-col h-screen relative chat-layout w-full overflow-x-hidden"
            style={{
                height: 'calc(var(--vh, 1vh) * 100)',
            }}
        >
            {messages.length === 0 ? (
                <div className="flex flex-col flex-1">
                    <div className="sticky top-0 z-50 bg-background">
                        <AppsHeader />
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8">
                        <div className="w-full max-w-[1200px]">
                            <div className="text-center py-8">
                                <h1 className="text-4xl font-extrabold mb-2">
                                    <span className="whitespace-nowrap">Disposable</span>{' '}
                                    <span className="whitespace-nowrap">AI Chat</span>
                                </h1>
                                <p className="text-sm text-gray-500">
                                    <b>No Limits. Not Recorded.</b>
                                </p>
                            </div>
                            <div className="w-full max-w-3xl mt-8 mx-auto">
                                {localImageUrl && (
                                    <ImagePreview
                                        localImageUrl={localImageUrl}
                                        isUploading={isUploading}
                                        onRemove={() => {
                                            clearImages();
                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = '';
                                            }
                                        }}
                                    />
                                )}
                                <ChatInput
                                    input={input}
                                    setInput={setInput}
                                    isLoading={isLoading}
                                    fileInputRef={fileInputRef}
                                    onImageSelect={handleInputImageChange}
                                    imageBase64={imageBase64}
                                    clearImages={clearImages}
                                    sendMessage={handleSendMessage}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex-none">
                        <AppsFooter />
                    </div>
                </div>
            ) : (
                <div className="flex flex-col w-full h-[100dvh]">
                    <div className="flex flex-col w-full min-w-[320px] max-w-[1200px] mx-auto h-full">
                        {/* Header wrapper with higher z-index */}
                        <div className="sticky top-0 z-50 bg-background">
                            <AppsHeader
                                title={
                                    <span className="text-xl font-semibold">
                                        Disposable Chat
                                    </span>
                                }
                                leftButton={
                                    <button
                                        onClick={clearMessages}
                                        className="p-2 hover:bg-muted rounded-full transition-colors"
                                        title="Clear chat history"
                                    >
                                        <RefreshCw className="size-5 text-muted-foreground" />
                                    </button>
                                }
                            />
                        </div>
                        {/* Main content area */}
                        <div className="flex-1 overflow-hidden flex flex-col">
                            {/* Message list with proper overflow handling */}
                            <div className="flex-1 overflow-y-auto">
                                <MessageList
                                    messages={messages}
                                    messagesEndRef={messagesEndRef}
                                    onUpdate={() => {
                                        scrollToBottom();
                                    }}
                                />
                            </div>
                            {/* Input area fixed at bottom */}
                            <div className="flex-none w-full backdrop-blur-sm bg-background/80">
                                <div className="max-w-[1200px] mx-auto">
                                    {localImageUrl && (
                                        <ImagePreview
                                            localImageUrl={localImageUrl}
                                            isUploading={isUploading}
                                            onRemove={() => {
                                                clearImages();
                                                if (fileInputRef.current) {
                                                    fileInputRef.current.value = '';
                                                }
                                            }}
                                        />
                                    )}
                                    <ChatInput
                                        input={input}
                                        setInput={setInput}
                                        isLoading={isLoading}
                                        fileInputRef={fileInputRef}
                                        onImageSelect={handleInputImageChange}
                                        imageBase64={imageBase64}
                                        clearImages={clearImages}
                                        sendMessage={handleSendMessage}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}