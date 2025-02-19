"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"; // Ensure your shadcn/ui Button is set up correctly
import GoogleMap from "@/Components/googleMap";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-6 flex justify-between items-center bg-white shadow">
        <div className="text-3xl font-bold text-gray-800">WayFeel</div>
        <nav className="space-x-6">
          <a href="#features" className="text-gray-800 hover:underline">
            Features
          </a>
          <a href="#how-it-works" className="text-gray-800 hover:underline">
            How It Works
          </a>
          <a href="#testimonials" className="text-gray-800 hover:underline">
            Testimonials
          </a>
          <a href="#contact" className="text-gray-800 hover:underline">
            Contact
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-1 bg-gradient-to-r from-blue-500 to-teal-400 text-white flex flex-col items-center justify-center text-center p-12">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl font-bold mb-6">
            Welcome to your emotional diary, mapped and validated
          </h1>
          <p className="text-lg mb-8">
            Forget feeling lost, overwhelmed, or alone — use WayFeel to better
            understand your emotional journey. Our platform helps you record,
            visualize, and validate your feelings so you can see exactly where you
            stand.
          </p>
          <Button className="bg-white text-blue-500 font-bold px-8 py-4 rounded-lg shadow hover:bg-gray-100">
            Join Beta
          </Button>
        </motion.div>
      </section>

      {/* Features Section
      <section id="features" className="py-12 bg-gray-50 text-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-8">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="p-6 bg-white rounded-lg shadow hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-2xl font-bold mb-4">Mood Journaling</h3>
              <p>Log your emotions daily with an intuitive interface.</p>
            </motion.div>
            <motion.div
              className="p-6 bg-white rounded-lg shadow hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-2xl font-bold mb-4">Location Tracking</h3>
              <p>
                Connect your feelings to the places you visit and track patterns.
              </p>
            </motion.div>
            <motion.div
              className="p-6 bg-white rounded-lg shadow hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-2xl font-bold mb-4">Insights & Analytics</h3>
              <p>
                Visualize trends in your mood over time with beautiful charts.
              </p>
            </motion.div>
          </div>
        </div>
      </section> */}

      {/* Log your Emotions */}
      <section id="how-it-works" className="py-12 bg-white text-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 px-6">
          {/* Text Content */}
          <div className="flex-1">
            <h2 className="text-4xl font-bold mb-6">Log Your Emotions—Anywhere, Anytime.</h2>
            <div className="mb-4">
              <p>
              Your feelings matter, and now there’s a place to put them. With WayFeel’s interactive map, 
              you can drop an emoji to log how you’re feeling—whether you’re at home, work, 
              or exploring somewhere new.
              </p>
              
              <ul className="list-disc list-inside space-y-2 my-4">
                <li>Express freely: Share your emotions without judgment or pressure.</li>
                <li>Find validation: Get supportive reactions and comments from a community that cares.</li>
                <li>Create a living diary: Build a personal map of your emotional journey, one emoji at a time.</li>
              </ul>
              <p>It’s more than a map—it’s a safe space to be yourself, wherever you are.</p>
            </div>
            
            
            {/* <Button className="bg-blue-500 text-white font-bold px-8 py-4 rounded-lg shadow hover:bg-blue-600">
              Learn More
            </Button> */}
          </div>
          {/* Map Visualization */}
          <div className="flex-1">
            <GoogleMap />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-12 bg-gray-50 text-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-8">Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-white rounded-lg shadow">
              <p className="italic mb-4">
                "WayFeel has transformed the way I understand my emotions. It's like having a personal diary that also reveals patterns I never noticed!"
              </p>
              <p className="font-bold">— Alex D.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow">
              <p className="italic mb-4">
                "The insights and visualizations are amazing. I can finally see the connection between my moods and where I am. Highly recommended!"
              </p>
              <p className="font-bold">— Jamie L.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
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

      {/* Footer */}
      <footer className="p-6 bg-gray-800 text-center text-white">
        <p>&copy; {new Date().getFullYear()} WayFeel. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
