import { Send, Paperclip } from 'lucide-react'
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
import { FilePreview } from './FilePreview'

interface ChatInputProps {
    input: string;
    setInput: (input: string) => void;
    isLoading: boolean;
    fileInputRef: React.RefObject<HTMLInputElement>;
    autoFocus?: boolean;
    clearFile: () => void;
    sendMessage: (text: string, file: { name: string; type: string; url: string } | null) => Promise<void>;
    onFocusChange?: (focused: boolean) => void;
    file: { name: string; type: string; url: string; uploaded?: boolean } | null;  // Add uploaded flag
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;  // Make async
}

export function ChatInput({
    input,
    setInput,
    isLoading,
    fileInputRef,
    onFileSelect,
    autoFocus,
    file,
    clearFile,
    sendMessage,
    onFocusChange
}: ChatInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const { plan } = useSubscription();
    const router = useRouter();
    const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        inputRef.current?.blur();

        // Only proceed if we have input text or an uploaded file
        if (input.trim() || (file && file.uploaded)) {
            await sendMessage(input, file);
            setInput('');
            clearFile();
        }
    };

    const handleFileClick = () => {
        // if (plan === 'free') {
        //     setShowUpgradeDialog(true);
        //     return;
        // }
        fileInputRef.current?.click();
    };

    return (
        <>
            <div className="relative flex flex-col gap-2">
                {file && !isLoading && (
                    <div className="w-full">
                        <FilePreview
                            file={file}
                            isUploading={true}
                            onRemove={clearFile}
                        />
                    </div>
                )}
                <form onSubmit={handleSubmit} className="relative flex items-center gap-1.5 rounded-full border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-1 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={onFileSelect}
                        accept="*/*"
                    />
                    <button
                        type="button"
                        onClick={handleFileClick}
                        className="shrink-0 p-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                        disabled={isLoading}
                        aria-label="Attach file"
                    >
                        <Paperclip className="size-5" />
                    </button>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Send a message..."
                        className="flex-1 bg-transparent focus:outline-none disabled:opacity-50"
                        disabled={isLoading}
                        autoFocus={autoFocus}
                        onFocus={() => onFocusChange?.(true)}
                        onBlur={() => onFocusChange?.(false)}
                    />
                    <button
                        type="submit"
                        className="shrink-0 p-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                        disabled={isLoading || (!input.trim() && !file)}
                        aria-label="Send message"
                    >
                        <Send className="size-5" />
                    </button>
                </form>
            </div>

            <AlertDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Upgrade Required</AlertDialogTitle>
                        <AlertDialogDescription>
                            File attachments are only available for paid users. Upgrade your plan to unlock this feature.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => router.push('/account')}>
                            Upgrade Now
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}