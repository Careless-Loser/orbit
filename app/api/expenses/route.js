import { NextResponse } from "next/server";
import { db } from "@/utils/dbConfig";
import { Expenses, Budgets } from "@/utils/schema"; // Added Budgets to imports
import { eq, desc } from "drizzle-orm";

/* ================= GET ================= */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const budgetId = searchParams.get("budgetId");

    if (!budgetId) return NextResponse.json([]);

    // We join the Expenses table with the Budgets table 
    // to pull the 'name' column from the budget
    const data = await db
      .select({
        id: Expenses.id,
        title: Expenses.title,
        amount: Expenses.amount,
        createdAt: Expenses.createdAt,
        budgetName: Budgets.name, // This pulls the budget name
      })
      .from(Expenses)
      .leftJoin(Budgets, eq(Expenses.budgetId, Budgets.id))
      .where(eq(Expenses.budgetId, Number(budgetId)))
      .orderBy(desc(Expenses.id));

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/expenses error:", error);
    return NextResponse.json([]);
  }
}

/* ================= POST ================= */
export async function POST(req) {
  try {
    const body = await req.json();

    // ✅ Check required fields
    if (!body.title || !body.amount || !body.budgetId) {
      console.log("Missing fields:", body);
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const [expense] = await db
      .insert(Expenses)
      .values({
        title: body.title,
        amount: Number(body.amount),
        category: body.category || "",
        budgetId: Number(body.budgetId),
        createdBy: body.createdBy || "default", 
      })
      .returning();

    return NextResponse.json(expense);
  } catch (error) {
    console.error("POST /api/expenses error:", error);
    return NextResponse.json(
      { error: "Failed to add expense" },
      { status: 500 }
    );
  }
}

/* ================= DELETE ================= */
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json(null, { status: 400 });

    await db.delete(Expenses).where(eq(Expenses.id, Number(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/expenses error:", error);
    return NextResponse.json(null, { status: 500 });
  }
}