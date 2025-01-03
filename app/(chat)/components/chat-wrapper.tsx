'use client';

import { ProGate } from '@/components/pro-gate';
import { Chat } from '@/components/chat';
import { DataStreamHandler } from '@/components/data-stream-handler';
import type { User } from 'next-auth';
import { useState } from 'react';
import { generateUUID } from '@/lib/utils';

interface ChatWrapperProps {
  id?: string;
  selectedModelId: string;
  user?: User;
}

export function ChatWrapper({ id: initialId, selectedModelId, user }: ChatWrapperProps) {
  const [id] = useState(() => initialId || generateUUID());

  return (
    <ProGate>
      <>
        <Chat
          key={id}
          id={id}
          initialMessages={[]}
          selectedModelId={selectedModelId}
          selectedVisibilityType="private"
          isReadonly={false}
          user={user}
        />
        <DataStreamHandler id={id} />
      </>
    </ProGate>
  );
}
