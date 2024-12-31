'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageList } from './components/MessageList'
import { ChatInput } from './components/ChatInput'
import { useChatMessages } from './hooks/useChatMessages'
import { AppsHeader } from '@/components/apps-header'
import { RefreshCw } from 'lucide-react'

export default function MinimalistChatbot() {
    const { messages, isLoading, sendMessage, clearMessages } = useChatMessages();

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

    const handleSendMessage = async (text: string) => {
        if (!hasUserSentMessage) {
            setHasUserSentMessage(true);
        }
        await sendMessage(text);
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

    }, [messages]);

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

    return (
        <>
            <div
                className="flex flex-col h-screen relative chat-layout"
                style={{
                    height: 'calc(var(--vh, 1vh) * 100)',
                    minHeight: '-webkit-fill-available'
                }}
            >
                <header className="sticky top-0 left-0 w-full z-10 bg-background">
                    <div className="max-w-4xl mx-auto relative">
                        {messages.length > 0 && (
                            <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20">
                                <button
                                    onClick={clearMessages}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    title="Clear chat history"
                                >
                                    <RefreshCw className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        )}
                        <AppsHeader
                            title={messages.length > 0 ? (
                                <div className="flex items-center gap-2">
                                    Chat with the Web
                                </div>
                            ) : undefined}
                        />
                    </div>
                </header>
                {messages.length === 0 ? (
                    <div className="flex-1 flex flex-col justify-center items-center gap-8 max-w-5xl mx-auto w-full px-4">
                        <h1 className="text-4xl font-extrabold">
                            <span className="whitespace-nowrap">Chat with </span>{' '}
                            <span className="whitespace-nowrap">the Web</span>
                        </h1>
                        <div className="w-full max-w-xl">
                            <ChatInput
                                input={input}
                                setInput={setInput}
                                isLoading={isLoading}
                                sendMessage={handleSendMessage}
                                fileInputRef={fileInputRef}
                                autoFocus
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="flex-1 overflow-y-auto">
                            <div className="max-w-4xl mx-auto">
                                <MessageList
                                    messages={messages}
                                    messagesEndRef={messagesEndRef}
                                    onUpdate={scrollToBottom}
                                    isLoading={isLoading}
                                />
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                            <div className="max-w-4xl mx-auto px-4">
                                <ChatInput
                                    input={input}
                                    setInput={setInput}
                                    isLoading={isLoading}
                                    sendMessage={handleSendMessage}
                                    fileInputRef={fileInputRef}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}