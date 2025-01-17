import React, { useState, useEffect } from "react";
import { initMap } from "./api/map";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

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

// Menu and Close Icon Components
const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const Index = () => {
  const [message, setMessage] = useState("Loading...");
  const [activeItem, setActiveItem] = useState("home");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<CalendarView>("month");
  const [currentDate, setCurrentDate] = useState(new Date());

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
    const loadGoogleMapsScript = () => {
      if (window.google && window.google.maps) {
        initMap();
      } else {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAP_API_KEY}&callback=initMap`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (window.google && window.google.maps) {
            initMap();
          }
        };
        document.head.appendChild(script);
      }
    };

    loadGoogleMapsScript();

    fetch("http://localhost:8080/api/home")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Error fetching data:", error));
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

  const menuItems = [
    { id: "home", label: "🏠 Home" },
    { id: "analytics", label: "📊 Analytics" },
    { id: "profile", label: "👤 Profile" },
    { id: "settings", label: "⚙️ Settings" },
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
        </div>
      </nav>

      <div className="flex pt-14">
        <aside
          className={`fixed inset-y-0 left-0 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } bg-gray-800 text-white w-64 transition-transform duration-300 ease-in-out z-20 mt-14`}
        >
          <nav className="p-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveItem(item.id);
                  setSidebarOpen(false);
                }}
                className={`flex items-center w-full p-3 mb-2 rounded-lg hover:bg-gray-700 transition-colors ${
                  activeItem === item.id ? "bg-gray-700" : ""
                }`}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

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
              style={{ height: "1000px", width: "150%" }}
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
