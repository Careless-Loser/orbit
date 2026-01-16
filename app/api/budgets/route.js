import { NextResponse } from "next/server";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { eq, and } from "drizzle-orm";
import { getAuth } from "@clerk/nextjs/server";

/* ================= GET ================= */
export async function GET(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const [budget] = await db
        .select()
        .from(Budgets)
        .where(
          and(
            eq(Budgets.id, Number(id)),
            eq(Budgets.createdBy, userId)
          )
        );

      return NextResponse.json(budget ?? null);
    }

    const budgets = await db
      .select()
      .from(Budgets)
      .where(eq(Budgets.createdBy, userId));

    return NextResponse.json(budgets);
  } catch (err) {
    console.error("GET /api/budgets error:", err);
    return NextResponse.json([], { status: 500 });
  }
}

/* ================= POST ================= */
export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const [budget] = await db
      .insert(Budgets)
      .values({
        name: body.name,
        amount: Number(body.amount),
        icon: body.icon || "💰",
        createdBy: userId,
      })
      .returning();

    return NextResponse.json(budget);
  } catch (err) {
    console.error("POST /api/budgets error:", err);
    return NextResponse.json({ error: "Failed to create budget" }, { status: 500 });
  }
}

/* ================= PUT (EDIT) ================= */
export async function PUT(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    await db
      .update(Budgets)
      .set({
        name: body.name,
        amount: Number(body.amount),
      })
      .where(
        and(
          eq(Budgets.id, Number(body.id)),
          eq(Budgets.createdBy, userId)
        )
      );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT /api/budgets error:", err);
    return NextResponse.json({ error: "Failed to update budget" }, { status: 500 });
  }
}

/* ================= DELETE ================= */
export async function DELETE(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Budget ID required" }, { status: 400 });
    }

    // Delete related expenses first to maintain integrity
    await db.delete(Expenses).where(eq(Expenses.budgetId, Number(id)));
    
    // Delete the budget
    await db
      .delete(Budgets)
      .where(
        and(
          eq(Budgets.id, Number(id)),
          eq(Budgets.createdBy, userId)
        )
      );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/budgets error:", err);
    return NextResponse.json({ error: "Failed to delete budget" }, { status: 500 });
  }
}