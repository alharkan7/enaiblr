import { Send, FileText, Upload } from 'lucide-react'
import { useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useSubscription } from "@/contexts/subscription-context"
import {filechatFree_WordsLimit} from '@/config/freeLimits'

interface ChatInputProps {
  input: string;
  setInput: (input: string) => void;
  isLoading?: boolean;
  fileInputRef?: React.RefObject<HTMLInputElement>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
  fileContent: string | null;
  clearFile: () => void;
  sendMessage: (text: string, fileContent: string | null) => Promise<void>;
  isFirstMessage: boolean;
  isUploading: boolean;
  wordCount: number;
  error: string | null;
  showUpgradeDialog: boolean;
  setShowUpgradeDialog: (show: boolean) => void;
}

export function ChatInput({
  input,
  setInput,
  isLoading = false,
  fileInputRef,
  onFileSelect,
  autoFocus,
  fileContent,
  clearFile,
  sendMessage,
  isFirstMessage,
  isUploading,
  wordCount,
  error,
  showUpgradeDialog,
  setShowUpgradeDialog
}: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const event = {
        target: {
          files: acceptedFiles
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      onFileSelect(event);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md']
    },
    multiple: false
  });

  const router = useRouter();
  const { plan } = useSubscription();

  const isOverWordLimit = plan === 'free' && wordCount > filechatFree_WordsLimit;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isFirstMessage && !fileContent) {
      alert('Please attach a file first');
      return;
    }

    if (isOverWordLimit) {
      setShowUpgradeDialog(true);
      return;
    }

    inputRef.current?.blur();
    const currentFileContent = fileContent;

    setInput('');
    if (fileInputRef?.current) {
      fileInputRef.current.value = '';
    }

    await sendMessage(input, currentFileContent);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 w-full max-w-3xl mx-auto">
      {isFirstMessage && !isUploading && !fileContent && (
        <div className="max-w-xl mx-auto w-full">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50 bg-background'
            }`}
          >
            <input {...getInputProps()} />
            <div>
              <Upload className="size-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                <b>Drag & drop a file here, or click to select.</b>
                <br></br>
                Supported formats: .pdf, .doc, .docx, .txt, .md
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center px-2 bg-background rounded-full shadow-md mx-auto border border-border w-full max-w-xl focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
          <input
            type="text"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isFirstMessage ? 'Ask your document...' : 'Type a message...'}
            className="flex-1 px-4 py-3 bg-transparent focus:outline-none text-foreground placeholder:text-muted-foreground min-w-0 disabled:opacity-50"
            disabled={isOverWordLimit}
            autoFocus={autoFocus}
          />
          <div className="flex-none">
            <button
              type="submit"
              disabled={isLoading || (!input.trim() && !fileContent) || isOverWordLimit}
              className={`p-2 rounded-full transition-colors ${
                isLoading || (!input.trim() && !fileContent) || isOverWordLimit
                  ? 'text-muted-foreground'
                  : 'text-primary hover:bg-muted'
              }`}
            >
              <Send className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="text-sm text-destructive mt-2">
          {error}
        </div>
      )}

      <AlertDialog open={showUpgradeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Upgrade to Pro</AlertDialogTitle>
            <AlertDialogDescription>
              Your document has {wordCount?.toLocaleString('id-ID')} words. Free users are limited to documents with {filechatFree_WordsLimit.toLocaleString('id-ID')} words or less. 
              Upgrade to Pro to process larger documents and unlock advanced features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => {
              setShowUpgradeDialog(false);
              clearFile();
            }}>
              Cancel
            </Button>
            <Button onClick={() => {
              setShowUpgradeDialog(false);
              router.push('/payment');
            }} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Upgrade to Pro
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}