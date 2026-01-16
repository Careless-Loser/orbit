CREATE TABLE "budgets" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"amount" integer NOT NULL,
	"icon" varchar,
	"createdBy" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"amount" integer NOT NULL,
	"category" varchar NOT NULL,
	"createdBy" varchar NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL
);
