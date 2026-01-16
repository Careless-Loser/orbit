"use client";

import { useState } from "react";
import { toast } from "sonner";

function EditBudget({ budgetInfo, refreshData }) {
  const [name, setName] = useState(budgetInfo?.name || "");
  const [amount, setAmount] = useState(budgetInfo?.amount || "");
  const [loading, setLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const updateBudget = async () => {
    if (!name || !amount) return;

    setLoading(true);
    try {
      const res = await fetch("/api/budgets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: budgetInfo.id,
          name,
          amount,
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      toast.success("Budget updated");
      setShowEdit(false);
      refreshData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update budget");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* EDIT BUTTON */}
      {!showEdit && (
        <button
          onClick={() => setShowEdit(true)}
          className="h-9 px-4 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Edit
        </button>
      )}

      {/* EDIT PANEL */}
      {showEdit && (
        <div className="absolute right-6 top-24 z-40 w-[90vw] max-w-sm bg-white border rounded-xl shadow-lg p-4">
          <h3 className="font-semibold mb-3 text-sm">Edit Budget</h3>

          <div className="space-y-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Budget name"
              className="w-full border rounded-md px-3 py-2 text-sm"
            />

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={updateBudget}
              disabled={loading}
              className="flex-1 h-9 text-sm rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>

            <button
              onClick={() => setShowEdit(false)}
              className="flex-1 h-9 text-sm rounded-md bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default EditBudget;
