import { Send, Image } from 'lucide-react'
import { useRef, useState } from 'react'
import { useSubscription } from '@/contexts/subscription-context'
import { useRouter } from 'next/navigation'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

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
    onFocusChange?: (focused: boolean) => void;
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
    sendMessage,
    onFocusChange
}: ChatInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const { plan } = useSubscription();
    const router = useRouter();
    const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

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
            <div className="flex items-center h-12 bg-background rounded-full shadow-md max-w-4xl mx-auto border border-border focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
                <div className="shrink-0 pl-2">
                    <button
                        type="button"
                        className="p-2 rounded-full hover:bg-muted transition-colors relative"
                        onClick={() => {
                            if (plan === 'free') {
                                setShowUpgradeDialog(true);
                                return;
                            }
                            fileInputRef.current?.click();
                        }}
                    >
                        <Image className="size-6" aria-label="Upload image" />
                        {/* {plan === 'free' && (
                            <span className="absolute -top-1 -right-1 text-[7px] font-medium text-primary bg-primary/10 rounded-lg px-1">
                                PRO
                            </span>
                        )} */}
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
                    onFocus={() => onFocusChange?.(true)}
                    onBlur={() => onFocusChange?.(false)}
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
                        <Send className="size-6" />
                    </button>
                </div>
            </div>
            <AlertDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Upgrade to Pro</AlertDialogTitle>
                        <AlertDialogDescription>
                            Image upload is only available to Pro users. Upgrade now to unlock all pro features.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => {
                            router.push('/payment');
                            setShowUpgradeDialog(false);
                        }}>
                            Upgrade to Pro
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </form>
    );
}