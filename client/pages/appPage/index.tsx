import React, { useState, useEffect, useRef } from "react";
import { initMap } from "../api/mapUtils"; // Import initMap from mapUtils
import { Calendar, momentLocalizer } from "react-big-calendar";
import Sidebar from "../../Components/sidebar";
import moment from "moment";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Localizer for react-big-calendar
const localizer = momentLocalizer(moment);

const Index = () => {
  const [activeItem, setActiveItem] = useState("home");
  const [currentDate, setCurrentDate] = useState(new Date());
  const googleMapsRef = useRef<google.maps.Map | null>(null);
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const [mapInitialized, setMapInitialized] = useState(false);
  const [mapScriptLoaded, setMapScriptLoaded] = useState(false);


  // Date range state
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showDateModal, setShowDateModal] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<Date | null>(null);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(null);

  // Potato toggle
  const [showPinTogglesModal, setShowPinTogglesModal] = useState(false);
  const [selectedPotatoes, setSelectedPotatoes] = useState<number[]>([1, 2, 3, 4, 5]); // All potatoes selected by default
  const [showAnonymous, setShowAnonymous] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        router.push("/"); 
      } else {
        setIsLoading(false); 
      }
    }
  }, [isLoaded, isSignedIn, router]);

  const initializeMap = () => {
    if (user && window.google && window.google.maps) {
      //clear prev map
      const mapElement = document.getElementById("map");
      if (mapElement) mapElement.innerHTML = "";
      
      //init new map
      googleMapsRef.current = new window.google.maps.Map(
        document.getElementById("map") as HTMLElement,
        {
          zoom: 8,
          center: { lat: 37.7749, lng: -122.4194 }, // Example: San Francisco
        }
      );
      // Call initMap from mapUtils once the map is initialized
      initMap("map", isSignedIn, user, startDate || undefined, endDate || undefined, selectedPotatoes, showAnonymous);// Pass correct parameters based on your app's logic
      setMapInitialized(true);
    }
  };

  const loadGoogleMapsScript = () => {
    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps) {
      initializeMap();
    } else {
      // Load the Google Maps script if not already loaded
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAP_API_KEY}&callback=initializeMap`;
      script.async = true;
      script.defer = true;

      // Make initializeMap globally accessible
      window.initializeMap = initializeMap;

      script.onload = () => {
        window.initializeMap = initializeMap;
        setMapScriptLoaded(true);
      };

      document.head.appendChild(script);
    }
  };

  useEffect(() => {
    if (mapInitialized && user) {
      // Clear previous map
      const mapElement = document.getElementById("map");
      if (mapElement) mapElement.innerHTML = "";
      
      // Reinitialize with new dates
      initMap("map", isSignedIn, user, startDate || undefined, endDate || undefined, selectedPotatoes, showAnonymous);
    }
  }, [selectedPotatoes, showAnonymous, startDate, endDate, mapInitialized, user, isSignedIn]);

  useEffect(() => {
    if (isLoaded) {
      loadGoogleMapsScript();
    }
  }, [isLoaded]);

  // start & end date filters
  // const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const selectedStartDate = e.target.valueAsDate;
  //   if (endDate && selectedStartDate && selectedStartDate > endDate) {
  //     alert("Start date cannot be after end date");
  //     return;
  //   }
  //   setStartDate(selectedStartDate);
  // };
  
  // const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const selectedEndDate = e.target.valueAsDate;
  //   if (startDate && selectedEndDate && selectedEndDate < startDate) {
  //     alert("End date cannot be before start date");
  //     return;
  //   }
  //   setEndDate(selectedEndDate);
  // };

  const applyDateRange = () => {
    if (tempStartDate && tempEndDate && tempStartDate > tempEndDate) {
      alert("Start date cannot be after end date");
      return;
    }
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    setShowDateModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-gray-800 text-white fixed w-full z-10"></nav>

      {/* Page Layout */}
      <div className="flex pt-14">
        {/* Sidebar */}
        <div className="w-1/6 fixed top-16 left-0 p-4">
          <Sidebar activeItem={activeItem} onSetActiveItem={setActiveItem} />
        </div>
        {/* Content Area */}
        <main className="flex flex-1 ml-[5%] space-x-[3%] space-y-[2%]">
          <section className="w-[25%] p-4">
            <div style={{ height: "470px" }}>AI location recommendation goes here</div>
            <Calendar
              localizer={localizer}
              startAccessor="start"
              endAccessor="end"
              date={currentDate}
              onNavigate={(date) => setCurrentDate(date)}
              style={{ height: "310px", width: "100%" }}
              className="shadow-lg rounded-lg bg-white p-4"
              toolbar={false}
            />
          </section>

          <section className="w-[65%] p-4"> 

          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Pin Toggles Button - now first */}
              <button 
                onClick={() => setShowPinTogglesModal(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                Pin Toggles
              </button>

              {/* Time Range Button */}
              <button 
                onClick={() => {
                  setTempStartDate(startDate);
                  setTempEndDate(endDate);
                  setShowDateModal(true);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Time Range
                {(startDate || endDate) && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()}
                  </span>
                )}
              </button>
            </div>
          </div>        

          
          {/* Date modal */}
          {showDateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-medium mb-4">Select Time Range</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded"
                      value={tempStartDate?.toISOString().split('T')[0] || ''}
                      onChange={(e) => setTempStartDate(e.target.valueAsDate)}
                      max={tempEndDate?.toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">End Date</label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded"
                      value={tempEndDate?.toISOString().split('T')[0] || ''}
                      onChange={(e) => setTempEndDate(e.target.valueAsDate)}
                      min={tempStartDate?.toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowDateModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={applyDateRange}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Pin Toggles Modal */}
          {showPinTogglesModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-medium mb-4">Filter Pins</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Potato Types</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3, 4, 5].map((potatoId) => (
                        <label key={potatoId} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedPotatoes.includes(potatoId)}
                            onChange={() => {
                              if (selectedPotatoes.includes(potatoId)) {
                                setSelectedPotatoes(selectedPotatoes.filter(id => id !== potatoId));
                              } else {
                                setSelectedPotatoes([...selectedPotatoes, potatoId]);
                              }
                            }}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">
                            {potatoId === 1 ? 'Sad' : 
                            potatoId === 2 ? 'Angry' :
                            potatoId === 3 ? 'Meh' :
                            potatoId === 4 ? 'Happy' : 'Excited'}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-200">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={showAnonymous}
                        onChange={() => setShowAnonymous(!showAnonymous)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Show Anonymous Pins</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowPinTogglesModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowPinTogglesModal(false);
                      // Trigger map refresh with new filters
                      initializeMap();
                    }}
                    className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}

          <div
            id="map"
            style={{ height: "745px", width: "100%" }}
            className="rounded-lg shadow-lg mb-4">
          </div>
        </section>
      </main>
    </div>
  </div>
  );
};

export default Index;
