import { cookies } from 'next/headers';
import { auth } from '@/app/(auth)/auth'; 
import { DEFAULT_MODEL_NAME } from '@/lib/ai/models';
import { ChatWrapper } from './components/chat-wrapper';

export default async function Page() {
  const session = await auth();
  const cookieStore = await cookies();
  const chatId = cookieStore.get('chatId')?.value;
  const modelId = cookieStore.get('selectedModelId')?.value || DEFAULT_MODEL_NAME;

  return (
    <ChatWrapper
      id={chatId}
      selectedModelId={modelId}
      user={session?.user}
    />
  );
}
