import { useState } from 'react';
import { Message } from '../components/types';

export function useChatMessages() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const clearMessages = () => {
        setMessages([]);
        setIsLoading(false);
    };

    const formatMessage = (msg: Message): any => ({
        role: msg.role,
        content: Array.isArray(msg.content) 
            ? msg.content.map(c => c.type === 'text' ? c.text : '').join('\n')
            : msg.content
    });

    const sendMessage = async (input: string, documentContent: string | null) => {
        if ((!input.trim() && !documentContent) || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: [
                { type: 'text' as const, text: input.trim() },
                ...(documentContent ? [{ type: 'text' as const, text: `\nDocument content:\n${documentContent}` }] : [])
            ]
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/filechat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...messages.map(formatMessage), formatMessage(userMessage)],
                })
            });

            if (!response.ok) throw new Error('Failed to send message');

            const reader = response.body?.getReader();
            if (!reader) throw new Error('No reader available');

            let assistantMessage = '';
            const userMessages = [...messages, userMessage];
            setMessages(userMessages);

            // Process the stream
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                // Decode the stream data
                const chunk = new TextDecoder().decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            assistantMessage += data.content;  // Accumulate the chunks

                            setMessages([
                                ...userMessages,
                                {
                                    role: 'assistant',
                                    content: [{ type: 'text', text: assistantMessage }]
                                }
                            ]);
                        } catch (e) {
                            console.error('Error parsing SSE data:', e);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev.slice(0, -1)]);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        messages,
        isLoading,
        sendMessage,
        clearMessages,
    };
}