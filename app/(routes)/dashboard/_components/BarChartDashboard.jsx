"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function BarChartDashboard({ budgetList = [] }) {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={budgetList}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }}
            itemStyle={{ color: "#fff" }}
          />
          <Legend />
          {/* Using stackId="a" creates the stacked effect */}
          <Bar dataKey="totalSpent" stackId="a" fill="#4f46e5" name="Total Spent" />
          <Bar dataKey="amount" stackId="a" fill="#c7d2fe" name="Remaining Budget" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}