CREATE TABLE IF NOT EXISTS "Affiliate" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp NOT NULL,
	"userId" uuid NOT NULL,
	"code" varchar(12) NOT NULL,
	CONSTRAINT "Affiliate_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Publications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"title" varchar(255) NOT NULL,
	"excerpt" text,
	"author" varchar(100),
	"category" varchar(50),
	"content" text NOT NULL,
	"cover" varchar(500),
	"updatedAt" timestamp,
	"slug" varchar(255),
	"userId" uuid NOT NULL,
	CONSTRAINT "Publications_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Publications Sub" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"email" varchar(254) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"userId" uuid NOT NULL,
	"plan" varchar(32) DEFAULT 'free' NOT NULL,
	"validUntil" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Token" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"token" varchar(64) NOT NULL,
	"status" varchar DEFAULT 'open' NOT NULL,
	"userId" uuid NOT NULL,
	"packageName" varchar(32) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Token Password" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"token" uuid NOT NULL,
	"used" boolean DEFAULT false NOT NULL,
	"email" varchar(64) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp NOT NULL,
	"userId" uuid NOT NULL,
	"name" varchar(50) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"commission" numeric(10, 2) DEFAULT ROUND((amount * 0.25)::numeric, 2),
	"status" varchar(20) NOT NULL,
	"affiliate_code" varchar(12),
	"affiliator" uuid
);
--> statement-breakpoint
DROP TABLE "Subscription";--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "name" varchar(100);--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "phone" varchar(20);--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "createdAt" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "avatar" varchar(255);--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "geminiApiKey" varchar(255);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Affiliate" ADD CONSTRAINT "Affiliate_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Publications" ADD CONSTRAINT "Publications_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Subscriptions" ADD CONSTRAINT "Subscriptions_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_affiliator_User_id_fk" FOREIGN KEY ("affiliator") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
