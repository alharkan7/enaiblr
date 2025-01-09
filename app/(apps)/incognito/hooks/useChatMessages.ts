import { useState } from 'react';
import { Message } from '../components/types';

export function useChatMessages() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const clearMessages = () => {
        setMessages([]);
        setIsLoading(false);
    };

    const toTogetherMessage = (msg: Message): any => ({
        role: msg.role,
        content: msg.content
    });

    const sendMessage = async (input: string, imageUrl: string | null) => {
        if ((!input.trim() && !imageUrl) || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: imageUrl ? [
                { type: 'image_url' as const, image_url: { url: imageUrl } },
                { type: 'text' as const, text: input.trim() }
            ] : [{ type: 'text' as const, text: input.trim() }]
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/incognito', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...messages.map(toTogetherMessage), toTogetherMessage(userMessage)],
                    imageUrl
                })
            });

            if (!response.ok) throw new Error('Failed to send message');

            const reader = response.body?.getReader();
            if (!reader) throw new Error('No reader available');

            let assistantMessage = '';
            const userMessages = [...messages, userMessage];
            setMessages(userMessages);

            const textDecoder = new TextDecoder();
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = textDecoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const { content } = JSON.parse(line.slice(6));
                            if (content) {
                                assistantMessage += content;
                                setMessages([
                                    ...userMessages,
                                    {
                                        role: 'assistant',
                                        content: [{ type: 'text', text: assistantMessage }]
                                    }
                                ]);
                            }
                        } catch (e) {
                            console.error('Error parsing SSE data:', e);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return { messages, isLoading, sendMessage, clearMessages };
}