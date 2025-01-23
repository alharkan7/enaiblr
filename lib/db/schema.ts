import type { InferSelectModel } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  timestamp,
  json,
  uuid,
  text,
  primaryKey,
  foreignKey,
  boolean,
  numeric,
} from 'drizzle-orm/pg-core';

export const user = pgTable('User', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  email: varchar('email', { length: 64 }).notNull(),
  password: varchar('password', { length: 128 }),
  name: varchar('name', { length: 100 }),
  phone: varchar('phone', { length: 20 }),
  createdAt: timestamp('createdAt').defaultNow(),
  avatar: varchar('avatar', { length: 255 }),
});

export type User = InferSelectModel<typeof user>;

export const folder = pgTable('Folder', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  name: text('name').notNull(),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
});

export type Folder = InferSelectModel<typeof folder>;

export const chat = pgTable('Chat', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').notNull(),
  title: text('title').notNull(),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
  visibility: varchar('visibility', { enum: ['public', 'private'] })
    .notNull()
    .default('private'),
  pinned: boolean('pinned').notNull().default(false),
  llm_id: text('llm_id'),
  folderId: uuid('folderId')
    .references(() => folder.id),
});

export type Chat = InferSelectModel<typeof chat>;

export const message = pgTable('Message', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  chatId: uuid('chatId')
    .notNull()
    .references(() => chat.id),
  role: varchar('role').notNull(),
  content: json('content').notNull(),
  createdAt: timestamp('createdAt').notNull(),
});

export type Message = InferSelectModel<typeof message>;

export const vote = pgTable(
  'Vote',
  {
    chatId: uuid('chatId')
      .notNull()
      .references(() => chat.id),
    messageId: uuid('messageId')
      .notNull()
      .references(() => message.id),
    isUpvoted: boolean('isUpvoted').notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    };
  },
);

export type Vote = InferSelectModel<typeof vote>;

export const document = pgTable(
  'Document',
  {
    id: uuid('id').notNull().defaultRandom(),
    createdAt: timestamp('createdAt').notNull(),
    title: text('title').notNull(),
    content: text('content'),
    kind: varchar('text', { enum: ['text', 'code'] })
      .notNull()
      .default('text'),
    userId: uuid('userId')
      .notNull()
      .references(() => user.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.id, table.createdAt] }),
    };
  },
);

export type Document = InferSelectModel<typeof document>;

export const suggestion = pgTable(
  'Suggestion',
  {
    id: uuid('id').notNull().defaultRandom(),
    documentId: uuid('documentId').notNull(),
    documentCreatedAt: timestamp('documentCreatedAt').notNull(),
    originalText: text('originalText').notNull(),
    suggestedText: text('suggestedText').notNull(),
    description: text('description'),
    isResolved: boolean('isResolved').notNull().default(false),
    userId: uuid('userId')
      .notNull()
      .references(() => user.id),
    createdAt: timestamp('createdAt').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    documentRef: foreignKey({
      columns: [table.documentId, table.documentCreatedAt],
      foreignColumns: [document.id, document.createdAt],
    }),
  }),
);

export type Suggestion = InferSelectModel<typeof suggestion>;

export const subscription = pgTable('Subscriptions', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
  plan: varchar('plan', { length: 32 }).notNull().default('free'),
  validUntil: timestamp('validUntil'),
});

export type Subscription = InferSelectModel<typeof subscription>;

export const token = pgTable('Token', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  token: varchar('token', { length: 64 }).notNull(),
  status: varchar('status', { enum: ['open', 'used'] }).notNull().default('open'),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
  packageName: varchar('packageName', { length: 32 }).notNull(),
});

export type Token = InferSelectModel<typeof token>;

export const tokenPassword = pgTable('Token Password', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  token: uuid('token').notNull(),
  used: boolean('used').notNull().default(false),
  email: varchar('email', { length: 64 }).notNull(),
});

export type TokenPassword = InferSelectModel<typeof tokenPassword>;

export const transactions = pgTable('Transactions', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').notNull(),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id, { onUpdate: 'no action', onDelete: 'no action' }),
  name: varchar('name', { length: 50 }).notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  commission: numeric('commission', { precision: 10, scale: 2 }).default(sql`ROUND(amount * 0.25, 2)`),
  status: varchar('status', { length: 20 }).notNull(),
  affiliate_code: varchar('affiliate_code', { length: 12 }),
});

export type Transaction = InferSelectModel<typeof transactions>;

export const affiliate = pgTable('Affiliate', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').notNull(),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id, { onUpdate: 'no action', onDelete: 'no action' }),
  code: varchar('code', { length: 12 }).notNull().unique(),
});

export type Affiliate = InferSelectModel<typeof affiliate>;
