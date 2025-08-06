import React, { useState, useEffect, useRef } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useUser, useAuth, SignInButton } from "@clerk/nextjs";
import { CustomUserButton } from "@/components/CustomUserButton";
import Sidebar from "@/components/sidebar";
import { getMarkersCurrUserAnon } from "../api/getMarkers";

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const { isSignedIn } = useUser();
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [activeItem, setActiveItem] = useState("home");
  const { user } = useUser();
  const miniMapRef = useRef<HTMLDivElement>(null);
  const { getToken } = useAuth();

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

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (
        selectedEvent &&
        window.google &&
        miniMapRef.current &&
        selectedEvent.latitude &&
        selectedEvent.longitude
      ) {
        console.log("Rendering mini map at", selectedEvent.latitude, selectedEvent.longitude);

        const map = new window.google.maps.Map(miniMapRef.current, {
          center: {
            lat: selectedEvent.latitude,
            lng: selectedEvent.longitude,
          },
          zoom: 15,
          disableDefaultUI: true,
        });

        new window.google.maps.Circle({
          map,
          center: { lat: selectedEvent.latitude, lng: selectedEvent.longitude },
          radius: 50,
          strokeColor: "#3B82F6",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#3B82F6",
          fillOpacity: 0.2,
        });
      } else {
        console.warn("Mini map skipped — missing data or ref", {
          selectedEvent,
          miniMapMounted: !!miniMapRef.current,
          googleLoaded: !!window.google,
        });
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [selectedEvent]);

  useEffect(() => {
    if (user) {
      getMarkersCurrUserAnon(user.id).then((markers) => {
        if (!markers) return;

        const formattedEvents = markers.map((marker) => {
          const start = moment.utc(marker.created_at).local().toDate();
          const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

          return {
            id: marker.id,
            start,
            end,
            title: marker.description || "",
            emojiId: marker.emoji_id,
            imageUrl: emojiMap[marker.emoji_id] || "/happy.svg",

            // Include coordinates (ensure your backend returns these)
            latitude: marker.latitude || 37.7749, // fallback for testing
            longitude: marker.longitude || -122.4194,
          };
        });

        setEvents(formattedEvents);
      });
    }
  }, [user]);

  const CustomEvent = ({ event }: any) => {
    const name = event.imageUrl
      ?.split("/")
      .pop()
      ?.replace(".svg", "")
      ?.replace(/^\w/, (c: string) => c.toUpperCase());

    return (
      <div className="flex items-center gap-2 px-2 py-1 h-full overflow-hidden">
        <img src={event.imageUrl} alt={name} style={{ width: 24, height: 24 }} />
        <span className="truncate text-sm">{event.title?.split(" ").slice(0, 5).join(" ") || "No description"}</span>
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

  return (
    <div className="h-screen flex flex-col">
      <nav className="bg-gray-800 text-white fixed w-full z-50 flex justify-between items-center px-4 py-3">
        <h1 className="text-xl font-bold">Wayfeel</h1>
        <div>
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
            events={events}
            startAccessor="start"
            endAccessor="end"
            date={currentDate}
            defaultView="week"
            views={["month", "week", "day"]}
            onNavigate={(date) => setCurrentDate(date)}
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="relative w-[90%] max-w-4xl bg-blue-100 rounded-3xl shadow-2xl p-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-6 text-3xl text-gray-600 hover:text-black"
            >
              &times;
            </button>

            <div className="flex-shrink-0">
              <img
                src={selectedEvent.imageUrl}
                alt="emoji"
                className="w-36 h-36 md:w-48 md:h-48 object-contain"
              />
            </div>

            <div className="flex-1 w-full max-w-lg">
              <div className="bg-white rounded-2xl p-4 shadow-md text-gray-800 mb-3">
                <h3 className="text-lg font-semibold mb-1">I felt great today!</h3>
                <p className="text-sm whitespace-pre-wrap">{selectedEvent.title}</p>
              </div>

              <div className="text-sm text-gray-500 mb-2">
                {moment(selectedEvent.start).format("MM/DD/YY")} —{" "}
                {moment(selectedEvent.start).format("h:mm A")}
              </div>

              <div className="flex gap-2 mt-3">
                {[1, 2, 3, 4, 5].map((id) => (
                  <img
                    key={id}
                    src={emojiMap[id]}
                    alt={`mood-${id}`}
                    className={`w-7 h-7 ${id === selectedEvent.emojiId ? "scale-110" : "opacity-40"}`}
                  />
                ))}
              </div>
            </div>

            <div className="hidden md:block w-40 h-40 rounded-xl overflow-hidden border-2 border-gray-300">
              <div ref={miniMapRef} id="mini-map" className="w-full h-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;