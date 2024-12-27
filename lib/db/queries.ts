import 'server-only';

import { genSaltSync, hashSync } from 'bcrypt-ts';
import { eq, and, asc, desc, gt, gte } from 'drizzle-orm';
import { type InferSelectModel } from 'drizzle-orm';

import { db } from './';
import {
  user,
  chat,
  message,
  vote,
  folder,
  chatToFolder,
  type User,
  type Chat,
  type Folder,
  type ChatToFolder,
  type Message,
  document,
  type Suggestion,
  suggestion,
} from './schema';
import { BlockKind } from '@/components/block';

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle

export async function getUser(email: string): Promise<Array<User>> {
  try {
    return await db.select().from(user).where(eq(user.email, email));
  } catch (error) {
    console.error('Failed to get user from database');
    throw error;
  }
}

export async function createUser(email: string, password: string) {
  try {
    return await db.insert(user).values({ email, password });
  } catch (error) {
    console.error('Failed to create user in database');
    throw error;
  }
}

export async function saveChat({
  id,
  userId,
  title,
  llm_id,
}: {
  id: string;
  userId: string;
  title: string;
  llm_id: string | null;
}) {
  try {
    return await db.insert(chat).values({
      id,
      createdAt: new Date(),
      userId,
      title,
      llm_id,
    });
  } catch (error) {
    console.error('Failed to save chat in database');
    throw error;
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    await db.delete(vote).where(eq(vote.chatId, id));
    await db.delete(message).where(eq(message.chatId, id));

    return await db.delete(chat).where(eq(chat.id, id));
  } catch (error) {
    console.error('Failed to delete chat by id from database');
    throw error;
  }
}

export async function getChatsByUserId({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(chat)
      .where(eq(chat.userId, id))
      .orderBy(desc(chat.createdAt));
  } catch (error) {
    console.error('Failed to get chats by user from database');
    throw error;
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));
    return selectedChat;
  } catch (error) {
    console.error('Failed to get chat by id from database');
    throw error;
  }
}

export async function saveMessages({ messages }: { messages: Array<Message> }) {
  try {
    return await db.insert(message).values(messages);
  } catch (error) {
    console.error('Failed to save messages in database', error);
    throw error;
  }
}

export async function getMessagesByChatId({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(message)
      .where(eq(message.chatId, id))
      .orderBy(asc(message.createdAt));
  } catch (error) {
    console.error('Failed to get messages by chat id from database', error);
    throw error;
  }
}

export async function voteMessage({
  chatId,
  messageId,
  type,
}: {
  chatId: string;
  messageId: string;
  type: 'up' | 'down';
}) {
  try {
    const [existingVote] = await db
      .select()
      .from(vote)
      .where(and(eq(vote.messageId, messageId)));

    if (existingVote) {
      return await db
        .update(vote)
        .set({ isUpvoted: type === 'up' })
        .where(and(eq(vote.messageId, messageId), eq(vote.chatId, chatId)));
    }
    return await db.insert(vote).values({
      chatId,
      messageId,
      isUpvoted: type === 'up',
    });
  } catch (error) {
    console.error('Failed to upvote message in database', error);
    throw error;
  }
}

export async function getVotesByChatId({ id }: { id: string }) {
  try {
    return await db.select().from(vote).where(eq(vote.chatId, id));
  } catch (error) {
    console.error('Failed to get votes by chat id from database', error);
    throw error;
  }
}

