import React, { useState, useEffect } from "react";
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
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [activeItem, setActiveItem] = useState("home");
  const { user } = useUser();
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
    if (user) {
      getMarkersCurrUserAnon(user.id).then((markers) => {
        if (!markers) return;

        console.log("markers:", markers);

        const formattedEvents = markers.map((marker) => {
          const start = moment.utc(marker.created_at).local().toDate();
          const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // +2 hours

          return {
            id: marker.id,
            start,
            end,
            title: marker.description || "",
            emojiId: marker.emoji_id,
            imageUrl: emojiMap[marker.emoji_id] || "/happy.svg",
          };
        });

        console.log(
          "Formatted Events:",
          formattedEvents.map((e) => ({
            id: e.id,
            title: e.title,
            start: e.start.toISOString(),
            end: e.end.toISOString(),
          }))
        );

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
      {/* Navbar */}
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

      {/* Sidebar */}
      <div className="w-1/6 fixed top-16 left-0 p-4 z-20 h-[calc(100vh-4rem)] overflow-hidden">
        <Sidebar activeItem={activeItem} onSetActiveItem={setActiveItem} />
      </div>

      {/* Calendar */}
      {isSignedIn ? (
        <div className="flex-1 flex justify-center items-center p-4 ml-[4.6%] z-30">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            date={currentDate}
            defaultDate={new Date()} // ⏱️ forces calendar to show today
            defaultView="week"
            views={["month", "week", "day"]}
            onNavigate={(date) => setCurrentDate(date)}
            onRangeChange={(range) => {
              if (Array.isArray(range)) {
                console.log("Visible range (month):", range.map((d) => d.toISOString()));
              } else {
                console.log("Visible range (week/day):", {
                  start: range.start.toISOString(),
                  end: range.end.toISOString(),
                });
              }
            }}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Event Details</h2>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-500 hover:text-gray-800 text-xl"
              >
                &times;
              </button>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <img src={selectedEvent.imageUrl} alt="emoji" className="w-6 h-6" />
              <span className="font-medium capitalize">
                {selectedEvent.imageUrl.split("/").pop()?.replace(".svg", "")}
              </span>
            </div>
            <p className="text-gray-700 whitespace-pre-line">{selectedEvent.title}</p>
            <p className="text-sm text-gray-500 mt-4">
              {moment(selectedEvent.start).format("MMMM D, YYYY h:mm A")} –{" "}
              {moment(selectedEvent.end).format("h:mm A")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
