'use client'

import { useState, useRef, useEffect } from 'react'
import { ChatTitle } from './components/ChatTitle'
import { MessageList } from './components/MessageList'
import { ChatInput } from './components/ChatInput'
import { useChatMessages } from './hooks/useChatMessages'
import AppsFooter from '@/components/apps-footer'
import { AppsHeader } from '@/components/apps-header'

export default function MinimalistChatbot() {
    const { messages, isLoading, sendMessage, clearMessages } = useChatMessages();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [input, setInput] = useState('');
    const [hasUserSentMessage, setHasUserSentMessage] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [linkMode, setLinkMode] = useState(false);

    const handleSendMessage = async (text: string, isLinkMode: boolean = false) => {
        if (!hasUserSentMessage) {
            setHasUserSentMessage(true);
        }
        setInput(''); // Clear input immediately after sending
        await sendMessage(text, isLinkMode);
    };

    const handleLinkModeChange = (mode: boolean) => {
        setLinkMode(mode);
    };

    useEffect(() => {
        const adjustViewportHeight = () => {
            const visualViewport = window.visualViewport;
            const height = visualViewport ? visualViewport.height : window.innerHeight;
            document.documentElement.style.setProperty('--vh', `${height * 0.01}px`);
        };

        adjustViewportHeight();

        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', adjustViewportHeight);
            window.visualViewport.addEventListener('scroll', adjustViewportHeight);
        }

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

    return (
        <div
            className="flex flex-col h-screen relative chat-layout"
            style={{
                height: 'calc(var(--vh, 1vh) * 100)',
                minHeight: '-webkit-fill-available'
            }}
        >
            {messages.length === 0 ? (
                <div className="flex flex-col flex-grow">
                    <AppsHeader />
                    <div className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 md:px-8">
                        <div className="w-full max-w-[1200px]">
                            <ChatTitle 
                                clearMessages={clearMessages} 
                                chatMode={linkMode ? 'gemini' : 'tavily'}
                            />
                            <div className="w-full max-w-3xl mt-8 mx-auto">
                                <ChatInput
                                    input={input}
                                    setInput={setInput}
                                    isLoading={isLoading}
                                    fileInputRef={fileInputRef}
                                    sendMessage={handleSendMessage}
                                    onFocusChange={setIsInputFocused}
                                    onLinkModeChange={handleLinkModeChange}
                                    hasMessages={messages.length > 0}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={`w-full mt-8 ${isInputFocused ? 'hidden' : ''}`}>
                        <AppsFooter />
                    </div>
                </div>
            ) : (
                <div className="flex flex-col h-full w-full">
                    <div className="flex flex-col w-full min-w-[320px] max-w-[1200px] mx-auto h-full">
                        <div className="flex flex-col h-full">
                            <div className="flex-none">
                                <ChatTitle
                                    compact={hasUserSentMessage}
                                    clearMessages={clearMessages}
                                    chatMode={linkMode ? 'gemini' : 'tavily'}
                                />
                            </div>
                            <div className="flex-1 relative overflow-hidden">
                                <MessageList
                                    messages={messages}
                                    messagesEndRef={messagesEndRef}
                                    onUpdate={() => {}}
                                    isLoading={isLoading}
                                />
                            </div>
                            <div className="w-full backdrop-blur-sm border-gray-200 sticky bottom-0 z-10">
                                <ChatInput
                                    input={input}
                                    setInput={setInput}
                                    isLoading={isLoading}
                                    fileInputRef={fileInputRef}
                                    sendMessage={handleSendMessage}
                                    onFocusChange={setIsInputFocused}
                                    onLinkModeChange={handleLinkModeChange}
                                    hasMessages={messages.length > 0}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}