"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function BudgetItem({ budget, onDelete }) {
  if (!budget) return null;

  const total = Number(budget.amount ?? 0);
  const spent = Number(budget.totalSpend ?? 0);
  const items = Number(budget.totalItem ?? 0);
  const icon = budget.icon || "💰";

  const safeTotal = total > 0 ? total : 1;
  const remaining = Math.max(safeTotal - spent, 0);
  const progressPercent = Math.min((spent / safeTotal) * 100, 100);

  /* ---------- Animated values ---------- */
  const [animatedSpent, setAnimatedSpent] = useState(0);
  const [animatedRemaining, setAnimatedRemaining] = useState(safeTotal);

  useEffect(() => {
    let s = 0;
    let r = safeTotal;
    const steps = 20;
    const stepSpent = Math.max(Math.ceil(spent / steps), 1);
    const stepRemain = Math.max(Math.ceil(remaining / steps), 1);

    const interval = setInterval(() => {
      s += stepSpent;
      r -= stepRemain;

      if (s >= spent && r <= remaining) {
        setAnimatedSpent(spent);
        setAnimatedRemaining(remaining);
        clearInterval(interval);
      } else {
        setAnimatedSpent(Math.min(s, spent));
        setAnimatedRemaining(Math.max(r, remaining));
      }
    }, 30);

    return () => clearInterval(interval);
  }, [spent, remaining, safeTotal]);

  /* ---------- Progress color ---------- */
  const getProgressColor = () => {
    if (progressPercent < 70) return "bg-blue-600";
    if (progressPercent < 90) return "bg-yellow-500";
    return "bg-red-600";
  };

  return (
    <Link href={`/dashboard/expenses/${budget.id}`}>
      <div className="p-5 border rounded-xl hover:shadow-md bg-white relative transition cursor-pointer">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 text-2xl">
              {icon}
            </div>
            <div>
              <h3 className="font-semibold">{budget.name}</h3>
              <p className="text-sm text-gray-500">{items} items</p>
            </div>
          </div>
          <p className="text-lg font-bold">{safeTotal} AED</p>
        </div>

        {/* Numbers */}
        <div className="flex items-center justify-between mt-5 mb-3">
          <h2 className="text-xs text-slate-400">
            {animatedSpent} AED Spent
          </h2>
          <h2 className="text-xs text-slate-400">
            {animatedRemaining} AED Remaining
          </h2>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`${getProgressColor()} h-full transition-all duration-500`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
