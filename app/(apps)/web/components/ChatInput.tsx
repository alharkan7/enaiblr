import { Send, Image, Link } from 'lucide-react'
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
import { webFree_CharactersLimit } from '@/config/freeLimits'
import { toast } from 'sonner'

interface ChatInputProps {
    input: string;
    setInput: (input: string) => void;
    isLoading: boolean;
    fileInputRef: React.RefObject<HTMLInputElement>;
    autoFocus?: boolean;
    sendMessage: (text: string, linkMode: boolean) => Promise<void>;
    onFocusChange?: (focused: boolean) => void;
    onLinkModeChange?: (linkMode: boolean) => void;
    hasMessages: boolean;
}

export function ChatInput({ 
    input, 
    setInput, 
    isLoading, 
    fileInputRef, 
    autoFocus,
    sendMessage,
    onFocusChange,
    onLinkModeChange,
    hasMessages
}: ChatInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
    const [linkMode, setLinkMode] = useState(false);
    const { plan } = useSubscription();
    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (plan === 'free' && newValue.length > webFree_CharactersLimit) {
            setShowUpgradeDialog(true);
            return;
        }
        setInput(newValue);
    };

    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const canSubmit = linkMode 
        ? input.trim() && isValidUrl(input) && !isLoading
        : input.trim() && !isLoading;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Blur input immediately to hide keyboard
        inputRef.current?.blur();
        
        try {
            // Send message with linkMode flag
            await sendMessage(input, linkMode);
            
            // Clear form state only if successful
            setInput('');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            if (linkMode) {
                toast.error('Unable to process this URL', {
                    description: 'The content might be too large or inaccessible. Try a different URL or use regular chat mode.',
                    duration: 5000,
                });
                // Don't clear input so user can try a different URL
            } else {
                toast.error('Failed to send message', {
                    description: 'Please try again later.',
                });
            }
        }
    };

    const handleLinkModeChange = (newMode: boolean) => {
        setLinkMode(newMode);
        onLinkModeChange?.(newMode);
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="p-4">
                <div className="flex pl-2 items-center bg-background rounded-full shadow-md max-w-4xl mx-auto border border-input relative focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
                    <div className="w-full relative flex items-center">
                        {!hasMessages && (
                            <button
                                type="button"
                                onClick={() => handleLinkModeChange(!linkMode)}
                                className={`p-2 rounded-full transition-colors ${
                                    linkMode 
                                        ? "bg-primary text-primary-foreground hover:bg-primary/50" 
                                        : "text-muted-foreground hover:bg-muted hover:text-muted-foreground"
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                disabled={isLoading}
                            >
                                <Link className="size-5" />
                            </button>
                        )}
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={handleInputChange}
                            onFocus={() => onFocusChange?.(true)}
                            onBlur={() => onFocusChange?.(false)}
                            placeholder={linkMode ? "Type a valid URL..." : "Type a message..."}
                            className="flex-1 py-3 px-2 pr-12 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
                            disabled={isLoading}
                            autoFocus={autoFocus}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!canSubmit}
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
                            Free users are limited to {webFree_CharactersLimit} characters per message. Upgrade to Pro to send longer messages.
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