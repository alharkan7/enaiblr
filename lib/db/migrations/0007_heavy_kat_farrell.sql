CREATE TABLE IF NOT EXISTS "ft_budgets" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"timestamp" timestamp,
	"date" date NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"notes" text,
	"budget_type" varchar(100) DEFAULT 'monthly',
	"period_start" date,
	"period_end" date,
	"source" varchar(255) DEFAULT 'manual',
	"external_id" varchar(255),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ft_expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"timestamp" timestamp,
	"date" date NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"category" varchar(255) NOT NULL,
	"description" text,
	"source" varchar(255) DEFAULT 'manual',
	"external_id" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ft_incomes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"timestamp" timestamp,
	"date" date NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"category" varchar(255) NOT NULL,
	"description" text,
	"source" varchar(255) DEFAULT 'manual',
	"external_id" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ft_main" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"avatar" varchar(255),
	"sheet_id" varchar(255),
	"expense_categories" json DEFAULT '[]',
	"income_categories" json DEFAULT '[]',
	"monthly_budget" numeric(15, 2) DEFAULT '0',
	"preferences" json DEFAULT '{}',
	"is_active" boolean DEFAULT true,
	"last_login" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ft_main_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ft_budgets" ADD CONSTRAINT "ft_budgets_user_id_ft_main_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."ft_main"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ft_expenses" ADD CONSTRAINT "ft_expenses_user_id_ft_main_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."ft_main"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ft_incomes" ADD CONSTRAINT "ft_incomes_user_id_ft_main_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."ft_main"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
