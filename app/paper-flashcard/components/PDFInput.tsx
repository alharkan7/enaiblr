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
    <div className="flex flex-col items-center justify-center w-full">
      <Card className="w-full max-w-md p-6 space-y-4 shadow-lg border border-blue-200">
        <div className="flex flex-col items-center mb-4">
          <div className="flex items-center gap-2 text-4xl text-blue-500 mb-8">
            <BookText size={48} />
            <MoveRight size={48} />
            <ClipboardCheck size={48} />
          </div>
          <h1 className="text-2xl font-bold text-center text-blue-600">
            Paper to Flashcards
          </h1>
          <h6 className="text-s text-center text-blue-600">
            Turn Any Science Paper into Easy-to-Read Flashcards
          </h6>
        </div>
        <Input
          type="text"
          placeholder="Paste a .pdf link here"
          value={pdfLink}
          onChange={handleLinkChange}
          className="border-blue-200 focus:border-blue-500"
        />
        <div className="text-center text-sm text-gray-500">or</div>
        <div
          className={`relative border-2 border-dashed ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-blue-200'
          } rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group`}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          {selectedFile ? (
            <>
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-blue-600">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-blue-100 text-gray-500 hover:text-blue-600 transition-colors"
                title="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <div className="space-y-2">
                <p className={`font-medium text-lg ${
                  isDragActive ? 'text-blue-600' : 'text-gray-700'
                } group-hover:text-blue-600 transition-colors`}>
                  {isDragActive ? 'Drop your PDF here' : 'Upload your PDF'}
                </p>
                <p className="text-sm text-gray-500">
                  Drag & drop or click to browse
                </p>
              </div>
            </div>
          )}
        </div>
        {errorMessage && (
          <div className="text-red-500 text-sm text-center">{errorMessage}</div>
        )}
        <Button
          onClick={handleProcess}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          Process PDF
        </Button>
      </Card>
    </div>
  );
};