export async function saveDocument({
  id,
  title,
  kind,
  content,
  userId,
}: {
  id: string;
  title: string;
  kind: BlockKind;
  content: string;
  userId: string;
}) {
  try {
    return await db.insert(document).values({
      id,
      title,
      kind,
      content,
      userId,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Failed to save document in database');
    throw error;
  }
}

export async function getDocumentsById({ id }: { id: string }) {
  try {
    const documents = await db
      .select()
      .from(document)
      .where(eq(document.id, id))
      .orderBy(asc(document.createdAt));

    return documents;
  } catch (error) {
    console.error('Failed to get document by id from database');
    throw error;
  }
}

export async function getDocumentById({ id }: { id: string }) {
  try {
    const [selectedDocument] = await db
      .select()
      .from(document)
      .where(eq(document.id, id))
      .orderBy(desc(document.createdAt));

    return selectedDocument;
  } catch (error) {
    console.error('Failed to get document by id from database');
    throw error;
  }
}

export async function deleteDocumentsByIdAfterTimestamp({
  id,
  timestamp,
}: {
  id: string;
  timestamp: Date;
}) {
  try {
    await db
      .delete(suggestion)
      .where(
        and(
          eq(suggestion.documentId, id),
          gt(suggestion.documentCreatedAt, timestamp),
        ),
      );

    return await db
      .delete(document)
      .where(and(eq(document.id, id), gt(document.createdAt, timestamp)));
  } catch (error) {
    console.error(
      'Failed to delete documents by id after timestamp from database',
    );
    throw error;
  }
}

export async function saveSuggestions({
  suggestions,
}: {
  suggestions: Array<Suggestion>;
}) {
  try {
    return await db.insert(suggestion).values(suggestions);
  } catch (error) {
    console.error('Failed to save suggestions in database');
    throw error;
  }
}

export async function getSuggestionsByDocumentId({
  documentId,
}: {
  documentId: string;
}) {
  try {
    return await db
      .select()
      .from(suggestion)
      .where(and(eq(suggestion.documentId, documentId)));
  } catch (error) {
    console.error(
      'Failed to get suggestions by document version from database',
    );
    throw error;
  }
}

export async function getMessageById({ id }: { id: string }) {
  try {
    return await db.select().from(message).where(eq(message.id, id));
  } catch (error) {
    console.error('Failed to get message by id from database');
    throw error;
  }
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  try {
    return await db
      .delete(message)
      .where(
        and(eq(message.chatId, chatId), gte(message.createdAt, timestamp)),
      );
  } catch (error) {
    console.error(
      'Failed to delete messages by id after timestamp from database',
    );
    throw error;
  }
}

export async function updateChatVisiblityById({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: 'private' | 'public';
}) {
  try {
    return await db.update(chat).set({ visibility }).where(eq(chat.id, chatId));
  } catch (error) {
    console.error('Failed to update chat visibility in database');
    throw error;
  }
}

export async function updateChatPinned({
  id,
  pinned,
}: {
  id: string;
  pinned: boolean;
}) {
  try {
    await db.update(chat).set({ pinned }).where(eq(chat.id, id));
  } catch (error) {
    console.error('Failed to update chat pinned status');
    throw error;
  }
}

export async function updateChatTitle({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  try {
    return await db
      .update(chat)
      .set({ title })
      .where(eq(chat.id, id));
  } catch (error) {
    console.error('Failed to update chat title in database');
    throw error;
  }
}

// Folder queries
export async function getFoldersByUserId(userId: string) {
  return await db
    .select()
    .from(folder)
    .where(eq(folder.userId, userId));
}

export async function getFolderWithChats(folderId: string) {
  const result = await db
    .select({
      folder: folder,
      chat: chat,
    })
    .from(folder)
    .leftJoin(chatToFolder, eq(folder.id, chatToFolder.folderId))
    .leftJoin(chat, eq(chatToFolder.chatId, chat.id))
    .where(eq(folder.id, folderId));

  // Group chats by folder
  const folderWithChats = result.reduce<{ folder: Folder | null; chats: Chat[] }>((acc, row) => {
    if (!acc.folder && row.folder) {
      acc.folder = row.folder;
    }
    if (row.chat) {
      acc.chats.push(row.chat);
    }
    return acc;
  }, { folder: null, chats: [] });

  return folderWithChats;
}

export async function createFolder(data: { name: string; userId: string }) {
  const [newFolder] = await db
    .insert(folder)
    .values({
      ...data,
      createdAt: new Date(),
    })
    .returning();
  return newFolder;
}

export async function updateFolder(id: string, data: { name: string }) {
  const [updatedFolder] = await db
    .update(folder)
    .set(data)
    .where(eq(folder.id, id))
    .returning();
  return updatedFolder;
}

export async function deleteFolder(id: string) {
  await db.delete(folder).where(eq(folder.id, id));
}

export async function addChatToFolder(chatId: string, folderId: string) {
  await db.insert(chatToFolder).values({ chatId, folderId });
}

export async function removeChatFromFolder(chatId: string, folderId: string) {
  await db
    .delete(chatToFolder)
    .where(
      and(
        eq(chatToFolder.chatId, chatId),
        eq(chatToFolder.folderId, folderId)
      )
    );
}
