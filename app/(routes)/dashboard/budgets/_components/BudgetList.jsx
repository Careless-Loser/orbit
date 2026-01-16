"use client";

import React, { useEffect, useState } from "react";
import BudgetItem from "./BudgetItem";

export default function BudgetList({ refreshKey, onOpenCreate }) {
  const [budgetList, setBudgetList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBudgetList();
  }, [refreshKey]);

  const getBudgetList = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/budgets");
      const data = await res.json();
      setBudgetList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching budgets:", err);
      setBudgetList([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-7">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

        {/* ➕ Create New Budget */}
        <div
          onClick={onOpenCreate}
          className="h-[170px] rounded-xl border-2 border-dashed
            flex items-center justify-center cursor-pointer
            hover:shadow-md transition"
        >
          <h2 className="text-lg font-semibold text-gray-500">
            + Create New Budget
          </h2>
        </div>

        {/* Loading Skeleton */}
        {loading &&
          [1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-[170px] rounded-xl bg-slate-200 animate-pulse p-5"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-300" />
                  <div>
                    <div className="w-24 h-3 bg-slate-300 rounded mb-2" />
                    <div className="w-16 h-3 bg-slate-300 rounded" />
                  </div>
                </div>
                <div className="w-16 h-4 bg-slate-300 rounded" />
              </div>
              <div className="flex justify-between mb-3">
                <div className="w-24 h-3 bg-slate-300 rounded" />
                <div className="w-24 h-3 bg-slate-300 rounded" />
              </div>
              <div className="w-full h-2 bg-slate-300 rounded-full" />
            </div>
          ))}

        {/* Budget Cards */}
        {!loading &&
          budgetList.map((budget) => (
            <BudgetItem key={budget.id} budget={budget} />
          ))}

        {/* Empty State */}
        {!loading && budgetList.length === 0 && (
          <div className="col-span-full text-center text-gray-500 mt-10">
            No budgets found. Create your first budget.
          </div>
        )}
      </div>
    </div>
  );
}
