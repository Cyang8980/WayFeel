"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";

const HomePage: React.FC = () => {
  const { isSignedIn } = useUser();
  const router = useRouter();

  // Redirect to the root URL if the user is signed in
  useEffect(() => {
    if (isSignedIn) {
      router.push("/"); // Redirect to the root URL
    }
  }, [isSignedIn, router]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 bg-gradient-to-r from-blue-500 to-teal-400 text-white flex flex-col items-center justify-center text-center p-12">
  <motion.div
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
    className="max-w-3xl"
  >
    {/* Logo Image */}
    <motion.div
      initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }} 
      animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }} 
      transition={{ duration: 2, delay: 0.5 }} 
      style={{ overflow: "hidden" }} 
    >
      <img
        src="/images/Wayfeel_Logo_WHT-03.png"
        alt="WayFeel Logo"
        className="w-64 mb-6" 
      />
    </motion.div>

    {/* Sign In Button */}
    <SignInButton mode="modal">
      <Button
        className="bg-white text-blue-500 font-bold px-8 py-4 rounded-lg shadow hover:bg-gray-100"
      >
        Sign In
      </Button>
    </SignInButton>
    
  </motion.div>
</section>
    </div>
  );
};

export default HomePage;