'use client'

import { useState, useRef, useEffect } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { ChatTitle } from './components/ChatTitle'
import { MessageList } from './components/MessageList'
import { ChatInput } from './components/ChatInput'
import { useChatMessages } from './hooks/useChatMessages'
import { AnimatedBackground } from "../../components/animated-background"
import RenderFooter from '@/components/RenderFooter'

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
            <Sidebar />
            <div
                className="flex flex-col h-screen relative chat-layout"
                style={{
                    height: 'calc(var(--vh, 1vh) * 100)',
                    minHeight: '-webkit-fill-available'
                }}
            >
                <AnimatedBackground />
                {messages.length === 0 ? (
                    <div className="flex flex-col flex-grow">
                        <div className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 md:px-8">
                            <div className="w-full max-w-[1200px]">
                                <ChatTitle clearMessages={clearMessages} />
                                <div className="w-full max-w-3xl mt-8 mx-auto">

                                    <ChatInput
                                        input={input}
                                        setInput={setInput}
                                        isLoading={isLoading}
                                        fileInputRef={fileInputRef}
                                        sendMessage={handleSendMessage}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="w-full mt-8">
                            <RenderFooter />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col h-full w-full">
                        <div className="flex flex-col w-full min-w-[320px] max-w-[1200px] mx-auto h-full">
                            <div className="flex flex-col h-full">
                                <div className="sticky top-0 backdrop-blur-sm z-10">
                                    <ChatTitle compact clearMessages={clearMessages} />
                                </div>
                                {/* Modified container for MessageList */}
                                <div className="flex-1 relative overflow-hidden">
                                    <MessageList
                                        messages={messages}
                                        messagesEndRef={messagesEndRef}
                                        onUpdate={() => {
                                            scrollToBottom();

                                        }}
                                        isLoading={isLoading}
                                    />
                                </div>
                                <div className="w-full border-t backdrop-blur-sm border-gray-200 sticky bottom-0 z-10">

                                    <ChatInput
                                        input={input}
                                        setInput={setInput}
                                        isLoading={isLoading}
                                        fileInputRef={fileInputRef}
                                        sendMessage={handleSendMessage}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}