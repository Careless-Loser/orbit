"use client";

import { useEffect, useState } from "react";
import BudgetItem from "../budgets/_components/BudgetItem";

import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ExpensesPage() {
  const [budgets, setBudgets] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------- FETCH BUDGETS ---------- */
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
              (sum, exp) => sum + Number(exp.amount ?? 0),
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
      console.error(err);
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- SELECT / CLEAR ---------- */
  const selectBudget = (budget) => {
    setSelectedBudget(budget);
  };

  const clearSelection = () => {
    setSelectedBudget(null);
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* ---------- BUDGET LIST ---------- */}
      <div className="bg-white border rounded-xl overflow-hidden h-fit">
        <h2 className="px-4 py-3 font-semibold border-b">
          Budgets
        </h2>

        {!loading && budgets.length === 0 && (
          <p className="p-4 text-gray-500">No budgets found</p>
        )}

        {budgets.map((budget) => {
          const isActive = selectedBudget?.id === budget.id;

          return (
            <button
              key={budget.id}
              onClick={() => selectBudget(budget)}
              className={`w-full flex items-center justify-between px-4 py-3 border-b text-left transition
                ${isActive ? "bg-blue-50" : "hover:bg-gray-50"}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  {budget.icon || "💰"}
                </span>
                <div>
                  <p className="font-medium">{budget.name}</p>
                  <p className="text-xs text-gray-500">
                    {budget.totalItem} items
                  </p>
                </div>
              </div>

              <span className="text-sm font-semibold">
                {budget.amount} AED
              </span>
            </button>
          );
        })}
      </div>

      {/* ---------- RIGHT CONTENT ---------- */}
      <div className="lg:col-span-3 space-y-6">
        {!selectedBudget ? (
          <div className="text-center text-gray-500 mt-20">
            Select a budget to view overview
          </div>
        ) : (
          <>
            {/* Header + Close */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                Budget Overview
              </h2>

              <button
                onClick={clearSelection}
                className="text-gray-500 hover:text-red-500 text-2xl"
                title="Close"
              >
                ×
              </button>
            </div>

            {/* Budget Card */}
            <BudgetItem budget={selectedBudget} />

            {/* Pie Chart */}
            <div className="bg-white p-6 rounded-xl border max-w-md">
              <Pie
                data={{
                  labels: ["Spent", "Remaining"],
                  datasets: [
                    {
                      data: [
                        selectedBudget.totalSpend,
                        Math.max(
                          selectedBudget.amount -
                            selectedBudget.totalSpend,
                          0
                        ),
                      ],
                      backgroundColor: [
                        "#ef4444", // red
                        "#22c55e", // green
                      ],
                      hoverOffset: 6,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                  },
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
