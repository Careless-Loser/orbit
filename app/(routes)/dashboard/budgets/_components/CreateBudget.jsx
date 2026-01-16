"use client";

import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-hot-toast";

function CreateBudget({ open, onClose, onBudgetCreated }) {
  const { user } = useUser();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [emojiIcon, setEmojiIcon] = useState("💰");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleCreate = async () => {
    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          amount: Number(amount),
          icon: emojiIcon,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Failed to create budget");
      }

      toast.success("Budget created successfully!");

      setName("");
      setAmount("");
      setEmojiIcon("💰");

      onBudgetCreated?.();
      onClose();
    } catch (err) {
      console.error("Create budget error:", err);
      toast.error(err.message || "Failed to create budget");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[400px] rounded-lg p-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 text-lg font-bold"
        >
          ✕
        </button>

        <h2 className="font-bold text-xl mb-4">Create Budget</h2>

        {/* Emoji Picker */}
        <div className="mb-3 relative">
          <label className="text-sm text-gray-500">Icon</label>
          <br />
          <button
            onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
            className="w-10 border rounded p-2 mt-1 text-lg"
          >
            {emojiIcon}
          </button>

          {openEmojiPicker && (
            <div className="absolute z-50 mt-2">
              <EmojiPicker
                onEmojiClick={(emoji) => {
                  setEmojiIcon(emoji.emoji);
                  setOpenEmojiPicker(false);
                }}
              />
            </div>
          )}
        </div>

        {/* Budget Name */}
        <div className="mb-3">
          <label className="font-bold text-sm text-gray-800">Budget Name</label>
          <input
            placeholder="e.g. Car Insurance"
            className="w-full border rounded p-2 mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label className="font-bold text-sm text-gray-800">Amount</label>
          <input
            placeholder="e.g. 1000"
            type="number"
            className="w-full border rounded p-2 mt-1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <button
          onClick={handleCreate}
          disabled={!name || !amount || loading}
          className="w-full bg-blue-700 text-white rounded p-2 hover:bg-blue-800 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Budget"}
        </button>
      </div>
    </div>
  );
}

export default CreateBudget;
