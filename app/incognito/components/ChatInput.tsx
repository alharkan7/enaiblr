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
            <div className="flex items-center bg-white rounded-full shadow-md max-w-4xl mx-auto border border-gray-200">
                <div className="shrink-0">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 pl-4 hover:bg-gray-100 focus:outline-none rounded-l-full"
                    >
                        <Image className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={onImageSelect}
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