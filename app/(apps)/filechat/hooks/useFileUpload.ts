import { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { useSubscription } from '@/contexts/subscription-context';
import { useRouter } from 'next/navigation';
import {filechatFree_WordsLimit} from '@/config/freeLimits'

interface FileInfo {
    fileName: string;
    fileType: string;
    content: string;
    fileUrl: string;
}

export function useFileUpload() {
    const [wordCount, setWordCount] = useState<number>(0);
    const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
    const { plan } = useSubscription();
    const router = useRouter();

    useEffect(() => {
        // Set up PDF.js worker using local file
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
    }, []);

    const [isUploading, setIsUploading] = useState(false);
    const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const ALLOWED_TYPES = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'text/markdown',
        'text/x-markdown',
        'application/markdown',
        'application/x-markdown'
    ];

    const getFileExtension = (fileName: string): string => {
        const ext = fileName.split('.').pop()?.toLowerCase() || '';
        if (['doc', 'docx'].includes(ext)) return 'doc';
        if (['md', 'markdown'].includes(ext)) return 'md';
        return ext;
    };

    const extractTextFromPDF = async (arrayBuffer: ArrayBuffer): Promise<string> => {
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map((item: any) => item.str).join(' ') + '\n';
        }

        return text;
    };

    const extractTextFromDOCX = async (arrayBuffer: ArrayBuffer): Promise<string> => {
        try {
            const result = await mammoth.extractRawText({
                arrayBuffer: arrayBuffer
            });
            return result.value;
        } catch (error) {
            console.error('Error extracting DOCX text:', error);
            throw new Error('Failed to extract text from DOCX');
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);

        try {
            setFileInfo({
                fileName: file.name,
                fileType: file.name.split('.').pop() || '',
                fileUrl: URL.createObjectURL(file),
                content: ''
            });

            // Check file extension and type
            const extension = getFileExtension(file.name);
            const isMarkdown = extension === 'md';
            const isPDF = extension === 'pdf';
            const isDoc = ['doc', 'docx'].includes(extension);

            // More permissive type checking
            const isAllowedType = ALLOWED_TYPES.includes(file.type) ||
                (isMarkdown && (file.type === 'text/plain' || file.type === '')) ||
                (isPDF && file.type === 'application/pdf') ||
                (isDoc && (file.type.includes('word') || file.type.includes('document')));

            if (!isAllowedType) {
                setError('Allowed file types: .pdf .docx .doc .txt .md');
                console.error('Unsupported file type:', file.type, 'extension:', extension);
                setIsUploading(false);
                return;
            }

            const arrayBuffer = await file.arrayBuffer();
            let content = '';

            if (isPDF) {
                content = await extractTextFromPDF(arrayBuffer);
            } else if (isDoc) {
                content = await extractTextFromDOCX(arrayBuffer);
            } else {
                // For text files
                content = await file.text();
            }

            // Calculate word count
            const words = content.trim().split(/\s+/).length;

            if (words > 80000) {
                setError('Maximum word count is 80,000');
                setFileInfo(null);
                setFileContent(null);
                setWordCount(0);
            } else if (plan === 'free' && words > filechatFree_WordsLimit) {
                setShowUpgradeDialog(true);
                // Keep the file info but mark it as over limit
                setFileInfo(prev => prev ? {
                    ...prev,
                    content: content
                } : null);
                setFileContent(content);
                setWordCount(words);
            } else {
                setWordCount(words);
                setFileContent(content);
                // Update fileInfo with content
                setFileInfo(prev => prev ? { ...prev, content } : null);
            }
        } catch (err: any) {
            setError(err.message || 'Error processing file');
            console.error('File processing error:', err);
            setFileInfo(null);
            setFileContent(null);
        } finally {
            setIsUploading(false);
        }
    };

    const clearFile = () => {
        setFileInfo(null);
        setFileContent(null);
        setError(null);
        setShowUpgradeDialog(false);
        // Reset the file input value to allow selecting the same file again
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
            (fileInput as HTMLInputElement).value = '';
        }
    };

    return {
        isUploading,
        fileInfo,
        fileContent,
        handleFileChange,
        clearFile,
        error,
        setError,
        wordCount,
        showUpgradeDialog,
        setShowUpgradeDialog
    };
}