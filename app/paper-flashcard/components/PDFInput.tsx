import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookText, MoveRight, ClipboardCheck, X, FileText, Upload } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface PDFInputProps {
  pdfLink: string;
  handleLinkChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileChange: (file: File | null) => void;
  handleProcess: () => void;
  errorMessage: string;
}

export const PDFInput = ({
  pdfLink,
  handleLinkChange,
  handleFileChange,
  handleProcess,
  errorMessage,
}: PDFInputProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setSelectedFile(acceptedFiles[0]);
      handleFileChange(acceptedFiles[0]);
    }
  }, [handleFileChange]);

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
          className={`w-full border-2 border-dashed ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted'
            } rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/10 transition-all group`}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          {selectedFile ? (
            <>
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                title="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-2">
                <p className="font-medium text-foreground">
                  Drop your PDF here, or <span className="text-primary">browse</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Maximum file size: 10MB
                </p>
              </div>
            </div>
          )}
        </div>
        <p className="text-center text-sm text-muted-foreground">or</p>
        <Input
          type="text"
          placeholder="Paste a .pdf link here"
          value={pdfLink}
          onChange={handleLinkChange}
        />
      </div>

      {errorMessage && (
        <p className="text-sm text-destructive text-center">{errorMessage}</p>
      )}

      <Button
        onClick={handleProcess}
        disabled={!pdfLink && !selectedFile}
        className="w-full"
      >
        Create
      </Button>
    </div>
  );
};
