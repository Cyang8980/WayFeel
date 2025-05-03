import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useUser, SignInButton } from "@clerk/nextjs";
import { CustomUserButton } from "Components/CustomUserButton";
import Sidebar from "@/Components/sidebar";
import { getMarkersCurrUserAnon } from "../api/getMarkers";


const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const { isSignedIn } = useUser();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [activeItem, setActiveItem] = useState("home");
  const { user } = useUser();
  const emojiMap: { [key: number]: string } = {
    1: '/sad.svg',
    2: '/angry.svg',
    3: '/meh.svg',
    4: '/happy.svg',
    5: '/excited.svg',
  };

  useEffect(() => {
    if (user) {
      getMarkersCurrUserAnon(user.id).then((markers) => {
        if (!markers) return;

        const formattedEvents = markers.map((marker) => ({
          id: marker.id,
          start: new Date(marker.created_at),
          end: new Date(marker.created_at),
          allDay: false,
          emojiId: marker.emoji_id,
          imageUrl: emojiMap[marker.emoji_id] || '/happy.svg',
        }));

        setEvents(formattedEvents);
      });
    }
  }, [user]);

  // Custom event component to display potato emojis and name
  const CustomEvent = ({ event }: any) => {
    const name = event.imageUrl
      ?.split('/')
      .pop()
      ?.replace('.svg', '')
      ?.replace(/^\w/, (c: string) => c.toUpperCase()); // Capitalize name

    return (
      <div className="flex items-center gap-2" style={{ padding: '2px 8px', height: '100%' }}>
        <img src={event.imageUrl} alt={name} style={{ width: 30, height: 30 }} />
        <span>{name}</span>
      </div>
    );
  };

  // Custom event styling to prevent squishing in week/day views
  const eventStyleGetter = (event: any, start: Date, end: Date, isSelected: boolean) => {
    const backgroundColor = "#3182CE"; // Blue color for events
    const style = {
      backgroundColor,
      borderRadius: "5px",
      opacity: 0.8,
      color: "white",
      border: "none",
      display: "block",
      padding: "5px",
      height: "auto", // Ensure event content isn't squished
    };
    return { style };
  };

  return (
    <div className="h-screen flex flex-col">
      <nav className="bg-gray-800 text-white fixed w-full z-10 flex justify-between items-center px-4 py-3">
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

      <div className="w-1/6 fixed top-16 left-0 p-4">
        <Sidebar activeItem={activeItem} onSetActiveItem={setActiveItem} />
      </div>

      {isSignedIn ? (
        <div className="flex-1 flex justify-center items-center p-4">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            date={currentDate}
            onNavigate={(date) => setCurrentDate(date)}
            style={{ height: "90vh", width: "90vw" }}
            className="shadow-lg rounded-lg bg-white p-4"
            eventPropGetter={eventStyleGetter}
            views={["month", "week", "day"]}
            defaultView="week"
            components={{
              event: CustomEvent, // 🎉 This adds the image!
            }}
          />
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <p className="text-xl font-semibold">Please sign in to view the calendar.</p>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
