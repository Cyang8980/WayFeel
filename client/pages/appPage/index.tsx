// import React, { useState, useEffect } from "react";
import React, { useState, useEffect, useRef } from "react";
import { initMap } from "../api/mapUtils"; // Import initMap from mapUtils
import { Calendar, momentLocalizer } from "react-big-calendar";
import Sidebar from "../../components/sidebar";
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
  // const { isLoaded, isSignedIn } = useUser();
  const { isLoaded, isSignedIn, user } = useUser();

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const [mapInitialized, setMapInitialized] = useState(false);
  const [mapScriptLoaded, setMapScriptLoaded] = useState(false);

  // adding start & end date filters
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

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
      initMap("map", isSignedIn, user, startDate || undefined, endDate || undefined);// Pass correct parameters based on your app's logic
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
      initMap("map", isSignedIn, user, startDate || undefined, endDate || undefined);
    }
  }, [startDate, endDate, mapInitialized, user, isSignedIn]);

  useEffect(() => {
    if (isLoaded) {
      loadGoogleMapsScript();
    }
  }, [isLoaded]);

  // start & end date filters
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedStartDate = e.target.valueAsDate;
    if (endDate && selectedStartDate && selectedStartDate > endDate) {
      alert("Start date cannot be after end date");
      return;
    }
    setStartDate(selectedStartDate);
  };
  
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedEndDate = e.target.valueAsDate;
    if (startDate && selectedEndDate && selectedEndDate < startDate) {
      alert("End date cannot be before start date");
      return;
    }
    setEndDate(selectedEndDate);
  };

  return (
    <>
     {isLoading ? (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="loader mb-4"></div> {/* Optional custom spinner */}
          <p className="text-xl font-medium">Loading, please wait...</p>
        </div>
      </div>
    ) : (
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

            {/* filter buttons */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  onChange={handleStartDateChange}
                  max={endDate?.toISOString().split('T')[0]} // Can't go beyond end date
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  onChange={handleEndDateChange}
                  min={startDate?.toISOString().split('T')[0]} 
                />
              </div>
            </div>
           <>
            {!mapScriptLoaded ? (
              <div
                id="map"
                style={{ height: "745px", width: "100%" }}
                className="rounded-lg shadow-lg mb-4"
              >
                <p>Loading map...</p>
              </div>
            ) : (
              <div
                id="map"
                style={{ height: "745px", width: "100%" }}
                className="rounded-lg shadow-lg mb-4"
              />
            )}
          </>
          </section>
        </main>
      </div>
    </div>
    )};
    </>
  );
};

export default Index;
