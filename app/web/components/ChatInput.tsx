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
            <div className="flex pl-2 items-center bg-white rounded-full shadow-md max-w-4xl mx-auto border border-gray-200">

                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                />

                <input
                    type="text"
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-3 bg-transparent focus:outline-none min-w-0"
                    autoFocus={autoFocus}
                />

                <div className="shrink-0">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`p-3 pr-4 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'} focus:outline-none rounded-r-full`}
                    >
                        <Send className="w-6 h-6 text-blue-500" />
                    </button>
                </div>
            </div>
        </form>
    );
}