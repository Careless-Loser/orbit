"use client";

import { UserButton } from "@clerk/nextjs";

export default function DashboardHeader({ children }) {
  return (
    <header className="relative flex items-center justify-between p-5 shadow-sm border-b bg-white dark:bg-black">

      <div className="flex items-center gap-4">
        {children /* Hamburger button injected from layout */}
        <UserButton/>
      </div>
    </header>
  );
}
