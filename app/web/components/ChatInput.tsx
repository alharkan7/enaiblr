import { Send, Image } from 'lucide-react'
import { useRef, useState } from 'react'
import { useSubscription } from '@/contexts/subscription-context'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface ChatInputProps {
    input: string;
    setInput: (input: string) => void;
    isLoading: boolean;
    fileInputRef: React.RefObject<HTMLInputElement>;
    autoFocus?: boolean;
    sendMessage: (text: string) => Promise<void>;
    onFocusChange?: (focused: boolean) => void;
}

export function ChatInput({ 
    input, 
    setInput, 
    isLoading, 
    fileInputRef, 
    autoFocus,
    sendMessage,
    onFocusChange
}: ChatInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
    const { plan } = useSubscription();
    const router = useRouter();
    const CHARACTER_LIMIT = 20;

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (plan === 'free' && newValue.length > CHARACTER_LIMIT) {
            setShowUpgradeDialog(true);
            return;
        }
        setInput(newValue);
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="p-4">
                <div className="flex pl-2 items-center bg-background rounded-full shadow-md max-w-4xl mx-auto border border-input relative focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        onFocus={() => onFocusChange?.(true)}
                        onBlur={() => onFocusChange?.(false)}
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

            <AlertDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Upgrade to Pro</AlertDialogTitle>
                        <AlertDialogDescription>
                            Free users are limited to {CHARACTER_LIMIT} characters per message. Upgrade to Pro to send longer messages.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => router.push('/settings/billing')}>
                            Upgrade to Pro
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}