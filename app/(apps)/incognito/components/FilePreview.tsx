import { FileText, File } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface FilePreviewProps {
    file: {
        name: string;
        type: string;
        url: string;
    };
    isUploading: boolean;
    onRemove: () => void;
}

export function FilePreview({ file, isUploading, onRemove }: FilePreviewProps) {
    const isImage = file.type.startsWith('image/');

    const getFileIcon = () => {
        const fileType = file.name.split('.').pop()?.toLowerCase() || '';
        switch (fileType) {
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

    const getTruncatedName = (name: string) => {
        const extension = name.split('.').pop() || '';
        const nameWithoutExt = name.slice(0, -(extension.length + 1)); // +1 for the dot
        if (nameWithoutExt.length > 20) {
            return `${nameWithoutExt.slice(0, 20)}...${extension}`;
        }
        return name;
    };

    if (isImage) {
        return (
            <div className="relative flex justify-center">
                <div className="relative">
                    <img
                        src={file.url}
                        alt="Preview"
                        className="max-h-[100px] rounded-lg object-contain"
                    />
                    <button
                        onClick={onRemove}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
                        aria-label="Remove file"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                    {isUploading && (
                        <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-lg">
                            <div className="animate-spin rounded-full size-8 border-y-2 border-primary"></div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <Card className="relative flex items-center gap-3 p-3 w-fit min-w-[200px]">
            {getFileIcon()}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" title={file.name}>
                    {getTruncatedName(file.name)}
                </p>
            </div>
            <button
                onClick={onRemove}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
                aria-label="Remove file"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
            {isUploading && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-lg">
                    <div className="animate-spin rounded-full size-8 border-y-2 border-primary"></div>
                </div>
            )}
        </Card>
    );
}
