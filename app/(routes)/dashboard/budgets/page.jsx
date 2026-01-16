"use client";

import { useEffect, useState } from "react";
import BudgetItem from "./_components/BudgetItem";
import CreateBudget from "./_components/CreateBudget";

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  // ✅ Fetch budgets + calculate expenses
  const fetchBudgets = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/budgets");
      const data = await res.json();
      const budgetsArray = Array.isArray(data) ? data : [];

      const budgetsWithExpenses = await Promise.all(
        budgetsArray.map(async (budget) => {
          try {
            const expRes = await fetch(
              `/api/expenses?budgetId=${budget.id}`
            );
            const expenses = await expRes.json();

            const totalSpend = expenses.reduce(
              (sum, exp) => sum + Number(exp.amount || 0),
              0
            );

            return {
              ...budget,
              totalSpend,
              totalItem: expenses.length,
            };
          } catch {
            return { ...budget, totalSpend: 0, totalItem: 0 };
          }
        })
      );

      setBudgets(budgetsWithExpenses);
    } catch (err) {
      console.error("Failed to fetch budgets", err);
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Remove budget from UI after delete
  const handleDelete = (id) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Budgets</h1>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* ➕ Create Budget Card (only after loading) */}
        {!loading && (
          <div
            onClick={() => setShowCreate(true)}
            className="h-[170px] rounded-xl border-2 border-dashed
              flex items-center justify-center cursor-pointer
              hover:shadow-md transition bg-white"
          >
            <h2 className="text-lg font-semibold text-gray-500">
              + Create New Budget
            </h2>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading &&
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[170px] rounded-xl bg-slate-200 animate-pulse"
            />
          ))}

        {/* Budget Cards */}
        {!loading &&
          budgets.map((budget) => (
            <BudgetItem
              key={budget.id}
              budget={budget}
              onDelete={handleDelete}
            />
          ))}
      </div>

      {/* Empty State */}
      {!loading && budgets.length === 0 && (
        <p className="text-gray-500 mt-6">
          No budgets found. Create your first budget.
        </p>
      )}

      {/* Create Budget Modal */}
      {showCreate && (
        <CreateBudget
          open={showCreate}
          onClose={() => setShowCreate(false)}
          onBudgetCreated={fetchBudgets}
        />
      )}
    </div>
  );
}
