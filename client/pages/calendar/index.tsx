import React, { useEffect, useMemo, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { RbcView, WayfeelEvent } from "@/types/events";
import CalendarShell from "@/components/calendar/CalendarShell";
import CalendarBoard from "@/components/calendar/CalendarBoard";
import EventModal from "@/components/EventModal";
import useMarkers from "@/hooks/useMarkers";
import useGoogleCalendar from "@/hooks/useGoogleCalendar";
import useGoogleMapsLoader from "@/hooks/useGoogleMapsLoader";
import { emojiMap } from "@/lib/constants";

const CalendarPage = () => {
  const { isSignedIn, user } = useUser();

  // layout
  const [activeItem, setActiveItem] = useState("home");

  // calendar navigation
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [currentView, setCurrentView] = useState<RbcView>("week");

  // data hooks
  const markerEvents = useMarkers(user?.id);
  const { connected: googleConnected, events: gcalEvents, connect: connectGoogle, loadEvents } =
    useGoogleCalendar();

  // modal
  const [selectedEvent, setSelectedEvent] = useState<WayfeelEvent | null>(null);

  // maps
  const mapScriptLoaded = useGoogleMapsLoader(process.env.NEXT_PUBLIC_MAP_API_KEY);
  const miniMapRef = useRef<HTMLDivElement>(null);

  // load gcal on view/date change
  useEffect(() => {
    if (!isSignedIn) return;
    loadEvents(currentDate, currentView);
  }, [isSignedIn, currentDate, currentView, loadEvents]);

  // mini map render (kept here because it touches selectedEvent + DOM)
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

  const allEvents = useMemo(() => [...markerEvents, ...gcalEvents], [markerEvents, gcalEvents]);

  return (
    <CalendarShell
      googleConnected={isSignedIn ? googleConnected : false}
      onConnectGoogle={connectGoogle}
      activeItem={activeItem}
      setActiveItem={setActiveItem}
    >
      {!isSignedIn ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-xl font-semibold">Please sign in to view the calendar.</p>
        </div>
      ) : (
        <CalendarBoard
          events={allEvents}
          date={currentDate}
          onNavigate={setCurrentDate}
          onView={setCurrentView}
          onSelectEvent={(e) => setSelectedEvent(e)}
        />
      )}

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          emojiMap={emojiMap}                // or just omit this line
          mapScriptLoaded={mapScriptLoaded}
        />
      )}
    </CalendarShell>
  );
};

export default CalendarPage;
