"use server";

import { db } from "@/utils/dbConfig";
import { Expenses } from "@/utils/schema";
import { eq } from "drizzle-orm";

export async function addExpense({ title, amount, budgetId, createdBy }) {
  await db.insert(Expenses).values({
    title,
    amount: Number(amount),
    budgetId: Number(budgetId),
    createdBy,
  });
}

export async function getExpenses(budgetId) {
  return await db
    .select()
    .from(Expenses)
    .where(eq(Expenses.budgetId, Number(budgetId)));
}
