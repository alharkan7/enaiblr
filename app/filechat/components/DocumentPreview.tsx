import { FileText, File } from 'lucide-react';

interface DocumentPreviewProps {
    fileName: string;
    fileType: string;
    isUploading: boolean;
    onRemove: () => void;
    error?: string | null;
    wordCount?: number;
    showRemoveButton?: boolean;
}

export function DocumentPreview({
    fileName,
    fileType,
    isUploading,
    onRemove,
    error,
    wordCount,
    showRemoveButton = true
}: DocumentPreviewProps) {
    const getFileIcon = () => {
        switch (fileType.toLowerCase()) {
            case 'pdf':
                return <FileText className="size-8 text-destructive" />;
            case 'doc':
            case 'docx':
                return <FileText className="size-8 text-primary" />;
            case 'txt':
                return <FileText className="size-8 text-muted-foreground" />;
            case 'md':
                return <FileText className="size-8 text-secondary" />;
            default:
                return <File className="size-8 text-muted-foreground" />;
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
            <div className="relative p-4 bg-muted rounded-lg flex flex-col">
                <div className="flex items-start gap-3">
                    <div className="shrink-0">
                        {getFileIcon()}
                    </div>
                    <div className="grow min-h-8 flex flex-col justify-center">
                        <span className="text-sm text-foreground font-bold leading-tight truncate" title={fileName}>
                            {getTruncatedName(fileName)}
                        </span>
                        <div className="text-sm text-muted-foreground leading-tight">
                            {isUploading && (
                                <div className="flex items-center">
                                    Processing file...
                                </div>
                            )}
                            {error && <div className="text-destructive">{error}</div>}
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
                    {showRemoveButton && (  
                        <button
                            onClick={onRemove}
                            className="shrink-0 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
                            aria-label="Remove document"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    )}
                </div>


                {isUploading && (
                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-lg">
                        <div className="animate-spin rounded-full size-8 border-y-2 border-primary"></div>
                    </div>
                )}
            </div>
        </div>
    );
}