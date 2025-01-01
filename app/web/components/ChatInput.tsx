import { Send, Image } from 'lucide-react'
import { useRef } from 'react'

interface ChatInputProps {
    input: string;
    setInput: (input: string) => void;
    isLoading: boolean;
    fileInputRef: React.RefObject<HTMLInputElement>;
    autoFocus?: boolean;
    sendMessage: (text: string) => Promise<void>;
}

export function ChatInput({ 
    input, 
    setInput, 
    isLoading, 
    fileInputRef, 
    autoFocus,
    sendMessage
}: ChatInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Blur input immediately to hide keyboard
        inputRef.current?.blur();
        
        
        // Clear form state
        setInput('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        // Send message
        await sendMessage(input);
    };

    return (
        <form onSubmit={handleSubmit} className="p-4">
            <div className="flex pl-2 items-center bg-background rounded-full shadow-md max-w-4xl mx-auto border border-input relative focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                />

                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-3 pr-12 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
                    disabled={isLoading}
                    autoFocus={autoFocus}
                />

                <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 p-2 rounded-full text-primary hover:text-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Send className="size-5" />
                </button>
            </div>
        </form>
    );
}