import React, { useState, useEffect, useRef } from "react";
import { ApiMarker, initMap, toWayfeelEvent } from "../api/mapUtils";
import { Calendar, momentLocalizer } from "react-big-calendar";
import Sidebar from "../../components/sidebar";
import moment from "moment";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EventList from "../../components/eventsComponent";
import EventModal from "@/components/EventModal";
import { WayfeelEvent } from "@/types/events"; // 👈 add this type

const localizer = momentLocalizer(moment);

type MarkerViewType = "all" | "personal" | "anon";
const markerViewOptions: { label: string; value: MarkerViewType }[] = [
  { label: "All", value: "all" },
  { label: "Personal", value: "personal" },
  { label: "Anon", value: "anon" },
];

function safelyClearMapElement() {
  if (typeof window !== "undefined") {
    const modal = document.getElementById("custom-potato-modal");
    if (modal?.parentNode?.contains(modal)) {
      try {
        console.trace("Calling removeChild on node:", modal);
        console.log("Removed existing modal safely");
      } catch (e) {
        console.warn("Modal removal failed:", e);
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
  const [selectedView, setSelectedView] = useState<MarkerViewType>("all");
  const { height: windowHeight } = useWindowSize();
  const calendarHeight = Math.max(windowHeight * 0.25, 250);
  const mapHeight = Math.max(windowHeight * 0.65, 400);

  // 👇 modal state typed to your modal's prop
  const [selectedMarker, setSelectedMarker] = useState<WayfeelEvent | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  function useWindowSize() {
    const [size, setSize] = useState({ width: 0, height: 0 });
    useEffect(() => {
      const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }, []);
    return size;
  }

  const handleViewChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedView(e.target.value as MarkerViewType);
  };

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        router.push("/");
      } else {
        setIsLoading(false);
      }
    }
  }, [isLoaded, isSignedIn, router]);

  // 👇 normalize backend marker → WayfeelEvent that the modal expects
  const handleMarkerClick = (m: ApiMarker) => {
    setSelectedMarker(toWayfeelEvent(m));
    setIsEventModalOpen(true);
  };

  const initializeMap = () => {
    const mapDiv = document.getElementById("map");
    if (!mapDiv) {
      console.error("Map div with id='map' not found");
      return;
    }
    if (user && window.google && window.google.maps) {
      googleMapsRef.current = new window.google.maps.Map(
        document.getElementById("map") as HTMLElement,
        { zoom: 8, center: { lat: 37.7749, lng: -122.4194 } }
      );
      initMap(
        "map",
        isSignedIn,
        user,
        startDate || undefined,
        endDate || undefined,
        selectedView,
        handleMarkerClick 
      );
      setMapInitialized(true);
    }
  };

  // Re-render markers when filters change
  useEffect(() => {
    if (mapInitialized && user) {
      safelyClearMapElement();
      initMap(
        "map",
        isSignedIn,
        user,
        startDate || undefined,
        endDate || undefined,
        selectedView,
        handleMarkerClick 
      );
    }
  }, [startDate, endDate, selectedView, mapInitialized, user, isSignedIn]);

  // Load Maps script
  const loadGoogleMapsScript = () => {
    if (window.google?.maps) {
      initializeMap();
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAP_API_KEY}&callback=initializeMap`;
    script.async = true;
    script.defer = true;
    window.initializeMap = initializeMap;
    script.onload = () => {
      window.initializeMap = initializeMap;
      setMapScriptLoaded(true);
    };
    document.head.appendChild(script);
  };

  useEffect(() => {
    if (isLoaded) {
      loadGoogleMapsScript();
    }
  }, [isLoaded]);

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
      alert("End date cannot be before end date");
      return;
    }
    setEndDate(selectedEndDate);
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="text-center">
            <div className="loader mb-4"></div>
            <p className="text-xl font-medium">Loading, please wait...</p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-[#f9f0f0]">
          <nav className="bg-gray-800 text-white fixed w-full z-10"></nav>

          {/* 👇 Open modal only when we have a marker */}
          {isEventModalOpen && selectedMarker && (
            <EventModal
              event={selectedMarker}
              onClose={() => setIsEventModalOpen(false)}
              mapScriptLoaded={mapScriptLoaded}
            />
          )}

          <div className="flex pt-14">
            <div className="w-1/6 fixed top-16 left-0 p-4">
              <Sidebar activeItem={activeItem} onSetActiveItem={setActiveItem} />
            </div>

            <main className="flex flex-col lg:flex-row flex-1 ml-0 lg:ml-[5%] gap-4 p-4">
              {/* Left Section */}
              <section className="w-full lg:w-1/3 xl:w-1/4 p-4">
                <div>
                  <Calendar
                    localizer={localizer}
                    startAccessor="start"
                    endAccessor="end"
                    date={currentDate}
                    onNavigate={(date) => setCurrentDate(date)}
                    style={{ height: `${calendarHeight}px`, width: "100%" }}
                    className="shadow-lg rounded-lg bg-white p-4"
                    toolbar={false}
                  />
                </div>
                <div>
                  <EventList />
                </div>
              </section>

              {/* Right Section */}
              <section className="w-full lg:w-2/3 xl:w-3/4 p-4">
                <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex flex-col md:flex-row gap-4 -mt-6">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">View</label>
                    <select className="w-full p-2 border rounded" value={selectedView} onChange={handleViewChange}>
                      {markerViewOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <input type="date" className="w-full p-2 border rounded" onChange={handleStartDateChange}
                           max={endDate?.toISOString().split("T")[0]} />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">End Date</label>
                    <input type="date" className="w-full p-2 border rounded" onChange={handleEndDateChange}
                           min={startDate?.toISOString().split("T")[0]} />
                  </div>
                </div>

                <div id="map" style={{ height: `${mapHeight}px`, width: "100%" }}
                     className="rounded-lg shadow-lg mb-4" />
              </section>
            </main>
          </div>
        </div>
      )}
    </>
  );
};

export default Index;

