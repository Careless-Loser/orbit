"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ExpensesListTable({ expensesList = [] }) {
  const [deleteModal, setDeleteModal] = useState({ show: false, expense: null });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const openDeleteModal = (expense) => setDeleteModal({ show: true, expense });
  const closeDeleteModal = () => setDeleteModal({ show: false, expense: null });

  const confirmDeleteExpense = async () => {
    if (!deleteModal.expense) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/expenses?id=${deleteModal.expense.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete expense");

      // Use router.refresh() to tell the Server Component to refetch data
      router.refresh();
      closeDeleteModal();
    } catch (err) {
      console.error(err);
      alert("Error deleting expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full border border-gray-200 dark:border-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Amount</th>
            <th className="p-3 text-left">Budget</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 dark:text-gray-300">
          {expensesList.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-4 text-center text-gray-500 italic">
                No expenses added
              </td>
            </tr>
          ) : (
            expensesList.map((expense) => (
              <tr key={expense.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="p-3 font-medium">{expense.title}</td>
                <td className="p-3 font-semibold">{expense.amount} AED</td>
                <td className="p-3">
                    {expense.budgetName}
                </td>
                <td className="p-3">
                  {expense.createdAt ? new Date(expense.createdAt).toLocaleDateString() : "N/A"}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => openDeleteModal(expense)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Confirm Delete
            </h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Are you sure you want to delete <strong>{deleteModal.expense?.title}</strong>? This cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                disabled={loading}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteExpense}
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-white font-medium ${
                  loading ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}