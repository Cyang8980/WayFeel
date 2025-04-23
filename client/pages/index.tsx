import React, { useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { Button } from "@/Components/ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { insertUser } from "./api/insertUser";

// Define emoji type
interface Emoji {
  id: number;
  x: number;
  y: number;
  index: number;
}

const HomePage: React.FC = () => {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const [emojis, setEmojis] = useState<Emoji[]>([]); // array to track active emojis
  const [clickCount, setClickCount] = useState(0); // track number of clicks
  const [showTextBox, setShowTextBox] = useState(false); // control visibility of text box

  // Scroll animation for the scrollable section
  // const { scrollYProgress } = useScroll();
  // const slideInLeft = useSpring(useTransform(scrollYProgress, [0, 0.5], [-200, 0]), {
  //   stiffness: 100,
  //   damping: 30,
  // });
  // const slideInRight = useSpring(useTransform(scrollYProgress, [0.5, 1], [200, 0]), {
  //   stiffness: 100,
  //   damping: 30,
  // });
  // const fadeIn = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), {
  //   stiffness: 100,
  //   damping: 30,
  // });

  // Handle click in the hero section
  const handleHeroClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left; // X coordinate relative to the hero section
    const y = event.clientY - rect.top; // Y coordinate relative to the hero section

    // Randomize emoji that pops up
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

    // Increment click count
    setClickCount((prev) => prev + 1);

    // Show text box after 10 clicks
    if (clickCount + 1 == 10) {
      setShowTextBox(true);
    }
  };

  // Handle user sign-in and insert user data
  const handleSignIn = async () => {
    if (isSignedIn && user) {
      try {
        const insertedData = await insertUser({
          id: user.id,
          first_name: user.firstName || "Unknown", // Fallback if firstName is null
          last_name: user.lastName || "Unknown", // Fallback if lastName is null
        });
  
        // Log the data that was inserted into Supabase
        console.log("Data inserted into Supabase:", insertedData);
  
        router.push("/appPage"); // Redirect to appPage after sign-in
      } catch (error) {
        console.error("Failed to insert user:", error);
      }
    }
  };

  // Close text box
  const handleCloseTextBox = () => {
    setShowTextBox(false);
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
                src={`/emojis/Wayfeel_Emojis-0${emoji.index}.png`}
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
          <SignInButton mode="modal">
            <Button
              className="bg-white text-blue-500 font-bold px-8 py-4 rounded-lg shadow hover:bg-gray-100 z-20 select-none"
              onClick={handleSignIn}
            >
              Sign In
            </Button>
          </SignInButton>
        </motion.div>
      </section>

      {/* Easter Egg */}
      <AnimatePresence>
        {showTextBox && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-4 right-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6 rounded-lg shadow-lg max-w-sm z-50"
          >
            <button
              onClick={handleCloseTextBox}
              className="absolute top-2 left-2 text-white hover:text-gray-200"
            >
              &#x2715; 
            </button>
            <p className="text-sm">
              We chose to use potatoes for our icons because, deep down inside, we are all couch potatoes. 🥔
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;