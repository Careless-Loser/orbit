import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { eq, desc, sql, getTableColumns } from "drizzle-orm";
import CardInfo from "./_components/CardInfo";
import BarChartDashboard from "./_components/BarChartDashboard";
import ExpenseListTable from "../dashboard/expenses/_components/ExpenseListTable";
import SavingTips from "./_components/SavingTips"; // New Component

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  try {
    const user = await currentUser();
    const clerkId = user?.id;

    if (!clerkId) {
      return (
        <div className="p-10 text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Please login to view your dashboard.
          </h2>
        </div>
      );
    }

    // 1. Fetch budgets and calculate total spent for each
    const budgetList = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpent: sql`COALESCE(SUM(${Expenses.amount}), 0)`.mapWith(Number),
        totalItems: sql`COUNT(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, clerkId))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));

    // 2. Fetch latest expenses for the user
    const expensesList = await db
      .select({
        id: Expenses.id,
        title: Expenses.title,
        amount: Expenses.amount,
        createdAt: Expenses.createdAt,
        budgetName: Budgets.name,
      })
      .from(Expenses)
      .leftJoin(Budgets, eq(Expenses.budgetId, Budgets.id))
      .where(eq(Expenses.createdBy, clerkId))
      .orderBy(desc(Expenses.id))
      .limit(10);

    return (
      <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <h2 className="font-bold text-4xl text-gray-900 dark:text-white">
          Hi, {user.firstName} ✌️
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Here's your financial status at a glance.
        </p>

        <CardInfo budgetList={budgetList || []} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="font-bold mb-4 text-gray-900 dark:text-gray-100">
                Budget Distribution (Stacked)
              </h2>
              <BarChartDashboard budgetList={budgetList || []} />
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold mb-4 text-gray-900 dark:text-gray-100">
                Latest Expenses
              </h3>
              <ExpenseListTable expensesList={expensesList || []} />
            </div>
          </div>

          {/* REPLACED Latest Budgets with Saving Tips */}
          <div className="flex flex-col gap-5">
             <SavingTips />
          </div>
        </div>
      </div>
    );
  } catch (err) {
    console.error("Dashboard Page Error:", err);
    return (
      <div className="p-10 text-red-500 bg-red-50 rounded-lg m-10 border border-red-200 text-center">
        <h2 className="font-bold text-xl">Database Error</h2>
        <p>Could not load your financial data.</p>
      </div>
    );
  }
}