"use client";
import React, { useEffect, useState } from "react";
import { Lightbulb } from "lucide-react";

export default function SavingTips() {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        // Example using Advice Slip API (Free)
        const res = await fetch("https://api.adviceslip.com/advice/search/money");
        const data = await res.json();
        
        // If no money-specific advice found, get a random slip
        if (data.slips) {
          setTips(data.slips.slice(0, 3));
        } else {
          const randomRes = await fetch("https://api.adviceslip.com/advice");
          const randomData = await randomRes.json();
          setTips([randomData.slip]);
        }
      } catch (error) {
        console.error("Error fetching tips:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="text-yellow-500" />
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Saving Tips</h3>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {tips.map((tip, index) => (
            <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                "{tip.advice}"
              </p>
            </div>
          ))}
          <button 
            onClick={() => window.location.reload()}
            className="text-xs text-blue-600 dark:text-blue-400 text-right hover:underline"
          >
            Refresh Tips
          </button>
        </div>
      )}
    </div>
  );
}