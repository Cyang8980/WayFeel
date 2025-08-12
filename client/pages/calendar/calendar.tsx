import React, { useState, useEffect, useRef, useCallback } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useUser, useAuth, SignInButton } from "@clerk/nextjs";
import { CustomUserButton } from "@/components/CustomUserButton";
import Sidebar from "@/components/sidebar";
import { getMarkers } from "../api/getMarkers";
import EventModal from "@/components/EventModal";

const localizer = momentLocalizer(moment);

type RbcView = "month" | "week" | "day";

const CalendarPage = () => {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();

  // Calendar UI state
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [currentView, setCurrentView] = useState<RbcView>("week");

  // Data
  const [markerEvents, setMarkerEvents] = useState<any[]>([]);
  const [gcalEvents, setGcalEvents] = useState<any[]>([]);
  const [googleConnected, setGoogleConnected] = useState<boolean>(false);

  // Selection / modal
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Layout
  const [activeItem, setActiveItem] = useState("home");
  const miniMapRef = useRef<HTMLDivElement>(null);

  // Google Maps loader
  const [mapScriptLoaded, setMapScriptLoaded] = useState(false);

  const emojiMap: { [key: number]: string } = {
    1: "/sad.svg",
    2: "/angry.svg",
    3: "/meh.svg",
    4: "/happy.svg",
    5: "/excited.svg",
  };

  const emojiColorMap: { [key: number]: string } = {
    1: "#D4EFDF",
    2: "#FADBD8",
    3: "#FDEBD0",
    4: "#D6EAF8",
    5: "#FCF3CF",
  };

  // ---------- Helpers ----------
  function isoRangeForView(date: Date, view: RbcView) {
    const start = new Date(date);
    const end = new Date(date);

    if (view === "month") {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(end.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
    } else if (view === "week") {
      const day = start.getDay();
      const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Monday start
      start.setDate(diff);
      start.setHours(0, 0, 0, 0);
      end.setDate(diff + 6);
      end.setHours(23, 59, 59, 999);
    } else {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    }
    return { timeMin: start.toISOString(), timeMax: end.toISOString() };
  }

  const connectGoogle = useCallback(async () => {
    const res = await fetch("/api/google/auth-url");
    const { url } = await res.json();
    window.location.href = url;
  }, []);

  const loadGoogleEvents = useCallback(async (date: Date, view: RbcView) => {
    try {
      const { timeMin, timeMax } = isoRangeForView(date, view);
      const res = await fetch(`/api/google/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}`);
      if (res.status === 401) {
        setGoogleConnected(false);
        setGcalEvents([]);
        return;
      }
      const data = await res.json();
      setGoogleConnected(true);

      const mapped = (data.events || []).map((e: any) => ({
        id: `gcal:${e.id}`,
        start: new Date(e.start),
        end: new Date(e.end),
        title: e.title,
        // give GCAL events a neutral default look in your scheme
        emojiId: 4,
        imageUrl: "/happy.svg",
        latitude: null,
        longitude: null,
      }));
      setGcalEvents(mapped);
    } catch {
      setGoogleConnected(false);
      setGcalEvents([]);
    }
  }, []);

  // ---------- Effects ----------
  // Load Google Maps script
  useEffect(() => {
    if (typeof window !== "undefined" && !window.google?.maps) {
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        setMapScriptLoaded(true);
        return;
      }
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAP_API_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapScriptLoaded(true);
      document.head.appendChild(script);
    } else {
      setMapScriptLoaded(true);
    }
  }, []);

  // Render mini map for selected event (if it has lat/lng)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (
        selectedEvent &&
        mapScriptLoaded &&
        (window as any).google &&
        miniMapRef.current &&
        selectedEvent.latitude &&
        selectedEvent.longitude
      ) {
        miniMapRef.current.innerHTML = "";
        const map = new (window as any).google.maps.Map(miniMapRef.current, {
          center: { lat: selectedEvent.latitude, lng: selectedEvent.longitude },
          zoom: 15,
          disableDefaultUI: true,
        });
        new (window as any).google.maps.Circle({
          map,
          center: { lat: selectedEvent.latitude, lng: selectedEvent.longitude },
          radius: 50,
          strokeColor: "#3B82F6",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#3B82F6",
          fillOpacity: 0.2,
        });
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [selectedEvent, mapScriptLoaded]);

  // Load your markers
  useEffect(() => {
    if (!user) return;
    getMarkers({ user_id: user.id }).then((markers) => {
      if (!markers) return;
      const formatted = markers.map((marker: any) => {
        const start = moment.utc(marker.created_at).local().toDate();
        const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
        return {
          id: marker.id,
          start,
          end,
          title: marker.description || "",
          emojiId: marker.emoji_id,
          imageUrl: emojiMap[marker.emoji_id] || "/happy.svg",
          latitude: marker.latitude || 37.7749,
          longitude: marker.longitude || -122.4194,
        };
      });
      setMarkerEvents(formatted);
    });
  }, [user]);

  // Load Google events when date/view changes
  useEffect(() => {
    if (!isSignedIn) return;
    loadGoogleEvents(currentDate, currentView);
  }, [isSignedIn, currentDate, currentView, loadGoogleEvents]);

  // ---------- Rendering helpers ----------
  const CustomEvent = ({ event }: any) => {
    const name = event.imageUrl
      ?.split("/")
      .pop()
      ?.replace(".svg", "")
      ?.replace(/^\w/, (c: string) => c.toUpperCase());

    return (
      <div className="flex items-center gap-2 px-2 py-1 h-full overflow-hidden">
        {event.imageUrl && <img src={event.imageUrl} alt={name} style={{ width: 24, height: 24 }} />}
        <span className="truncate text-sm">
          {event.title?.split(" ").slice(0, 5).join(" ") || "No description"}
        </span>
      </div>
    );
  };

  const eventStyleGetter = (event: any) => {
    const backgroundColor = emojiColorMap[event.emojiId] || "#E8E8E8";
    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        opacity: 0.9,
        color: "#333",
        border: "none",
        display: "block",
        padding: "5px",
        height: "auto",
        fontSize: "0.85rem",
      },
    };
  };

  const allEvents = [...markerEvents, ...gcalEvents];

  return (
    <div className="h-screen flex flex-col">
      <nav className="bg-gray-800 text-white fixed w-full z-50 flex justify-between items-center px-4 py-3">
        <h1 className="text-xl font-bold">Wayfeel</h1>
        <div className="flex items-center gap-2">
          {isSignedIn && (
            <>
              {googleConnected ? (
                <span className="text-sm opacity-80">Google Calendar connected</span>
              ) : (
                <button
                  onClick={connectGoogle}
                  className="text-white bg-emerald-600 px-3 py-2 rounded hover:bg-emerald-700 transition-colors"
                >
                  Connect Google Calendar
                </button>
              )}
            </>
          )}
          {!isSignedIn ? (
            <SignInButton>
              <button className="text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                Sign In
              </button>
            </SignInButton>
          ) : (
            <CustomUserButton />
          )}
        </div>
      </nav>

      <div className="w-1/6 fixed top-16 left-0 p-4 z-20 h-[calc(100vh-4rem)] overflow-hidden">
        <Sidebar activeItem={activeItem} onSetActiveItem={setActiveItem} />
      </div>

      {isSignedIn ? (
        <div className="flex-1 flex justify-center items-center p-5 mt-8 ml-[4.6%] z-30">
          <Calendar
            localizer={localizer}
            events={allEvents}
            startAccessor="start"
            endAccessor="end"
            date={currentDate}
            defaultView="week"
            views={["month", "week", "day"]}
            onNavigate={(date) => setCurrentDate(date)}
            onView={(view) => setCurrentView(view as RbcView)}
            style={{ height: "90vh", width: "100%" }}
            eventPropGetter={eventStyleGetter}
            components={{ event: CustomEvent }}
            onSelectEvent={(event) => setSelectedEvent(event)}
          />
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <p className="text-xl font-semibold">Please sign in to view the calendar.</p>
        </div>
      )}

      {/* Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          emojiMap={emojiMap}
          mapScriptLoaded={mapScriptLoaded}
        />
      )}
    </div>
  );
};

export default CalendarPage;
