interface ImagePreviewProps {
    localImageUrl: string;
    isUploading: boolean;
    onRemove: () => void;
}

export function ImagePreview({ localImageUrl, isUploading, onRemove }: ImagePreviewProps) {
    return (
        <div className="relative flex justify-center">
            <div className="relative">
                <img
                    src={localImageUrl}
                    alt="Preview"
                    className="max-h-[100px] rounded-lg object-contain"
                />
                <button
                    onClick={onRemove}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
                    aria-label="Remove image"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
                {isUploading && (
                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-lg">
                        <div className="animate-spin rounded-full size-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                )}
            </div>
        </div>
    );
}