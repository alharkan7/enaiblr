import 'server-only';
import { eq, and, asc, desc, gt, gte } from 'drizzle-orm';

import { db } from './';
import {
  user,
  chat,
  message,
  vote,
  folder,
  type User,
  type Message,
  document,
  type Suggestion,
  suggestion,
  subscription,
  token,
} from './schema';
import type { BlockKind } from '@/components/block';
import { subscriptionPackages } from '@/config/subscriptionPackages';

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle

export async function getUser(email: string) {
  // console.log('getUser called with email:', email);

  if (!email) {
    console.error('getUser: No email provided');
    return [];
  }

  try {
    const result = await db
      .select()
      .from(user)
      .where(eq(user.email, email));

    // console.log('getUser DB result:', result);
    return result;
  } catch (error) {
    console.error('Error in getUser:', error);
    throw error;
  }
}

export async function createUser(email: string, password: string) {
  try {
    return await db.transaction(async (tx) => {
      const result = await tx.insert(user).values({
        email,
        password,
        createdAt: new Date()
      }).returning();

      const userId = result[0].id;

      await tx.insert(subscription).values({
        userId,
        createdAt: new Date()
      });

      await createUserOnboarding(userId, tx);

      return result;
    });
  } catch (error) {
    console.error('Failed to create user in database');
    throw error;
  }
}

