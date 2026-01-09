import React from "react";
import { SignInButton, useUser } from "@clerk/nextjs";
import { CustomUserButton } from "@/components/CustomUserButton";

interface GoogleConnectButtonProps {
  googleConnected: boolean;
  onConnectGoogle: () => void;
}

export default function GoogleConnectButton({ 
  googleConnected, 
  onConnectGoogle 
}: GoogleConnectButtonProps) {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    return (
      <SignInButton>
        <button className="text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm">
          Sign In
        </button>
      </SignInButton>
    );
  }

  if (googleConnected) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <span className="h-2 w-2 rounded-full bg-green-500"></span>
        <span>Google Calendar</span>
      </div>
    );
  }

  return (
    <button
      onClick={onConnectGoogle}
      className="text-white bg-emerald-600 px-4 py-2 rounded hover:bg-emerald-700 transition-colors text-sm"
    >
      Connect Google Calendar
    </button>
  );
}