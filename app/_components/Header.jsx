"use client";

import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image src="/orbit.svg" alt="Orbit" width={80} height={40} />
          </div>

          {/* Auth */}
          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton>
                <button className="rounded-md bg-[#1b17ff] px-4 py-2 text-sm font-medium text-white hover:bg-black">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserButton/>
            </SignedIn>
          </div>

        </div>
      </div>
    </header>
  );
}