export async function createGoogleUser(email: string, avatar?: string) {
  if (!email) {
    throw new Error('Email is required');
  }

  try {
    return await db.transaction(async (tx) => {
      // Create the user
      const result = await tx.insert(user).values({
        email,
        avatar,
        createdAt: new Date()
      }).returning();

      if (!result || result.length === 0) {
        throw new Error('Failed to create user');
      }

      const userId = result[0].id;

      // Create subscription
      await tx.insert(subscription).values({
        userId,
        createdAt: new Date()
      });

      // Create onboarding
      await createUserOnboarding(userId, tx);

      return result;
    });
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
}

async function createUserOnboarding(userId: string, tx: any) {
  // Create default folders
  const [personalFolder, workFolder, studyFolder] = await Promise.all([
    tx.insert(folder).values({ name: 'Personal', userId, createdAt: new Date() }).returning(),
    tx.insert(folder).values({ name: 'Work', userId, createdAt: new Date() }).returning(),
    tx.insert(folder).values({ name: 'Study', userId, createdAt: new Date() }).returning()
  ]);

  // Create welcome chat
  const [welcomeChat] = await tx.insert(chat).values({
    title: 'Welcome to Enaiblr!',
    userId,
    createdAt: new Date(),
    pinned: true,
    folderId: personalFolder[0].id
  }).returning();

  // Add welcome message
  await tx.insert(message).values({
    chatId: welcomeChat.id,
    role: 'assistant',
    content: [{
      type: "text",
      text: "👋 Welcome to Enaiblr!\n\n" +
        "I'm your AI assistant, ready to help you with anything you need. I've created three folders to help you organize your chats:\n\n" +
        "📁 Personal - For your personal conversations and tasks\n\n" +
        "💼 Work - For work-related discussions and projects\n\n" +
        "📚 Study - For learning and educational content\n\n" +
        "Feel free to create more folders or reorganize your chats however you like. How can I assist you today?"
    }],
    createdAt: new Date()
  });
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

export async function updateChatFolder({
  id,
  folderId,
}: {
  id: string;
  folderId: string | null;
}) {
  try {
    return await db
      .update(chat)
      .set({ folderId })
      .where(eq(chat.id, id));
  } catch (error) {
    console.error('Failed to update chat folder');
    throw error;
  }
}

export async function createSubscription(userId: string) {
  try {
    return await db.insert(subscription).values({ userId, createdAt: new Date() });
  } catch (error) {
    console.error('Failed to create subscription in database');
    throw error;
  }
}

// Subscription types
type SubscriptionPlan = 'free' | 'pro';
type SubscriptionStatus = {
  plan: SubscriptionPlan;
  validUntil: Date | null;
  subscriptionId: string | null;
};

// For Edge Runtime compatibility, we'll skip caching
export async function getUserSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
  try {
    const now = new Date();

    // Get all valid subscriptions for the user
    const subs = await db
      .select()
      .from(subscription)
      .where(
        and(
          eq(subscription.userId, userId),
          gt(subscription.validUntil, now)  // Only get active subscriptions (validUntil > now)
        )
      )
      .orderBy(desc(subscription.validUntil));  // Get the latest subscription first

    let status: SubscriptionStatus = { plan: 'free', validUntil: null, subscriptionId: null };

    // Use the latest valid pro subscription if available
    if (subs && subs.length > 0) {
      const sub = subs[0]; // Get the latest subscription
      if (sub.plan === 'pro' && sub.validUntil) {
        status = {
          plan: 'pro',
          validUntil: sub.validUntil,
          subscriptionId: sub.id
        };
      }
    }

    return status;
  } catch (error) {
    console.error('Failed to get user subscription status:', error);
    throw error;
  }
}

export async function isProUser(userId: string): Promise<boolean> {
  const status = await getUserSubscriptionStatus(userId);
  return status.plan === 'pro';
}

export async function updateSubscriptionToPro(userId: string, packageName: string) {
  try {
    const now = new Date();

    // Find the selected package
    const selectedPackage = subscriptionPackages.find(pkg => pkg.name === packageName) || subscriptionPackages[0];

    // Get current subscription
    const currentSub = await db
      .select()
      .from(subscription)
      .where(eq(subscription.userId, userId))
      .limit(1);

    let newValidUntil = new Date(now);
    newValidUntil.setDate(newValidUntil.getDate() + selectedPackage.activeDays);

    if (currentSub.length > 0 && currentSub[0].validUntil) {
      const currentValidUntil = new Date(currentSub[0].validUntil);
      if (currentValidUntil > now) {
        // If current valid until is in the future, add the package's activeDays to it
        newValidUntil = new Date(currentValidUntil);
        newValidUntil.setDate(currentValidUntil.getDate() + selectedPackage.activeDays);
      }
      // If validUntil is in the past, we'll use the already calculated now + activeDays
    }

    return await db
      .update(subscription)
      .set({
        plan: 'pro',
        validUntil: newValidUntil,
      })
      .where(eq(subscription.userId, userId))
      .returning();
  } catch (error) {
    console.error('Failed to update subscription:', error);
    throw error;
  }
}

// Folder queries
export async function getFoldersByUserId(userId: string) {
  const folders = await db
    .select()
    .from(folder)
    .where(eq(folder.userId, userId));

  // For each folder, get its chats
  const foldersWithChats = await Promise.all(
    folders.map(async (f) => {
      const chats = await db
        .select()
        .from(chat)
        .where(eq(chat.folderId, f.id));
      return { ...f, chats };
    })
  );

  return foldersWithChats;
}

export async function getFolderWithChats(folderId: string) {
  const [folderData] = await db
    .select()
    .from(folder)
    .where(eq(folder.id, folderId));

  if (!folderData) {
    return { folder: null, chats: [] };
  }

  const chats = await db
    .select()
    .from(chat)
    .where(eq(chat.folderId, folderId));

  return { folder: folderData, chats };
}

export async function createFolder(data: { name: string; userId: string }) {
  const [newFolder] = await db
    .insert(folder)
    .values({
      ...data,
      createdAt: new Date(),
    })
    .returning();
  return { ...newFolder, chats: [] };
}

export async function updateFolder(id: string, data: { name: string }) {
  const [updatedFolder] = await db
    .update(folder)
    .set(data)
    .where(eq(folder.id, id))
    .returning();

  const chats = await db
    .select()
    .from(chat)
    .where(eq(chat.folderId, id));

  return { ...updatedFolder, chats };
}

export async function deleteFolder(id: string) {
  // First update all chats in this folder to have no folder
  await db
    .update(chat)
    .set({ folderId: null })
    .where(eq(chat.folderId, id));

  // Then delete the folder
  await db.delete(folder).where(eq(folder.id, id));
}

export async function updateUserProfile(
  email: string,
  data: {
    name?: string;
    phone?: string;
    password?: string;
    geminiApiKey?: string;
  }
) {
  try {
    const updates: any = {};
    if (data.name !== undefined) updates.name = data.name;
    if (data.phone !== undefined) updates.phone = data.phone;
    if (data.password !== undefined) updates.password = data.password;
    if (data.geminiApiKey !== undefined) updates.geminiApiKey = data.geminiApiKey;

    return await db
      .update(user)
      .set(updates)
      .where(eq(user.email, email))
      .returning();
  } catch (error) {
    console.error('Failed to update user profile in database');
    throw error;
  }
}

export async function updateUserAvatar(email: string, avatar: string | null) {
  try {
    return await db.update(user)
      .set({ avatar })
      .where(eq(user.email, email))
      .returning();
  } catch (error) {
    console.error('Failed to update user avatar');
    throw error;
  }
}

async function generateToken(): Promise<string> {
  // Generate a UUID v4 format
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  // Set version (4) and variant (2) bits
  array[6] = (array[6] & 0x0f) | 0x40;
  array[8] = (array[8] & 0x3f) | 0x80;

  // Convert to UUID string format
  const hex = Array.from(array, byte => byte.toString(16).padStart(2, '0'));
  return [
    hex.slice(0, 4).join(''),
    hex.slice(4, 6).join(''),
    hex.slice(6, 8).join(''),
    hex.slice(8, 10).join(''),
    hex.slice(10, 16).join('')
  ].join('-');
}

export async function createPaymentToken(userId: string, packageName: string) {
  try {
    const tokenValue = await generateToken();
    return await db.insert(token).values({
      userId,
      token: tokenValue,
      createdAt: new Date(),
      status: 'open',
      packageName,
    }).returning();
  } catch (error) {
    console.error('Failed to create payment token');
    throw error;
  }
}

export async function getPaymentToken(tokenValue: string) {
  try {
    return await db.select()
      .from(token)
      .where(eq(token.token, tokenValue));
  } catch (error) {
    console.error('Failed to get payment token');
    throw error;
  }
}

export async function markTokenAsUsed(tokenValue: string) {
  try {
    return await db.update(token)
      .set({ status: 'used' })
      .where(eq(token.token, tokenValue));
  } catch (error) {
    console.error('Failed to mark token as used');
    throw error;
  }
}
