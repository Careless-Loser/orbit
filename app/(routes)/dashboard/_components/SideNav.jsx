"use client";

import React from "react";
import Image from "next/image";
import { BanknoteIcon, LayoutGrid, ReceiptIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

export default function SideNav({ onLinkClick }) {
  const router = useRouter();
  const pathname = usePathname();

  const menuList = [
    { id: 1, name: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
    { id: 2, name: "Budgets", icon: BanknoteIcon, path: "/dashboard/budgets" },
    { id: 3, name: "Expenses", icon: ReceiptIcon, path: "/dashboard/expenses" },
  ];

  return (
    <div className="h-full flex flex-col justify-between p-5">
      <div>
        <Image src="/orbit.svg" alt="logo" width={140} height={100} />

        <div className="mt-5 flex flex-col gap-2">
          {menuList.map((menu) => {
            const isActive = pathname === menu.path;

            return (
              <button
                key={menu.id}
                onClick={() => {
                  router.push(menu.path);
                  onLinkClick?.(); // Close sidebar on mobile
                }}
                className={`flex items-center gap-2 p-3 rounded-md font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-700 text-white"
                    : "text-gray-700 hover:bg-blue-700 hover:text-white"
                }`}
              >
                <menu.icon />
                {menu.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-5">
        <UserButton />
        <span className="hidden md:inline">Profile</span>
      </div>
    </div>
  );
}
