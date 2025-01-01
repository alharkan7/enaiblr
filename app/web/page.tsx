'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageList } from './components/MessageList'
import { ChatInput } from './components/ChatInput'
import { useChatMessages } from './hooks/useChatMessages'
import { AppsHeader } from '@/components/apps-header'
import AppsFooter from '@/components/apps-footer'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

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

    const handleReset = () => {
        setHasUserSentMessage(false);
        clearMessages();
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
            <div className="flex min-h-dvh flex-col">
                <AppsHeader 
                    title={hasUserSentMessage ? (
                        <div className="flex items-center gap-2">
                            <span>Web Search</span>
                        </div>
                    ) : undefined}
                    leftButton={hasUserSentMessage ? (
                        <Button
                            variant="ghost"
                            onClick={handleReset}
                        >
                            <RefreshCw className="size-4" />
                        </Button>
                    ) : undefined}
                />
                {!hasUserSentMessage ? (
                    <div className="flex-1 flex flex-col justify-center items-center gap-8 max-w-5xl mx-auto w-full px-4">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-center">Web&nbsp;Search <span className='text-primary'>Assistant</span></h1>
                        <div className="w-full">
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
                    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
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
                        <div className="flex-none">
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
                <div className="flex-none">
                    <AppsFooter />
                </div>
            </div>
        </>
    )
}