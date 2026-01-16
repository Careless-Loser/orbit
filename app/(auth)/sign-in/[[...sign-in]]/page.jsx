"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="w-full flex h-screen">
      {/* LEFT SIDE */}
      <div className="relative flex-1 hidden lg:flex items-center justify-center bg-gray-900">
        <div className="relative z-10 max-w-md w-full">
          <img src="/orbit1.svg" width={150} alt="Orbit Logo" />

          <div className="mt-12 space-y-4">
            <h3 className="text-white text-3xl font-bold">
              Ready to take control?
            </h3>
            <p className="text-gray-300">
              Log in to continue tracking your expenses with Orbit.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="h-screen flex items-center justify-center">
      <SignIn />
    </div>
    </main>
  );
}
