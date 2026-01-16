"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="w-full flex h-screen">
      {/* LEFT SIDE */}
      <div className="relative flex-1 hidden lg:flex items-center justify-center bg-gray-900">
        <div className="relative z-10 max-w-md w-full">
          <img src="/orbit1.svg" width={150} alt="Orbit Logo" />

          <div className="mt-12 space-y-4">
            <h3 className="text-white text-3xl font-bold">
              Start managing your expenses effortlessly
            </h3>
            <p className="text-white">
              Create an account and access Orbit — your expense dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="h-screen flex items-center justify-center">
      <SignUp/>
    </div>
    </main>
  );
}
