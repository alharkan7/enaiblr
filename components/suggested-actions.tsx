'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ChatRequestOptions, CreateMessage, Message } from 'ai';
import { memo } from 'react';

interface SuggestedActionsProps {
  chatId: string;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
}

function PureSuggestedActions({ chatId, append }: SuggestedActionsProps) {
  const suggestedActions = [
    {
      title: 'What is the weather',
      label: 'in Jakarta?',
      action: 'What is the weather in Jakarta?',
    },
    {
      title: 'Help me draft an essay',
      label: 'about the history of Indonesia',
      action: 'Help me draft a short essay about the history of Indonesia',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full px-2" suppressHydrationWarning>
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? 'hidden sm:block' : 'block w-full'}
        >
          <Button
            variant="ghost"
            onClick={async () => {
              window.history.replaceState({}, '', `/chat/${chatId}`);

              append({
                role: 'user',
                content: suggestedAction.action,
              });
            }}
            className="text-left border rounded-xl px-4 py-3.5 text-sm w-full h-auto justify-start items-start whitespace-normal break-words"
          >
            <div className="flex flex-col gap-1 w-full">
              <span className="font-medium truncate">{suggestedAction.title}</span>
              <span className="text-muted-foreground truncate">
                {suggestedAction.label}
              </span>
            </div>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions, () => true);
