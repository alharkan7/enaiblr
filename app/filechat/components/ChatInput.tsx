import { Send, FileText, Upload } from 'lucide-react'
import { useRef } from 'react'
import { useDropzone } from 'react-dropzone'

interface ChatInputProps {
    input: string;
    setInput: (input: string) => void;
    isLoading: boolean;
    fileInputRef: React.RefObject<HTMLInputElement>;
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    autoFocus?: boolean;
    fileContent: string | null;
    clearFile: () => void;
    sendMessage: (text: string, fileContent: string | null) => Promise<void>;
    isFirstMessage: boolean;
    isUploading: boolean;
    wordCount: number;
    error: string | null;
}

export function ChatInput({
    input,
    setInput,
    isLoading,
    fileInputRef,
    onFileSelect,
    autoFocus,
    fileContent,
    clearFile,
    sendMessage,
    isFirstMessage,
    isUploading,
    wordCount,
    error
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isFirstMessage && !fileContent) {
            alert('Please attach a file first');
            return;
        }

        inputRef.current?.blur();
        const currentFileContent = fileContent;

        setInput('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        await sendMessage(input, currentFileContent);

        // Only clear the file input, but keep the fileInfo state for display
        // if (!isFirstMessage) {
        //     clearFile();
        // }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 space-y-4 w-full max-w-3xl mx-auto">
            {isFirstMessage && !isUploading && !fileContent && (
                <div className="max-w-xl mx-auto w-full"> {/* Added container for dropzone */}
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragActive
                                ? 'border-blue-500 bg-blue-50/90'
                                : 'border-gray-300 hover:border-gray-400 bg-white/90'
                            }`}
                    >
                        <input {...getInputProps()} />
                        <div>
                            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">
                                Drag & drop a file here, or click to select
                            </p>
                            {/* <p className="text-xs text-gray-500 mt-1">
                                Supported: PDF, DOC, DOCX, TXT, MD
                            </p> */}
                        </div>
                    </div>
                </div>
            )}
            <div className="flex flex-col space-y-4">
                <div className="flex items-center px-2 bg-white rounded-full shadow-md mx-auto border border-gray-200 w-full">
                    <input
                        type="text"
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isFirstMessage ? 'Ask your document...' : 'Type a message...'}
                        className="flex-1 px-4 py-3 bg-transparent focus:outline-none"
                        disabled={isLoading}
                        autoFocus={autoFocus}
                    />
                    <div className="shrink-0 p-2">
                        <button
                            type="submit"
                            disabled={isLoading || (!input.trim() && !fileContent)}
                            className={`p-2 rounded-full transition-colors ${isLoading || (!input.trim() && !fileContent)
                                    ? 'text-gray-400'
                                    : 'text-blue-600 hover:bg-gray-100'
                                }`}
                        >
                            <Send className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}