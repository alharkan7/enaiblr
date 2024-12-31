import { Send, Image } from 'lucide-react'
import { useRef } from 'react'

interface ChatInputProps {
    input: string;
    setInput: (input: string) => void;
    isLoading: boolean;
    fileInputRef: React.RefObject<HTMLInputElement>;
    onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    autoFocus?: boolean;
    imageBase64: string | null;
    clearImages: () => void;
    sendMessage: (text: string, imageBase64: string | null) => Promise<void>;
}

export function ChatInput({ 
    input, 
    setInput, 
    isLoading, 
    fileInputRef, 
    onImageSelect, 
    autoFocus,
    imageBase64,
    clearImages,
    sendMessage
}: ChatInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Blur input immediately to hide keyboard
        inputRef.current?.blur();
        
        const currentImageBase64 = imageBase64;
        
        // Clear form state
        clearImages();
        setInput('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        // Send message
        await sendMessage(input, currentImageBase64);
    };

    return (
        <form onSubmit={handleSubmit} className="p-4">
            <div className="flex items-center bg-background rounded-full shadow-md max-w-4xl mx-auto border border-border">
                <div className="shrink-0 pl-2">
                    <button
                        type="button"
                        className="p-2 rounded-full hover:bg-muted transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Image className="w-6 h-6" />
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={onImageSelect}
                        className="hidden"
                    />
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Send a message..."
                    className="flex-1 px-4 py-2 bg-transparent focus:outline-none text-foreground placeholder:text-muted-foreground min-w-0"
                    disabled={isLoading}
                    autoFocus={autoFocus}
                />
                <div className="shrink-0 pr-2">
                    <button
                        type="submit"
                        disabled={!input.trim() && !imageBase64}
                        className="p-2 rounded-full hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </form>
    );
}