"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

export default function AddExpense({ budgetId, refreshData }) {
  const [title, setTitle] = useState(""); // Changed from name to title
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const onAddExpense = async () => {
    if (!title || !amount) {
      toast.error("Fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,             // matches your Expenses table column
          amount: Number(amount),
          budgetId: Number(budgetId),
        }),
      });

      if (res.ok) {
        toast.success("Expense added successfully!");
        setTitle("");
        setAmount("");
        refreshData(); // refresh the list
      } else {
        toast.error("Failed to add expense");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error adding expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 border rounded-xl bg-white mb-6">
      <h2 className="font-semibold mb-3">Add Expense</h2>

      <input
        className="border p-2 w-full mb-2 rounded"
        placeholder="Expense Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="number"
        className="border p-2 w-full mb-2 rounded"
        placeholder="Amount (AED)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button
        onClick={onAddExpense}
        disabled={loading}
        className="bg-blue-700 text-white px-4 py-3 rounded w-full hover:bg-blue-800 transition"
      >
        {loading ? "Adding..." : "Add Expense"}
      </button>
    </div>
  );
}
