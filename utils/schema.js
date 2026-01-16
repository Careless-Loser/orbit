import { pgTable, serial, varchar, integer, timestamp } from "drizzle-orm/pg-core";

/* Users table */
export const Users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  password: varchar("password").notNull(),
});

/* Budgets table */
export const Budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: integer("amount").notNull(),
  icon: varchar("icon"),
  createdBy: varchar("createdBy").notNull(),
});

/* Expenses table */
export const Expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  amount: integer("amount").notNull(),
  category: varchar("category").notNull(),
  budgetId: integer("budgetId").notNull(),
  createdBy: varchar("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
