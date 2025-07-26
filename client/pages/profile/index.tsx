"use client";

import { CustomUserButton } from "@/stuff/CustomUserButton";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect } from "react";

const ProfilePage = () => {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <CustomUserButton />
    </div>
  );
};

export default ProfilePage;
