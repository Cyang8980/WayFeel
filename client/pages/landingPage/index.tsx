import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-white text-2xl font-bold">
          WayFeel
        </Link>
        
        {/* Navigation */}
        <nav className="flex items-center gap-6 text-white">
          <Link href="#features" className="hover:opacity-80 transition-opacity">
            Features
          </Link>
          <Link href="#about" className="hover:opacity-80 transition-opacity">
            About
          </Link>
          <Link href="#contact" className="hover:opacity-80 transition-opacity">
            Contact
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 min-h-[20vh] flex items-center justify-center px-6 py-20">
        {/* Hero Content Box */}
        <div className="max-w-4xl w-full">
          <div className="bg-purple-700 rounded-2xl p-12 text-center shadow-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Welcome to your emotional diary, mapped and validated
            </h1>
            <p className="text-white text-lg md:text-xl mb-8 leading-relaxed max-w-3xl mx-auto">
              Forget feeling lost, overwhelmed, or alone—use WayFeel to anonymously share your emotions on a map, track your feelings over time with a color-coded calendar, and connect with a compassionate community that validates and supports you.
            </p>
            <Button 
              size="lg" 
              className="bg-blue-400 hover:bg-blue-500 text-white text-lg px-8 py-6 rounded-xl font-semibold transition-colors"
            >
              Join beta
            </Button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-black leading-tight">
                Log Your Emotions— Anywhere, Anytime.
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Your feelings matter, and now there's a place to put them. With WayFeel's interactive map, you can drop an emoji to log how you're feeling—whether you're at home, work, or exploring somewhere new.
              </p>
              <ul className="space-y-4 text-lg text-gray-700">
                <li className="flex items-start">
                  <span className="text-black mr-3">•</span>
                  <span>Express freely: Share your emotions without judgment or pressure.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-3">•</span>
                  <span>Find validation: Get supportive reactions and comments from a community that cares.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-3">•</span>
                  <span>Create a living diary: Build a personal map of your emotional journey, one emoji at a time.</span>
                </li>
              </ul>
              <p className="text-lg text-gray-700 leading-relaxed">
                It's more than a map—it's a safe space to be yourself, wherever you are.
              </p>
            </div>

            {/* Right Column - Map Image */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl bg-gray-100 aspect-square">
                {/* Placeholder for map - you can replace this with an actual map image */}
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <div className="text-center p-8">
                    <p className="text-gray-600 text-lg mb-4">Interactive Map</p>
                    <div className="relative w-full h-64 bg-white rounded-lg overflow-hidden shadow-inner">
                      {/* Simple map representation */}
                      <svg viewBox="0 0 400 400" className="w-full h-full">
                        {/* Water (blue) */}
                        <path
                          d="M100 150 Q150 140 200 150 T300 150 L300 200 Q250 200 200 200 T100 200 Z"
                          fill="#93c5fd"
                        />
                        {/* Roads (gray) */}
                        <rect x="50" y="100" width="300" height="20" fill="#9ca3af" />
                        <rect x="50" y="180" width="300" height="20" fill="#9ca3af" />
                        <rect x="190" y="50" width="20" height="300" fill="#9ca3af" />
                        {/* Buildings (gray rectangles) */}
                        <rect x="70" y="130" width="40" height="40" fill="#d1d5db" />
                        <rect x="130" y="130" width="40" height="40" fill="#d1d5db" />
                        <rect x="230" y="130" width="40" height="40" fill="#d1d5db" />
                        <rect x="290" y="130" width="40" height="40" fill="#d1d5db" />
                        {/* Green spaces */}
                        <rect x="70" y="210" width="60" height="60" fill="#86efac" rx="5" />
                        <rect x="260" y="210" width="60" height="60" fill="#86efac" rx="5" />
                        {/* Dots (emotions) */}
                        <circle cx="90" cy="150" r="4" fill="white" />
                        <circle cx="150" cy="150" r="4" fill="white" />
                        <circle cx="250" cy="150" r="4" fill="white" />
                        <circle cx="90" cy="240" r="4" fill="white" />
                        <circle cx="250" cy="240" r="4" fill="white" />
                        <circle cx="200" cy="100" r="4" fill="white" />
                        <circle cx="200" cy="200" r="4" fill="white" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Start tracking to understand yourself */}
      <section id="features" className="bg-blue-100 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Heading */}
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                Start tracking to understand yourself
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                You have an idea of what affects your emotions, but there's nothing better than visualizing it to confirm your suspicions.
              </p>
            </div>

            {/* Right Column - Feature Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-800">
                  Anonymity Meets Support
                </h3>
                <p className="text-gray-700">
                  Share your feelings without fear of judgment. Your privacy is our priority.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-800">
                  Connect with Others Who Get It
                </h3>
                <p className="text-gray-700">
                  See how others feel in the same places, creating a sense of belonging and shared understanding.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-800">
                  Visual Map
                </h3>
                <p className="text-gray-700">
                  Spot patterns, celebrate growth, and better understand your emotional landscape.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-800">
                  Emotion Calendar
                </h3>
                <p className="text-gray-700">
                  Track your patterns over time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: See Your Emotional Journey */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            {/* Column 1 - Graphic */}
            <div className="flex items-center justify-center">
              <div className="relative">
                <Image src="/emojis/Wayfeel_Emojis-02.png" alt="Emoji" width={200} height={200} />
              </div>
            </div>

            {/* Column 2 - Heading and Bullet Points */}
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                See Your Emotional Journey—At A Glance.
              </h2>
              <ul className="space-y-4 text-lg text-gray-700">
                <li className="flex items-start">
                  <span className="text-black mr-3">•</span>
                  <span>Spot patterns: Notice how certain places or times affect your mood.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-3">•</span>
                  <span>Celebrate growth: See how far you've come in managing your emotions.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-3">•</span>
                  <span>Make better decisions: Use your emotional history to plan happier, healthier days.</span>
                </li>
              </ul>
            </div>

            {/* Column 3 - Calendar Widget */}
            <div className="flex items-center justify-center">
              <div className="bg-white border-2 border-gray-300 rounded-xl p-4 shadow-lg w-full max-w-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-gray-800">Jan</span>
                  <span className="text-gray-600">2021</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-xs text-center">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <div key={day} className="font-semibold text-gray-600 py-1">
                      {day}
                    </div>
                  ))}
                  {/* Empty cells for alignment (Jan 1, 2021 was a Friday, so 4 empty cells before) */}
                  {[...Array(4)].map((_, i) => (
                    <div key={`empty-${i}`} className="py-2"></div>
                  ))}
                  {/* Days 1-31 */}
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                    const coloredDays: Record<number, string> = {
                      4: 'bg-red-500',
                      5: 'bg-orange-500',
                      9: 'bg-blue-500',
                      17: 'bg-yellow-400',
                      22: 'bg-green-500',
                      23: 'bg-green-500',
                      24: 'bg-green-500',
                    };
                    return (
                      <div
                        key={day}
                        className={`py-2 text-gray-700 relative ${
                          coloredDays[day] ? '' : ''
                        }`}
                      >
                        {day}
                        {coloredDays[day] && (
                          <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full ${coloredDays[day]}`}></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Testimonials */}
      <section className="bg-blue-100 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-12">
            See What Others Are Saying About Their Emotional Journey.
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <p className="text-gray-700 mb-4">
                "WayFeel helped me understand why certain places make me anxious. Now I can plan my days better!"
              </p>
              <p className="text-gray-500 italic">— Future User</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <p className="text-gray-700 mb-4">
                "I love how anonymous and supportive the community is. It's like having a diary that talks back!"
              </p>
              <p className="text-gray-500 italic">— Future User</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <p className="text-gray-700 mb-4">
                "Tracking my emotions over time has been a game-changer for my mental health!"
              </p>
              <p className="text-gray-500 italic">— Future User</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: CTA */}
      <section className="bg-gray-500 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
            Ready to Map Your Emotions and Find a Community who Understands you?
          </h2>
          <Button
            size="lg"
            className="bg-blue-400 hover:bg-blue-500 text-white text-lg px-8 py-6 rounded-xl font-semibold transition-colors"
          >
            Join WayFeel. Now
          </Button>
        </div>
      </section>

      {/* Section 5: Founder memo */}
      <section id="about" className="bg-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Founder memo</h3>
          <div className="font-handwriting text-lg text-gray-700 leading-relaxed space-y-4" style={{ fontFamily: 'cursive, serif' }}>
            <p>
              At WayFeel, we know what it's like to feel lost, overwhelmed, and out of place.
            </p>
            <p>
              Life can be messy and sometimes it feels like there's no safe space to share how you're feeling.
            </p>
            <p>
              That's why we created WayFeel, a place where emotions are welcomed, validated, and understood.
            </p>
            <p>
              Our mission is simple: to give you a space, anonymous sense to share your feelings, find reassurance, and track your emotional journey over time.
            </p>
            <p>
              Everyone should be seen, heard, and valued.
            </p>
            <p>
              This is the beginning of our movement, to redefine how we connect with ourselves and each other.
            </p>
            <p>
              Because everyone deserves a place...
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

