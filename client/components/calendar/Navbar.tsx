import React from "react";
import { SignInButton, useUser } from "@clerk/nextjs";
import { CustomUserButton } from "@/components/CustomUserButton";

export default function NavBar({
  googleConnected,
  onConnectGoogle,
}: {
  googleConnected: boolean;
  onConnectGoogle: () => void;
}) {
  const { isSignedIn } = useUser();
  return (
    <nav className="bg-gray-800 text-white fixed w-full z-50 flex justify-between items-center px-4 py-3">
      <h1 className="text-xl font-bold">Wayfeel</h1>
      <div className="flex items-center gap-2">
        {isSignedIn && (
          <>
            {googleConnected ? (
              <span className="text-sm opacity-80">Google Calendar connected</span>
            ) : (
              <button
                onClick={onConnectGoogle}
                className="text-white bg-emerald-600 px-3 py-2 rounded hover:bg-emerald-700 transition-colors"
              >
                Connect Google Calendar
              </button>
            )}
          </>
        )}
        {!isSignedIn ? (
          <SignInButton>
            <button className="text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition-colors">
              Sign In
            </button>
          </SignInButton>
        ) : (
          <CustomUserButton />
        )}
      </div>
    </nav>
  );
}
