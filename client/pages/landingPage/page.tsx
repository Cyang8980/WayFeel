"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import GoogleMap from "@/components/googleMap";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="p-6 flex justify-between items-center bg-gradient-to-r from-blue-500 to-green-300 shadow-lg">
        <div className="text-3xl font-bold text-white">WayFeel</div>
        <nav className="space-x-6">
          <a href="#features" className="text-white hover:underline">
            Features
          </a>
          <a href="#about" className="text-white hover:underline">
            About
          </a>
          <a href="#contact" className="text-white hover:underline">
            Contact
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center p-12">
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl p-10 bg-purple-600 text-white rounded-xl shadow-lg"
        >
          <h1 className="text-4xl font-bold mb-6">
            Welcome to your emotional diary, mapped and validated
          </h1>
          <p className="text-lg mb-8">
            Forget feeling lost, overwhelmed, or alone—use WayFeel to
            anonymously share your emotions on a map, track your feelings over
            time, and connect with a compassionate community.
          </p>
          <Button className="bg-white text-purple-600 font-bold px-6 py-3 rounded-lg shadow hover:bg-gray-100">
            Join Beta
          </Button>
        </motion.div>
      </section>

      {/* Log Your Emotions Section */}
      <section className="py-12 bg-white text-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 px-6">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-6">Log Your Emotions—Anywhere, Anytime.</h2>
            <p>
              Your feelings matter. With WayFeel’s interactive map, drop an
              emoji to log your emotions—whether you’re at home, work, or out
              exploring.
            </p>
            <ul className="list-disc list-inside space-y-2 my-4 pl-6">
              <li>Express freely: Share emotions without judgment.</li>
              <li>Find validation: Get support from a caring community.</li>
              <li>Create a living diary: Build your emotional journey.</li>
            </ul>
            <p>It’s more than a map—it’s a safe space to be yourself.</p>
          </div>
          <div className="flex-1">
            <GoogleMap />
          </div>
        </div>
      </section>

      {/* Emotional Tracking Section */}
      <section className="pt-20 bg-blue-300 text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-9">
            <div>
              <h2 className="text-4xl font-bold mb-4 text-left col-start-1">Start tracking to understand yourself</h2>
              <p className="text-lg mb-8 text-left col-start-1">You have an idea of what affects your emotions, but there’s nothing better than visualizing it to confirm your suspicions.</p>

            </div>
            <div className="col-start-2">
              <h3 className="font-bold text-xl text-left ">Anonymity Meets Support</h3>
              <p className="text-left">Share your feelings without fear of judgment. Your privacy is our priority.</p>
              <div className="pt-7">
                <h3 className="font-bold text-xl text-left">Visual Map</h3>
                <p className="text-left">Spot patterns, celebrate growth, and better understand your emotional landscape.</p>
              </div>
            </div>
            <div className="col-start-3">
              <h3 className="font-bold text-xl text-left">Connect with Others Who Get It</h3>
              <p className="text-left">See how others feel in the same places, creating a sense of belonging and shared understanding.</p>
              <div className="pt-7">
                <h3 className="font-bold text-xl text-left">Emotion Calendar</h3>
                <p className="text-left">Track your patterns over time.</p>
              </div>
            </div>
            
          </div>
        </div>
        
      </section>
    

      {/* Emotional Journey Section */}
      <section className="py-12 bg-white text-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 px-6">
          <img src="/potato.png" alt="Smiley Face" className="w-64 h-64 mr-6" />
          <div className="flex-1">
            <h2 className="text-4xl font-bold mb-6">See Your Emotional Journey — At a Glance.</h2>
            <ul className="list-disc space-y-2 my-4 pl-10 list-outside
">
              <li>Spot patterns: Notice how certain places or times affect your mood.</li>
              <li>Celebrate growth: See how far you’ve come in managing your emotions.</li>
              <li>Make better decisions: Use your emotional history to plan happier, healthier days.</li>
            </ul>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <img src= "/calendar.png" alt="Emotion Calendar" className="w-86 h-86" />
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="py-12 bg-blue-300 text-white text-center">
        <h2 className="text-4xl font-bold mb-6">See What Others Are Saying About Their Emotional Journey.</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <p>"WayFeel helped me understand why certain places make me anxious. Now I can plan my days better!" – Future User</p>
          <p>"I love how anonymous and supportive the community is. It’s like having a diary that talks back!" – Future User</p>
          <p>"Tracking my emotions over time has been a game-changer for my mental health." – Future User</p>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-12 bg-gray-400 text-center">
        <h1 className="text-3xl font-bold mb-4 p-10 text-white">
          <p>Ready to Map Your Emotions and</p>
          <p>Find a Community who</p>
          <p>Understands you?</p>
        </h1>
        <Button className="bg-white text-red font-bold px-8 py-4 rounded-lg shadow hover:bg-blue-600">Join WayFeel Now</Button>
      </section>

      {/*Founder Note */}
      <section className="text-center item-center">
        <div className="flex-1 flex justify-center items-center pt-10 pb-10">
          <img src="/note.png" alt="Note" className="items-center text-center w-100 h-100" />
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
