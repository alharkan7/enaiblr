'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import type { ChatRequestOptions, CreateMessage, Message } from 'ai';
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
      title: "What's the difference",	
      label: 'between cappuccino and latte?',
      action: "What's the difference between cappuccino and latte?",
    },
    {
      title: 'What is the weather',
      label: 'in Greater Jakarta?',
      action: 'What is the weather in Greater Jakarta?',
    },
    {
      title: 'Help me write an essay',
      label: `about Indonesian street food`,
      action: `Help me write an essay about Indonesian street food`,
    },
    {
      title: 'Write a Python script',
      label: `to plan my weekly grocery budget`,
      action: `Write a Python script to plan my weekly grocery budget`,
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
