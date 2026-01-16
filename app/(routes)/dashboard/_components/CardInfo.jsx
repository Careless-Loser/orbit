"use client";
import React, { useEffect, useState } from "react";

export default function CardInfo({ budgetList = [] }) {
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [numberOfBudgets, setNumberOfBudgets] = useState(0);

  useEffect(() => {
    if (budgetList) {
      calculateCardInfo();
    }
  }, [budgetList]);

  const calculateCardInfo = () => {
    let totalBudget_ = 0;
    let totalSpent_ = 0;

    budgetList.forEach((element) => {
      totalBudget_ = totalBudget_ + Number(element.amount || 0);
      totalSpent_ = totalSpent_ + Number(element.totalSpent || 0);
    });

    setTotalBudget(totalBudget_);
    setTotalSpent(totalSpent_);
    setNumberOfBudgets(budgetList.length);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">Total Budget</p>
          <p className="font-bold text-l text-gray-900 dark:text-white">
            AED {totalBudget.toLocaleString()}
          </p>
        </div>
        <div className="text-3xl bg-blue-50 dark:bg-blue-900/30 p-3 rounded-full">💰</div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">Total Spent</p>
          <p className="font-bold text-l text-gray-900 dark:text-white">
            AED {totalSpent.toLocaleString()}
          </p>
        </div>
        <div className="text-3xl bg-red-50 dark:bg-red-900/30 p-3 rounded-full">📊</div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">Number of Budgets</p>
          <p className="font-bold text-l text-gray-900 dark:text-white">
            {numberOfBudgets}
          </p>
        </div>
        <div className="text-3xl bg-purple-50 dark:bg-purple-900/30 p-3 rounded-full">🗂️</div>
      </div>
    </div>
  );
}