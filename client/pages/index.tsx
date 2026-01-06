import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import Image from "next/image";
import useGoogleMapsLoader from "@/hooks/useGoogleMapsLoader";

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
  const [showMapPopup, setShowMapPopup] = useState(false); // control visibility of map popup
  const [showEmojiPopup, setShowEmojiPopup] = useState(false); // control visibility of emoji popup
  const [mapHeight, setMapHeight] = useState<number>(500);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  
  // Load Google Maps
  const mapsLoaded = useGoogleMapsLoader(process.env.NEXT_PUBLIC_MAP_API_KEY);

  // Initialize map
  useEffect(() => {
    if (mapsLoaded && mapContainerRef.current && !mapRef.current && window.google?.maps) {
      mapRef.current = new window.google.maps.Map(
        mapContainerRef.current,
        {
          center: { lat: 40.6782, lng: -73.9442 },
          zoom: 10,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        }
      );

      // Add click listener to map
      mapRef.current.addListener('click', () => {
        setShowMapPopup(true);
      });
    }
  }, [mapsLoaded]);

  // Update map height based on container width
  useEffect(() => {
    const updateMapSize = () => {
      if (mapContainerRef.current) {
        const width = mapContainerRef.current.offsetWidth;
        setMapHeight(width * 0.75);
      }
    };
    
    updateMapSize();
    window.addEventListener('resize', updateMapSize);
    return () => window.removeEventListener('resize', updateMapSize);
  }, []);

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

  // Handle emoji click - show popup to join Wayfeel
  const handleEmojiClick = (index: number) => {
    setShowEmojiPopup(true);
    
    // Increment click count
    setClickCount((prev) => prev + 1);

    // Show text box after 10 clicks
    if (clickCount + 1 === 10) {
      setShowTextBox(true);
    }
  };

  // Handle user sign-in and insert user data
  const handleSignIn = async () => {
    if (isSignedIn && user) {
      try {
        // Send user id in the query string for GET request
        const userExistsCheck = await fetch(`/api/getUser?id=${user.id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },  // This header is not strictly necessary for GET
        });
  
        if (userExistsCheck.ok) {
          // If user exists, redirect to the app page
          router.push('/appPage');
          return;  // Early exit if user exists
        }
  
        // If user doesn't exist, insert the user with a POST request
        const response = await fetch('/api/insertUser', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: user.id,
            first_name: user.firstName || 'Unknown',
            last_name: user.lastName || 'Unknown',
          }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          console.log(errorData)
          throw new Error(errorData.error || 'Failed to insert user');
        }
  
        const data = await response.json();
        console.log('User inserted successfully:', data);
  
        // Redirect after success
        router.push('/appPage');  
      } catch (error) {
        console.error('Failed to handle sign-in:', error);
        // Optionally, you could show a user-friendly message here (e.g., using a toast notification)
      }
    }
  };
  


  // Close text box
  const handleCloseTextBox = () => {
    setShowTextBox(false);
  };

  // Close map popup
  const handleCloseMapPopup = () => {
    setShowMapPopup(false);
  };

  // Close emoji popup
  const handleCloseEmojiPopup = () => {
    setShowEmojiPopup(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-teal-400">
      <div className="container mx-auto px-8 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Logo and Sign In */}
          <div className="flex flex-col items-center justify-center text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="max-w-md flex flex-col items-center"
            >
              {/* Logo Image */}
              <motion.div
                initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
                animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
                transition={{ duration: 2, delay: 0.5 }}
                style={{ overflow: "hidden" }}
              >
                <Image
                  src="/images/Wayfeel_Logo_WHT-03.png"
                  alt="WayFeel Logo"
                  width={384} 
                  height={0} 
                  className="w-96 mb-4 select-none"
                  draggable="false"
                  priority
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
                  className="bg-white text-blue-500 font-bold px-8 py-4 rounded-lg shadow hover:bg-gray-100 select-none"
                  onClick={handleSignIn}
                >
                  Sign In
                </Button>
              </SignInButton>
            </motion.div>
          </div>

          {/* Right Column - Map and Emojis */}
          <div className="flex flex-col">
            {/* Map */}
            <div className="w-full mb-6 rounded-lg shadow-lg overflow-hidden bg-white relative">
              {!mapsLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500 z-10">
                  Loading map...
                </div>
              )}
              <div
                ref={mapContainerRef}
                id="map"
                style={{ height: `${mapHeight}px`, width: '100%' }}
                className="w-full"
              />
            </div>

            {/* Emojis Display Below Map */}
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
              <div className="grid grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEmojiClick(index)}
                    className="cursor-pointer transition-transform"
                  >
                    <Image
                      src={`/emojis/Wayfeel_Emojis-0${index}.png`}
                      alt={`Emoji ${index}`}
                      width={80}
                      height={80}
                      className="select-none"
                      draggable="false"
                    />
                  </motion.button>
                ))}
              </div>

              {/* Display Selected Emojis */}
              {emojis.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-white text-md font-semibold mb-3">Selected Emojis:</h4>
                  <div className="flex flex-wrap gap-3">
                    <AnimatePresence>
                      {emojis.map((emoji) => (
                        <motion.div
                          key={emoji.id}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Image
                            src={`/emojis/Wayfeel_Emojis-0${emoji.index}.png`}
                            alt="Emoji"
                            width={64}
                            height={64}
                            className="select-none"
                            draggable="false"
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Map Click Popup */}
      <AnimatePresence>
        {showMapPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleCloseMapPopup}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseMapPopup}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                &#x2715;
              </button>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Join Us to Try the Map
                </h2>
                <p className="text-gray-600 mb-6">
                  Sign in to explore the interactive map and share your emotions with the community.
                </p>
                <SignInButton mode="modal">
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-3 rounded-lg shadow"
                    onClick={handleSignIn}
                  >
                    Sign In
                  </Button>
                </SignInButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emoji Click Popup */}
      <AnimatePresence>
        {showEmojiPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleCloseEmojiPopup}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseEmojiPopup}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                &#x2715;
              </button>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Join Wayfeel
                </h2>
                <p className="text-gray-600 mb-6">
                  Sign in to start sharing your emotions and connecting with the community.
                </p>
                <SignInButton mode="modal">
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-3 rounded-lg shadow"
                    onClick={handleSignIn}
                  >
                    Sign In
                  </Button>
                </SignInButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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