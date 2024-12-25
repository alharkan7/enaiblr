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
      title: 'How can we combat',
      label: 'misinformation effectively?',
      action: 'How can we combat misinformation effectively?',
    },
    {
      title: 'Write a Python script',
      label: `to calculate the first 50 digits of Pi`,
      action: `Write a Python script to calculate the first 50 digits of Pi`,
    },
    {
      title: 'Help me write an essay',
      label: `about the history of Indonesia`,
      action: `Help me write an essay about the history of Indonesia`,
    },
    {
      title: 'What is the weather',
      label: 'in Greater Jakarta?',
      action: 'What is the weather in Greater Jakarta?',
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 gap-2 w-full">
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? 'hidden sm:block' : 'block'}
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
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 w-full h-auto justify-start items-start whitespace-normal break-words"
          >
            <div className="inline">
              <span className="font-medium">{suggestedAction.title}</span>{' '}
              <span className="text-muted-foreground">
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
