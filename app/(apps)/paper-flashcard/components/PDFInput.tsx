import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, FileText, Upload } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSubscription } from '@/contexts/subscription-context';
import { paperFlashcardFree_PDFSizeLimit } from "@/config/freeLimits";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { US, ID } from 'country-flag-icons/react/3x2';

interface PDFInputProps {
  pdfLink: string;
  handleLinkChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileChange: (file: File | null) => void;
  handleProcess: () => void;
  errorMessage: string;
  language: 'en' | 'id';
  setLanguage: (lang: 'en' | 'id') => void;
}

export const PDFInput = ({
  pdfLink,
  handleLinkChange,
  handleFileChange,
  handleProcess,
  errorMessage,
  language,
  setLanguage,
}: PDFInputProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const { plan } = useSubscription();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      const file = acceptedFiles[0];
      if (file.size > (plan === 'free' ? paperFlashcardFree_PDFSizeLimit * 1024 * 1024 : 40 * 1024 * 1024)) {
        if (plan === 'free') {
          setShowUpgradeDialog(true);
          return;
        } else {
          // Show error for pro users exceeding 40MB
          return;
        }
      }
      setSelectedFile(file);
      handleFileChange(file);
    }
  }, [handleFileChange, plan]);

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    handleFileChange(null as any);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    onDrop
  });

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto gap-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold">
          Paper to Flashcards
        </h1>
        {/* <p className="text-l text-muted-foreground">
          Turn Any Science Paper into Easy-to-Read Flashcards
        </p> */}
      </div>

      <div className="w-full space-y-2">
        <div
          className={`relative w-full border-2 border-primary/30 border-dashed ${
            isDragActive && !selectedFile ? 'border-primary bg-primary/10' : 'border-muted'
          } rounded-lg p-8 text-center ${!selectedFile ? 'cursor-pointer hover:border-primary hover:bg-primary/10' : ''} transition-all group`}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          {selectedFile && (
            <button
              onClick={removeFile}
              className="absolute top-[-0.5rem] right-[-0.5rem] p-1.5 rounded-full bg-red-500 border shadow-sm hover:bg-red-600 text-white hover:text-red-100 transition-colors z-10"
              title="Remove file"
            >
              <X className="size-4" />
            </button>
          )}
          {selectedFile ? (
            <div className="flex flex-col items-center gap-3">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="size-6 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-foreground">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Upload className="size-6 text-primary" />
              </div>
              <div className="space-y-2">
                <p className="font-medium text-foreground">
                  Drop your PDF here
                </p>
                {/* <p className="text-sm text-muted-foreground">
                  Maximum file size: 10MB
                </p> */}
              </div>
            </div>
          )}
        </div>
        <p className="text-center text-sm text-muted-foreground">or</p>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Paste a .pdf link here"
            value={pdfLink}
            onChange={handleLinkChange}
            className="rounded-full"
          />
          <Button
            variant="outline"
            size="icon"
            className="rounded-lg w-10 h-10 inline-flex items-center justify-center p-0"
            onClick={() => setLanguage(language === 'en' ? 'id' : 'en')}
          >
            <span className="flex items-center justify-center w-full h-full">
              {language === 'en' ? <US title="Switch to Indonesian" /> : <ID title="Switch to English" />}
            </span>
          </Button>
        </div>
      </div>

      {errorMessage && (
        <p className="text-sm text-destructive text-center">{errorMessage}</p>
      )}

      <Button
        onClick={() => handleProcess()}
        disabled={!pdfLink && !selectedFile}
        className="w-full rounded-full"
      >
        Create
      </Button>
      <AlertDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Upgrade to Pro</AlertDialogTitle>
            <AlertDialogDescription>
              Free users are limited to {paperFlashcardFree_PDFSizeLimit}MB PDF files. Upgrade to Pro to upload larger files and unlock all features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>Cancel</Button>
            <Button onClick={() => window.location.href = '/payment'}>Upgrade Now</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
