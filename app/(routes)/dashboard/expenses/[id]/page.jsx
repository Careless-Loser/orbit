"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AddExpense from "../_components/AddExpense";
import EditBudget from "../_components/EditBudget";
import ExpensesListTable from "../_components/ExpenseListTable";

export default function ExpensesPage() {
  const { id: budgetId } = useParams();
  const router = useRouter();

  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchBudgetAndExpenses = async () => {
    try {
      setLoading(true);

      const budgetRes = await fetch(`/api/budgets?id=${budgetId}`);
      const budgetData = await budgetRes.json();

      const expRes = await fetch(`/api/expenses?budgetId=${budgetId}`);
      const expData = await expRes.json();

      setBudget(budgetData);
      setExpenses(Array.isArray(expData) ? expData : []);
    } catch (err) {
      console.error(err);
      setBudget(null);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (budgetId) fetchBudgetAndExpenses();
  }, [budgetId]);

  const deleteBudget = async () => {
    try {
      await fetch(`/api/budgets?id=${budgetId}`, { method: "DELETE" });
      router.push("/dashboard");
    } catch {
      alert("Failed to delete");
    }
  };

  const totalSpent = expenses.reduce(
    (sum, item) => sum + Number(item.amount ?? 0),
    0
  );

  const remaining = budget ? budget.amount - totalSpent : 0;

  return (
    <div className="max-w-6xl mx-auto p-6 relative">
      {/* HEADER */}
      {!loading && budget && (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {/* INFO */}
          <div>
            <h1 className="text-2xl font-bold">{budget.name}</h1>
            <p className="text-sm text-gray-600 mt-1">
              Spent: <span className="font-medium">{totalSpent} AED</span>
            </p>
            <p className="text-sm text-gray-500">
              Remaining: <span className="font-medium">{remaining} AED</span>
            </p>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-2">
            <EditBudget
              budgetInfo={budget}
              refreshData={fetchBudgetAndExpenses}
            />

            <button
              onClick={() => setShowDeleteModal(true)}
              className="h-9 px-4 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="font-bold text-lg mb-2">Delete Budget</h2>
            <p className="text-sm text-gray-600 mb-4">
              This will permanently delete{" "}
              <span className="font-semibold">{budget?.name}</span> and all
              expenses.
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="h-9 px-4 text-sm rounded-md border"
              >
                Cancel
              </button>
              <button
                onClick={deleteBudget}
                className="h-9 px-4 text-sm rounded-md bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <AddExpense
        budgetId={budgetId}
        refreshData={fetchBudgetAndExpenses}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ExpensesListTable
          expensesList={expenses}
          refreshData={fetchBudgetAndExpenses}
        />
      )}
    </div>
  );
}
