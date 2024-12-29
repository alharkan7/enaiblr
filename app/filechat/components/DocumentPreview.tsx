import { FileText, File } from 'lucide-react';

interface DocumentPreviewProps {
    fileName: string;
    fileType: string;
    isUploading: boolean;
    onRemove: () => void;
    error?: string | null;
    wordCount?: number;
}

export function DocumentPreview({
    fileName,
    fileType,
    isUploading,
    onRemove,
    error,
    wordCount
}: DocumentPreviewProps) {
    const getFileIcon = () => {
        switch (fileType.toLowerCase()) {
            case 'pdf':
                return <FileText className="w-8 h-8 text-red-500" />;
            case 'doc':
            case 'docx':
                return <FileText className="w-8 h-8 text-blue-500" />;
            case 'txt':
                return <FileText className="w-8 h-8 text-gray-500" />;
            case 'md':
                return <FileText className="w-8 h-8 text-purple-500" />;
            default:
                return <File className="w-8 h-8 text-gray-500" />;
        }
    };

    const getFileExtension = (name: string) => {
        return name.split('.').pop() || '';
    };

    const getTruncatedName = (name: string) => {
        const extension = getFileExtension(name);
        const nameWithoutExt = name.slice(0, -(extension.length + 1)); // +1 for the dot
        if (nameWithoutExt.length > 20) {
            return `${nameWithoutExt.slice(0, 20)}...${extension}`;
        }
        return name;
    };

    const formatNumber = (num: number) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    return (
        <div className="relative flex justify-center">
            <div className="relative p-4 bg-gray-50 rounded-lg flex flex-col">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                        {getFileIcon()}
                    </div>
                    <div className="flex-grow min-h-[2rem] flex flex-col justify-center">
                        <span className="text-sm text-black font-bold leading-tight truncate" title={fileName}>
                            {getTruncatedName(fileName)}
                        </span>
                        <div className="text-sm text-gray-500 leading-tight">
                            {isUploading && (
                                <div className="flex items-center">
                                    Processing file...
                                </div>
                            )}
                            {error && <div className="text-red-500">{error}</div>}
                            {!isUploading && !error && (
                                <div>
                                    Word count: {wordCount !== undefined ? formatNumber(wordCount) : (
                                        <span className="inline-flex items-center">
                                            <div className="animate-spin mr-2">⌛</div>
                                            Processing...
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onRemove}
                        className="flex-shrink-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        aria-label="Remove document"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>


                {isUploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                    </div>
                )}
            </div>
        </div>
    );
}