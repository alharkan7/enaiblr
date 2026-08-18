'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

interface BackstoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

export function BackstoryModal({ isOpen, onClose, content }: BackstoryModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed inset-0 z-50 flex flex-col bg-background overflow-hidden"
        >
          <div className="mx-auto w-full max-w-3xl flex justify-end p-5 sm:px-8 sm:py-6 shrink-0">
            <button
              onClick={onClose}
              className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Close backstory"
            >
              <X className="size-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-5 pb-20 sm:px-8 scrollbar-thin scrollbar-thumb-muted">
            <div className="mx-auto max-w-3xl prose prose-sm sm:prose-base dark:prose-invert prose-neutral prose-headings:font-normal prose-p:text-muted-foreground prose-headings:text-foreground prose-a:text-foreground prose-a:underline-offset-4 hover:prose-a:text-muted-foreground prose-strong:text-foreground">
              <ReactMarkdown>
                {content}
              </ReactMarkdown>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
