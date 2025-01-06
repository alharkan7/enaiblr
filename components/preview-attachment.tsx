import type { Attachment } from 'ai';
import { useState } from 'react';
import { LoaderIcon, FileIcon } from './icons';
import { ImageModal } from './ui/image-modal';

const truncateMiddle = (text: string) => {
  const lastDotIndex = text.lastIndexOf('.');
  if (lastDotIndex === -1) return text;
  
  const name = text.slice(0, lastDotIndex);
  const ext = text.slice(lastDotIndex);
  
  if (name.length <= 20) return text;
  return `${name.slice(0, 18)}...${ext}`;
};

const cleanFileName = (fileName: string) => {
  // Remove leading timestamp and UUID pattern (e.g., 1736005090506-651b2ec0-)
  return fileName.replace(/^\d+-[a-f0-9]+-/, '');
};

const getDisplayName = (attachment: { url: string; contentType?: string; name?: string; originalName?: string }) => {
  // Use original name if available
  if (attachment.originalName) {
    return truncateMiddle(attachment.originalName);
  }

  // Clean and use current name
  return attachment.name ? truncateMiddle(cleanFileName(attachment.name)) : '';
};

export const PreviewAttachment = ({
  attachment,
  isUploading = false,
  onRemove,
}: {
  attachment: { url: string; contentType?: string; name?: string; originalName?: string };
  isUploading?: boolean;
  onRemove?: () => void;
}) => {
  const { url, contentType, name } = attachment;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div className="w-30 h-24 border aspect-video bg-muted rounded-md relative flex flex-col items-center justify-center">
        {onRemove && (
          <button
            onClick={onRemove}
            className="absolute -right-1 -top-0 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full p-0.5 size-5 flex items-center justify-center shadow-sm"
            aria-label="Remove attachment"
          >
            ×
          </button>
        )}
        {contentType ? (
          contentType.startsWith('image') ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={url}
                src={url}
                alt={name ?? 'An image attachment'}
                className="rounded-md size-full object-cover cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              />
              <ImageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                imageUrl={url}
                altText={name ?? 'An image attachment'}
              />
            </>
          ) : (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-1 text-center w-full h-full cursor-pointer hover:bg-muted/50 rounded-md transition-colors"
              aria-label={`Open ${name || 'file'} in new tab`}
            >
              <FileIcon size={16} className="text-zinc-500 mb-1" />
              <span className="text-xs font-bold text-zinc-500 truncate max-w-[90%]">
                {contentType?.split('/')[1]?.toUpperCase() || 'FILE'}
              </span>
            </a>
          )
        ) : (
          <div className="flex items-center justify-center">
            <FileIcon size={16} className="text-zinc-500" />
          </div>
        )}

        {isUploading && (
          <div className="animate-spin absolute text-zinc-500">
            <LoaderIcon />
          </div>
        )}
      </div>
      <div className="text-xs text-zinc-500 max-w-30">
        {getDisplayName(attachment)}
      </div>
    </div>
  );
};
