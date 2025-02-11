import React, { useState, useEffect, useRef } from "react";
import { initMap } from "./api/map";
import { Calendar, momentLocalizer } from "react-big-calendar";
import Sidebar from "../Components/sidebar";
import { MenuIcon, CloseIcon } from "../Components/icons";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useUser, useClerk } from "@clerk/nextjs";

// Types
type CalendarView = "month" | "week" | "day";

// Localizer for react-big-calendar
const localizer = momentLocalizer(moment);

// Props for CustomToolbar
interface CustomToolbarProps {
  currentView: CalendarView;
  onNavigate: (action: "PREV" | "TODAY" | "NEXT") => void;
  onView: (view: CalendarView) => void;
}

// CustomToolbar Component
const CustomToolbar: React.FC<CustomToolbarProps> = ({
  currentView,
  onNavigate,
  onView,
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <button
          onClick={() => onNavigate("PREV")}
          className="p-2 bg-gray-300 rounded mr-2"
        >
          Previous
        </button>
        <button
          onClick={() => onNavigate("TODAY")}
          className="p-2 bg-gray-300 rounded mr-2"
        >
          Today
        </button>
        <button
          onClick={() => onNavigate("NEXT")}
          className="p-2 bg-gray-300 rounded"
        >
          Next
        </button>
      </div>
      <div>
        <button
          onClick={() => onView("month")}
          aria-pressed={currentView === "month"}
          className={`p-2 rounded mr-2 ${
            currentView === "month" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
        >
          Month
        </button>
        <button
          onClick={() => onView("week")}
          aria-pressed={currentView === "week"}
          className={`p-2 rounded mr-2 ${
            currentView === "week" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
        >
          Week
        </button>
        <button
          onClick={() => onView("day")}
          aria-pressed={currentView === "day"}
          className={`p-2 rounded ${
            currentView === "day" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
        >
          Day
        </button>
      </div>
    </div>
  );
};

const Index = () => {
  const { isSignedIn } = useUser();
  const { signOut, redirectToSignIn } = useClerk();
  const [message, setMessage] = useState("Loading...");
  const [activeItem, setActiveItem] = useState("home");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<CalendarView>("month");
  const [currentDate, setCurrentDate] = useState(new Date());

  const googleMapsRef = useRef<google.maps.Map | null>(null);

  const loadGoogleMapsScript = () => {
    if (window.google && window.google.maps) {
      googleMapsRef.current = new window.google.maps.Map(
        document.getElementById("map") as HTMLElement,
        {
          center: { lat: 37.7749, lng: -122.4194 }, // Set default map center (example: San Francisco)
          zoom: 10,
        }
      );
      initMap();
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAP_API_KEY}&callback=initMap`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google && window.google.maps) {
          googleMapsRef.current = new window.google.maps.Map(
            document.getElementById("map") as HTMLElement,
            {
              center: { lat: 37.7749, lng: -122.4194 }, // Set default map center
              zoom: 10,
            }
          );
          initMap(); // Ensure this is only called once the script is loaded
        }
      };
      document.head.appendChild(script);

      // Define the initMap function globally so Google Maps can call it once the script is loaded
      window.initMap = () => {
        if (window.google && window.google.maps) {
          googleMapsRef.current = new window.google.maps.Map(
            document.getElementById("map") as HTMLElement,
            {
              center: { lat: 37.7749, lng: -122.4194 },
              zoom: 10,
            }
          );
          initMap();
        }
      };
    }
  };

  const handleNavigate = (action: "PREV" | "TODAY" | "NEXT") => {
    const offsetMap: Record<CalendarView, moment.DurationInputArg2> = {
      month: "months",
      week: "weeks",
      day: "days",
    };

    if (action === "TODAY") {
      setCurrentDate(new Date());
    } else {
      const offset = action === "PREV" ? -1 : 1;
      setCurrentDate(
        moment(currentDate).add(offset, offsetMap[currentView]).toDate()
      );
    }
  };

  useEffect(() => {
    loadGoogleMapsScript();

    fetch("/api/home")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setMessage(data.message);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const events = [
    {
      title: "Meeting",
      start: new Date(2025, 0, 15, 10, 0),
      end: new Date(2025, 0, 15, 12, 0),
    },
    {
      title: "Lunch Break",
      start: new Date(2025, 0, 16, 13, 0),
      end: new Date(2025, 0, 16, 14, 0),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-800 text-white fixed w-full z-10">
        <div className="flex items-center px-4 py-3">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            aria-expanded={isSidebarOpen}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors mr-4"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
          
          <h1 className="text-xl font-bold">Wayfeel</h1>

          {/* Sign-in / Sign-out Button */}
          {!isSignedIn ? (
            <button
              onClick={() => redirectToSignIn()}
              className="ml-auto text-white bg-blue-600 p-2 rounded hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          ) : (
            <button
              onClick={() => signOut()} // Sign out using Clerk's signOut method
              className="ml-auto text-white bg-red-600 p-2 rounded hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          )}
        </div>
      </nav>

      <div className="flex pt-14">
        <Sidebar
          isOpen={isSidebarOpen}
          activeItem={activeItem}
          onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
          onSetActiveItem={setActiveItem}
        />

        <main className="flex-1 flex">
          <section className="w-1/4 p-4">
            <CustomToolbar
              onNavigate={handleNavigate}
              onView={(view: CalendarView) => setCurrentView(view)}
              currentView={currentView}
            />
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              date={currentDate}
              view={currentView}
              onNavigate={(date) => setCurrentDate(date)}
              onView={(view) => {
                if (view === "month" || view === "week" || view === "day") {
                  setCurrentView(view);
                }
              }}
              style={{ height: "500px", width: "100%" }}
              className="shadow-lg rounded-lg bg-white p-4"
              toolbar={false}
            />
          </section>

          <section className="w-3/4 p-4">
            <div
              id="map"
              style={{ height: "780px", width: "100%" }}
              className="rounded-lg shadow-lg mb-4"
            ></div>
            <div className="bg-white p-4 rounded-lg shadow">{message}</div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Index;
