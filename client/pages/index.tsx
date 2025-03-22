"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";

// Define emoji type
interface Emoji {
  id: number;
  x: number;
  y: number;
  index: number;
}

const HomePage: React.FC = () => {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [emojis, setEmojis] = useState<Emoji[]>([]); // array to track active emojis

  // Scroll animation for the scrollable section
  const { scrollYProgress } = useScroll();
  const slideInLeft = useSpring(useTransform(scrollYProgress, [0, 0.5], [-200, 0]), {
    stiffness: 100,
    damping: 30,
  });
  const slideInRight = useSpring(useTransform(scrollYProgress, [0.5, 1], [200, 0]), {
    stiffness: 100,
    damping: 30,
  });
  const fadeIn = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), {
    stiffness: 100,
    damping: 30,
  });

  // Handle click in the hero section
  const handleHeroClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left; // X coordinate relative to the hero section
    const y = event.clientY - rect.top; // Y coordinate relative to the hero section

    // Use time to randomize emoji that pops up
    const currentTime = Date.now();
    const randomIndex = ((currentTime * 2) % 5) + 1;

    // Add emoji to active array
    const newEmoji: Emoji = {
      id: currentTime,
      x,
      y,
      index: randomIndex,
    };
    setEmojis((prev) => [...prev, newEmoji]);

    // Remove emoji from array after 2 seconds
    setTimeout(() => {
      setEmojis((prev) => prev.filter((emoji) => emoji.id !== newEmoji.id));
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">

      {/* Hero Section */}
      <section
        className="h-screen bg-gradient-to-r from-blue-500 to-teal-400 text-white flex flex-col items-center justify-center text-center p-12 relative"
        onClick={handleHeroClick}
      >
        {/* Emoji Pop-ups */}
        <AnimatePresence>
          {emojis.map((emoji) => (
            <motion.div
              key={emoji.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.5 }}
              className="absolute pointer-events-none select-none z-10"
              style={{
                left: emoji.x - 50,
                top: emoji.y - 60,
              }}
            >
              <img
                src={`/images/Wayfeel_Emojis-0${emoji.index}.png`}
                alt="Emoji"
                className="w-32 h-32 select-none"
                draggable="false"
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Logo and Slogan */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-3xl flex flex-col items-center z-20"
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
              className="w-96 mb-4 select-none"
              draggable="false"
            />
          </motion.div>

          {/* Slogan */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-xl font-medium mb-8 select-none"
          >
            Your Emotional Map to Feel, Share, and Heal
          </motion.p>

          {/* Sign In Button */}
          <SignInButton mode="modal" redirectUrl="/">
            <Button
              className="bg-white text-blue-500 font-bold px-8 py-4 rounded-lg shadow hover:bg-gray-100 z-20 select-none"
              onClick={() => {
                if (isSignedIn) {
                  router.push("/");
                }
              }}
            >
              Sign In
            </Button>
          </SignInButton>
        </motion.div>
      </section>

      {/*

      <section className="bg-white flex-1 p-12 z-10">
        <div className="max-w-4xl mx-auto space-y-12">
          <motion.div className="flex items-center gap-8">
            <motion.img
              src="/images/Wayfeel_Emojis-01.png"
              alt="Emoji 01"
              className="w-32 h-32 select-none"
              draggable="false"
              style={{
                x: useTransform(useScroll().scrollYProgress, [0, 0.3, 0.4, 0.6], [-100, 0, 0, -100]), // Buffer added
                opacity: useTransform(useScroll().scrollYProgress, [0, 0.3, 0.4, 0.6], [0, 1, 1, 0]), // Buffer added
              }}
            />
            <motion.p
              className="text-gray-800 text-lg flex-1"
              style={{
                opacity: useTransform(useScroll().scrollYProgress, [0, 0.3, 0.4, 0.6], [0, 1, 1, 0]), // Buffer added
              }}
            >
              Sample text Sample text Sample text Sample text Sample text Sample text
              Sample text Sample text Sample text Sample text Sample text Sample text
              Sample text Sample text Sample text Sample text Sample text Sample text
              Sample text Sample text Sample text Sample text Sample text Sample text
              Sample text Sample text Sample text Sample text Sample text Sample text
              Sample text Sample text Sample text Sample text Sample text Sample text
              Sample text Sample text Sample text Sample text Sample text Sample text
            </motion.p>
          </motion.div>

          <motion.div className="flex items-center gap-8">
            <motion.p
              className="text-gray-800 text-lg flex-1"
              style={{
                opacity: useTransform(useScroll().scrollYProgress, [0.2, 0.5, 0.6, 0.8], [0, 1, 1, 0]), // Buffer added
              }}
            >
              Sample text Sample text Sample text Sample text Sample text Sample text
              Sample text Sample text Sample text Sample text Sample text Sample text
              Sample text Sample text Sample text Sample text Sample text Sample text
              Sample text Sample text Sample text Sample text Sample text Sample text
              Sample text Sample text Sample text Sample text Sample text Sample text
              Sample text Sample text Sample text Sample text Sample text Sample text
              Sample text Sample text Sample text Sample text Sample text Sample text
            </motion.p>
            <motion.img
              src="/images/Wayfeel_Emojis-02.png"
              alt="Emoji 02"
              className="w-32 h-32 select-none"
              draggable="false"
              style={{
                x: useTransform(useScroll().scrollYProgress, [0.2, 0.5, 0.6, 0.8], [100, 0, 0, 100]), // Buffer added
                opacity: useTransform(useScroll().scrollYProgress, [0.2, 0.5, 0.6, 0.8], [0, 1, 1, 0]), // Buffer added
              }}
            />
          </motion.div>

          <motion.div className="flex items-center gap-8">
            <motion.img
              src="/images/Wayfeel_Emojis-03.png"
              alt="Emoji 03"
              className="w-32 h-32 select-none"
              draggable="false"
              style={{
                x: useTransform(useScroll().scrollYProgress, [0.3, 0.6, 0.7, 0.9], [-100, 0, 0, -100]), // Buffer added
                opacity: useTransform(useScroll().scrollYProgress, [0.3, 0.6, 0.7, 0.9], [0, 1, 1, 0]), // Buffer added
              }}
            />
            <motion.p
              className="text-gray-800 text-lg flex-1"
              style={{
                opacity: useTransform(useScroll().scrollYProgress, [0.3, 0.6, 0.7, 0.9], [0, 1, 1, 0]), // Buffer added
              }}
            >
              Sample text Sample text Sample text Sample text Sample text Sample text
              Sample text Sample text Sample text Sample text Sample text Sample text
              Sample text Sample text Sample text Sample text Sample text Sample text
              Sample text Sample text Sample text Sample text Sample text Sample text
              Sample text Sample text Sample text Sample text Sample text Sample text
              Sample text Sample text Sample text Sample text Sample text Sample text
              Sample text Sample text Sample text Sample text Sample text Sample text
            </motion.p>
          </motion.div>

          <motion.div className="flex items-center gap-8">
            <motion.p
              className="text-gray-800 text-lg flex-1"
              style={{
                opacity: useTransform(useScroll().scrollYProgress, [0.4, 0.7, 0.8, 1.0], [0, 1, 1, 0]), // Buffer added
              }}
            >
              Sample text Sample text Sample text Sample text Sample text Sample text
              Sample text Sample text Sample text Sample text Sample text Sample text
              Sample text Sample text Sample text Sample text Sample text Sample text
              Sample text Sample text Sample text Sample text Sample text Sample text
              Sample text Sample text Sample text Sample text Sample text Sample text
              Sample text Sample text Sample text Sample text Sample text Sample text
              Sample text Sample text Sample text Sample text Sample text Sample text
            </motion.p>
            <motion.img
              src="/images/Wayfeel_Emojis-04.png"
              alt="Emoji 04"
              className="w-32 h-32 select-none"
              draggable="false"
              style={{
                x: useTransform(useScroll().scrollYProgress, [0.4, 0.7, 0.8, 1.0], [100, 0, 0, 100]), // Buffer added
                opacity: useTransform(useScroll().scrollYProgress, [0.4, 0.7, 0.8, 1.0], [0, 1, 1, 0]), // Buffer added
              }}
            />
          </motion.div>

          <motion.div className="flex items-center gap-8">
            <motion.img
              src="/images/Wayfeel_Emojis-05.png"
              alt="Emoji 05"
              className="w-32 h-32 select-none"
              draggable="false"
              style={{
                x: useTransform(useScroll().scrollYProgress, [0.5, 0.8, 0.9, 1.1], [-100, 0, 0, -100]), // Buffer added
                opacity: useTransform(useScroll().scrollYProgress, [0.5, 0.8, 0.9, 1.1], [0, 1, 1, 0]), // Buffer added
              }}
            />
            <motion.p
              className="text-gray-800 text-lg flex-1"
              style={{
                opacity: useTransform(useScroll().scrollYProgress, [0.5, 0.8, 0.9, 1.1], [0, 1, 1, 0]), // Buffer added
              }}
            >
              Sample text Sample text Sample text Sample text Sample text Sample text
              Sample text Sample text Sample text Sample text Sample text Sample text
              Sample text Sample text Sample text Sample text Sample text Sample text
              Sample text Sample text Sample text Sample text Sample text Sample text
              Sample text Sample text Sample text Sample text Sample text Sample text
              Sample text Sample text Sample text Sample text Sample text Sample text
              Sample text Sample text Sample text Sample text Sample text Sample text
            </motion.p>
          </motion.div>
        </div>
      </section>
      
      <section id="contact" className="py-12 bg-white text-gray-800">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-8">Contact Us</h2>
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-lg font-medium mb-2">
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Your Name"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-lg font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Your Email"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-lg font-medium mb-2">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                placeholder="Your Message"
                className="w-full p-3 border border-gray-300 rounded-lg"
              ></textarea>
            </div>
            <div className="text-center">
              <Button className="bg-blue-500 text-white font-bold px-8 py-4 rounded-lg hover:bg-blue-600">
                Send Message
              </Button>
            </div>
          </form>
        </div>
      </section>

      <footer className="p-6 bg-gray-800 text-center text-white">
        <p>&copy; {new Date().getFullYear()} WayFeel. All rights reserved.</p>
      </footer>

      */}

    </div>
  );
};

export default HomePage;