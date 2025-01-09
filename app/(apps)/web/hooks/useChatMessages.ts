import { useState } from 'react';
import { Message } from '../components/types';

export function useChatMessages() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const clearMessages = () => {
        setMessages([]);
        setIsLoading(false);
    };

    const sendMessage = async (input: string) => {
        if ((!input.trim()) || isLoading) return;

        const userMessage: Message = {
            id: crypto.randomUUID(),
            role: 'user',
            content: [{ type: 'text' as const, text: input.trim() }]
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/web', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to send message');
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error('No reader available');

            const textDecoder = new TextDecoder();
            let receivedResponse = false;
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                if (value) {
                    const chunk = textDecoder.decode(value);
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.slice(6));
                                if (data.type === 'sources') {
                                    // Initialize assistant message with empty content but with sources
                                    const assistantMessage: Message = {
                                        id: crypto.randomUUID(),
                                        role: 'assistant',
                                        content: [{ 
                                            type: 'text' as const, 
                                            text: '' 
                                        }],
                                        sources: data.sources
                                    };
                                    setMessages(prev => [...prev, assistantMessage]);
                                } else if (data.type === 'content') {
                                    // Update the assistant message with new content
                                    setMessages(prev => {
                                        const lastMessage = prev[prev.length - 1];
                                        if (lastMessage?.role === 'assistant' && Array.isArray(lastMessage.content)) {
                                            const textContent = lastMessage.content[0];
                                            if (textContent && textContent.type === 'text') {
                                                return [
                                                    ...prev.slice(0, -1),
                                                    {
                                                        ...lastMessage,
                                                        content: [{ 
                                                            type: 'text' as const, 
                                                            text: textContent.text + data.content 
                                                        }]
                                                    }
                                                ];
                                            }
                                        }
                                        return prev;
                                    });
                                }
                            } catch (e) {
                                console.error('Error parsing SSE data:', e);
                                continue;
                            }
                        }
                    }
                }
            }

            if (!receivedResponse) {
                setMessages(prev => {
                    const lastMessage = prev[prev.length - 1];
                    if (lastMessage?.role === 'assistant' && Array.isArray(lastMessage.content)) {
                        const textContent = lastMessage.content[0];
                        if (textContent && textContent.type === 'text' && textContent.text === '') {
                            // If we have an empty assistant message, add an error message
                            return [
                                ...prev.slice(0, -1),
                                {
                                    ...lastMessage,
                                    content: [{ 
                                        type: 'text' as const, 
                                        text: 'Sorry, there was an error generating the response. Please try again.' 
                                    }]
                                }
                            ];
                        }
                    }
                    return prev;
                });
            }
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage?.role === 'assistant' && Array.isArray(lastMessage.content)) {
                    const textContent = lastMessage.content[0];
                    if (textContent && textContent.type === 'text') {
                        // If we have a partial response, keep it and add error message
                        return [
                            ...prev.slice(0, -1),
                            {
                                ...lastMessage,
                                content: [{ 
                                    type: 'text' as const, 
                                    text: textContent.text + '\n\n[Error: Response was interrupted. The above response may be incomplete.]'
                                }]
                            }
                        ];
                    }
                }
                return prev.slice(0, -1); // Remove the user message if no response started
            });
        } finally {
            setIsLoading(false);
        }
    };

    return { messages, isLoading, sendMessage, clearMessages };
}