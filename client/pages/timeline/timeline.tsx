import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/stuff/sidebar";
import { useUser, SignInButton } from "@clerk/nextjs";
import { CustomUserButton } from "@/stuff/CustomUserButton";
import Image from "next/image";

const Timeline = () => {
  const [posts] = useState([
    {
      id: 1,
      title: "First Post",
      content: "This is my first post!",
      date: "2024-03-01",
    },
    {
      id: 2,
      title: "Learning Next.js",
      content: "Next.js is awesome!",
      date: "2024-03-05",
    },
    {
      id: 3,
      title: "Exploring Animations",
      content: "Framer Motion is really fun!",
      date: "2024-03-10",
    },
  ]);
  const [activeItem, setActiveItem] = useState("timeline");
  const { isSignedIn } = useUser();

  return (
    <div>
      <nav className="bg-gray-800 text-white fixed w-full z-10">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left Side (Brand + Ko-Fi Link) */}
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Wayfeel</h1>
            <a
              href="https://ko-fi.com/wayfeel"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/kofi_logo.svg" alt="Ko-fi" width={100} height={40} />
            </a>
          </div>
          {/* Right Side (Sign-in / UserButton) */}
          <div className="ml-auto">
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
        </div>
      </nav>
      {isSignedIn ? (
        <div className="max-w-2xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">History Timeline</h1>
          <div className="relative border-l-4 border-blue-500 pl-4">
            <div className="w-1/6 fixed top-16 left-0 p-4">
              <Sidebar
                activeItem={activeItem}
                onSetActiveItem={setActiveItem}
              />
            </div>
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <div className="bg-white p-4 shadow-lg rounded-lg">
                  <h2 className="text-lg font-semibold">{post.title}</h2>
                  <p className="text-gray-600 text-sm">{post.date}</p>
                  <p className="mt-2 text-gray-800">{post.content}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <p className="text-xl font-semibold">
            Please sign in to view the timeline.
          </p>
        </div>
      )}
    </div>
  );
};

export default Timeline;
