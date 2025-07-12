import React, { useState, useEffect, useRef } from "react";
import { initMap } from "../api/mapUtils";
import { Calendar, momentLocalizer } from "react-big-calendar";
import Sidebar from "../../components/sidebar";
import moment from "moment";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

// 🔍 Helper to trace rendering of specific sections
const DebugRender = ({ label }: { label: string }) => {
  console.log(`[RENDER] ${label}`);
  return null;
};

function safelyClearMapElement() {
  if (typeof window !== "undefined") {
    const modal = document.getElementById("custom-potato-modal");
    if (modal) {
      const parent = modal.parentNode;
      if (parent && parent.contains(modal)) {
        try {
          parent.removeChild(modal);
          console.log("Removed existing modal safely");
        } catch (e) {
          console.warn("Modal removal failed:", e);
        }
      } else {
        console.log("Modal found but not attached to DOM");
      }
    }

    const mapElement = document.getElementById("map");
    if (mapElement) {
      console.log("Clearing map innerHTML");
      mapElement.innerHTML = "";
    }
  }
}


const Index = () => {
  const [activeItem, setActiveItem] = useState("home");
  const [currentDate, setCurrentDate] = useState(new Date());
  const googleMapsRef = useRef<google.maps.Map | null>(null);
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [mapScriptLoaded, setMapScriptLoaded] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  console.log("[RENDER] Index component");

  useEffect(() => {
    console.log("[EFFECT] isLoaded or isSignedIn changed");
    if (isLoaded) {
      if (!isSignedIn) {
        console.log("User not signed in → redirecting");
        router.push("/");
      } else {
        console.log("User signed in → setting loading to false");
        setIsLoading(false);
      }
    }
  }, [isLoaded, isSignedIn, router]);

  const initializeMap = () => {
    console.log("[CALL] initializeMap");
    if (user && window.google && window.google.maps) {
      safelyClearMapElement();
      googleMapsRef.current = new window.google.maps.Map(
        document.getElementById("map") as HTMLElement,
        {
          zoom: 8,
          center: { lat: 37.7749, lng: -122.4194 },
        }
      );
      console.log("Map initialized");
      initMap("map", isSignedIn, user, startDate || undefined, endDate || undefined);
      setMapInitialized(true);
    }
  };

  const loadGoogleMapsScript = () => {
    console.log("[CALL] loadGoogleMapsScript");
    if (window.google && window.google.maps) {
      console.log("Google Maps already loaded");
      initializeMap();
    } else {
      console.log("Injecting Google Maps script");
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAP_API_KEY}&callback=initializeMap`;
      script.async = true;
      script.defer = true;
      window.initializeMap = initializeMap;

      script.onload = () => {
        console.log("Google Maps script loaded");
        window.initializeMap = initializeMap;
        setMapScriptLoaded(true);
      };
      document.head.appendChild(script);
    }
  };

  useEffect(() => {
    if (mapInitialized && user) {
      console.log("[EFFECT] Reinitializing map due to date or init state change");
      // safelyClearMapElement();
      initMap("map", isSignedIn, user, startDate || undefined, endDate || undefined);
    }
  }, [mapInitialized, user, isSignedIn]);
  // [startDate, endDate, mapInitialized, user, isSignedIn])
  useEffect(() => {
    if (isLoaded) {
      console.log("[EFFECT] isLoaded → loading Google Maps script");
      loadGoogleMapsScript();
    }
  }, [isLoaded]);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedStartDate = e.target.valueAsDate;
    if (endDate && selectedStartDate && selectedStartDate > endDate) {
      alert("Start date cannot be after end date");
      return;
    }
    console.log("Start date changed:", selectedStartDate);
    setStartDate(selectedStartDate);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedEndDate = e.target.valueAsDate;
    if (startDate && selectedEndDate && selectedEndDate < startDate) {
      alert("End date cannot be before start date");
      return;
    }
    console.log("End date changed:", selectedEndDate);
    setEndDate(selectedEndDate);
  };

  return (
    <>
      {isLoading ? (
        <>
          <DebugRender label="Loading screen" />
          <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="text-center">
              <div className="loader mb-4"></div>
              <p className="text-xl font-medium">Loading, please wait...</p>
            </div>
          </div>
        </>
      ) : (
        <div className="min-h-screen bg-gray-100">
          <DebugRender label="Main layout" />
          <nav className="bg-gray-800 text-white fixed w-full z-10"></nav>

          <div className="flex pt-14">
            <div className="w-1/6 fixed top-16 left-0 p-4">
              <DebugRender label="Sidebar" />
              <Sidebar activeItem={activeItem} onSetActiveItem={setActiveItem} />
            </div>

            <main className="flex flex-1 ml-[5%] space-x-[3%] space-y-[2%]">
              <section className="w-[25%] p-4">
                <DebugRender label="Left Panel with Calendar" />
                <div style={{ height: "470px" }}>AI location recommendation goes here</div>
                <Calendar
                  localizer={localizer}
                  startAccessor="start"
                  endAccessor="end"
                  date={currentDate}
                  onNavigate={(date) => {
                    console.log("Calendar navigated to:", date);
                    setCurrentDate(date);
                  }}
                  style={{ height: "310px", width: "100%" }}
                  className="shadow-lg rounded-lg bg-white p-4"
                  toolbar={false}
                />
              </section>

              <section className="w-[65%] p-4">
                <DebugRender label="Map Section" />
                <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded"
                      onChange={handleStartDateChange}
                      max={endDate?.toISOString().split('T')[0]}
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

                {!mapScriptLoaded ? (
                  <>
                    <DebugRender label="Map Placeholder (script not loaded)" />
                    <div
                      id="map"
                      style={{ height: "745px", width: "100%" }}
                      className="rounded-lg shadow-lg mb-4"
                    >
                      <p>Loading map...</p>
                    </div>
                  </>
                ) : (
                  <>
                    <DebugRender label="Map Container (script loaded)" />
                    <div
                      id="map"
                      style={{ height: "745px", width: "100%" }}
                      className="rounded-lg shadow-lg mb-4"
                    />
                  </>
                )}
              </section>
            </main>
          </div>
        </div>
      )}
    </>
  );
};

export default Index;
