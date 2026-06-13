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
  serial,
  integer,
  date,
} from 'drizzle-orm/pg-core';

export const user = pgTable('User', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  email: varchar('email', { length: 64 }).notNull(),
  password: varchar('password', { length: 128 }),
  name: varchar('name', { length: 100 }),
  phone: varchar('phone', { length: 20 }),
  createdAt: timestamp('createdAt').defaultNow(),
  avatar: varchar('avatar', { length: 255 }),
  geminiApiKey: varchar('geminiApiKey', { length: 255 }),
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
  commission: numeric('commission', { precision: 10, scale: 2 }).default(sql`ROUND((amount * 0.25)::numeric, 2)`),
  status: varchar('status', { length: 20 }).notNull(),
  affiliate_code: varchar('affiliate_code', { length: 12 }),
  affiliator: uuid('affiliator')
    .references(() => user.id, { onUpdate: 'no action', onDelete: 'no action' }),
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

export const publications = pgTable('Publications', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  title: varchar('title', { length: 255 }).notNull(),
  excerpt: text('excerpt'),
  author: varchar('author', { length: 100 }),
  category: varchar('category', { length: 50 }),
  content: text('content').notNull(),
  cover: varchar('cover', { length: 500 }),
  updatedAt: timestamp('updatedAt'),
  slug: varchar('slug', { length: 255 }).unique(),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id, { onUpdate: 'no action', onDelete: 'no action' })
});

export type Publication = InferSelectModel<typeof publications>;

export const publicationsSub = pgTable('Publications Sub', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  email: varchar('email', { length: 254 }).notNull()
});

export type PublicationsSub = InferSelectModel<typeof publicationsSub>;

// --- Finance Tracker Tables ---

export const ftMain = pgTable('ft_main', {
  id: serial('id').primaryKey().notNull(),
  userId: uuid('user_id').references(() => user.id).unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  avatar: varchar('avatar', { length: 255 }),
  sheetId: varchar('sheet_id', { length: 255 }),
  expenseCategories: json('expense_categories').default('[]'),
  incomeCategories: json('income_categories').default('[]'),
  monthlyBudget: numeric('monthly_budget', { precision: 15, scale: 2 }).default('0'),
  preferences: json('preferences').default('{}'),
  isActive: boolean('is_active').default(true),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type FtMain = InferSelectModel<typeof ftMain>;

export const ftExpenses = pgTable('ft_expenses', {
  id: serial('id').primaryKey().notNull(),
  userId: integer('user_id').notNull().references(() => ftMain.id),
  timestamp: timestamp('timestamp'),
  date: date('date').notNull(),
  amount: numeric('amount', { precision: 15, scale: 2 }).notNull(),
  category: varchar('category', { length: 255 }).notNull(),
  description: text('description'),
  source: varchar('source', { length: 255 }).default('manual'),
  externalId: varchar('external_id', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type FtExpense = InferSelectModel<typeof ftExpenses>;

export const ftIncomes = pgTable('ft_incomes', {
  id: serial('id').primaryKey().notNull(),
  userId: integer('user_id').notNull().references(() => ftMain.id),
  timestamp: timestamp('timestamp'),
  date: date('date').notNull(),
  amount: numeric('amount', { precision: 15, scale: 2 }).notNull(),
  category: varchar('category', { length: 255 }).notNull(),
  description: text('description'),
  source: varchar('source', { length: 255 }).default('manual'),
  externalId: varchar('external_id', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type FtIncome = InferSelectModel<typeof ftIncomes>;

export const ftBudgets = pgTable('ft_budgets', {
  id: serial('id').primaryKey().notNull(),
  userId: integer('user_id').notNull().references(() => ftMain.id),
  timestamp: timestamp('timestamp'),
  date: date('date').notNull(),
  amount: numeric('amount', { precision: 15, scale: 2 }).notNull(),
  notes: text('notes'),
  budgetType: varchar('budget_type', { length: 100 }).default('monthly'),
  periodStart: date('period_start'),
  periodEnd: date('period_end'),
  source: varchar('source', { length: 255 }).default('manual'),
  externalId: varchar('external_id', { length: 255 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type FtBudget = InferSelectModel<typeof ftBudgets>;

// --- App Specific Tables ---

export const appSearch = pgTable('AppSearch', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('userId').notNull().references(() => user.id),
  query: text('query'),
  response: json('response'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});
export type AppSearch = InferSelectModel<typeof appSearch>;

export const appFilechat = pgTable('AppFilechat', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('userId').notNull().references(() => user.id),
  sessionId: varchar('sessionId', { length: 255 }),
  inputPrompt: text('inputPrompt'),
  response: text('response'),
  gcsFilename: varchar('gcsFilename', { length: 255 }),
  gcsPath: varchar('gcsPath', { length: 500 }),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});
export type AppFilechat = InferSelectModel<typeof appFilechat>;

export const appIncognito = pgTable('AppIncognito', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('userId').notNull().references(() => user.id),
  sessionId: varchar('sessionId', { length: 255 }),
  inputPrompt: text('inputPrompt'),
  response: text('response'),
  gcsFilename: varchar('gcsFilename', { length: 255 }),
  gcsPath: varchar('gcsPath', { length: 500 }),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});
export type AppIncognito = InferSelectModel<typeof appIncognito>;

export const appWeb = pgTable('AppWeb', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('userId').notNull().references(() => user.id),
  sessionId: varchar('sessionId', { length: 255 }),
  inputUrl: text('inputUrl'),
  inputPrompt: text('inputPrompt'),
  response: text('response'),
  sources: json('sources'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});
export type AppWeb = InferSelectModel<typeof appWeb>;

export const appTranscribe = pgTable('AppTranscribe', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('userId').notNull().references(() => user.id),
  language: varchar('language', { length: 10 }),
  transcription: json('transcription'),
  gcsFilename: varchar('gcsFilename', { length: 255 }),
  gcsPath: varchar('gcsPath', { length: 500 }),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});
export type AppTranscribe = InferSelectModel<typeof appTranscribe>;

export const appVoice = pgTable('AppVoice', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('userId').notNull().references(() => user.id),
  inputText: text('inputText'),
  voiceId: varchar('voiceId', { length: 100 }),
  gcsFilename: varchar('gcsFilename', { length: 255 }),
  gcsPath: varchar('gcsPath', { length: 500 }),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});
export type AppVoice = InferSelectModel<typeof appVoice>;

export const appPaperFlashcards = pgTable('AppPaperFlashcards', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('userId').notNull().references(() => user.id),
  extractedText: text('extractedText'),
  flashcards: json('flashcards'),
  hashtags: json('hashtags'),
  gcsFilename: varchar('gcsFilename', { length: 255 }),
  gcsPath: varchar('gcsPath', { length: 500 }),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});
export type AppPaperFlashcards = InferSelectModel<typeof appPaperFlashcards>;