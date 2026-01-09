import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { RbcView, WayfeelEvent } from "@/types/events";
import CalendarShell from "@/components/calendar/CalendarShell";
import CalendarBoard, { type DropResizeArgs } from "@/components/calendar/CalendarBoard";
import EventModal from "@/components/EventModal";
import useMarkers from "@/hooks/useMarkers";
import useGoogleCalendar from "@/hooks/useGoogleCalendar";
import useGoogleMapsLoader from "@/hooks/useGoogleMapsLoader";
import { emojiMap } from "@/lib/constants";

const toDate = (d: Date | string): Date => (d instanceof Date ? d : new Date(d));

const CalendarPage = () => {
  const { isSignedIn, user } = useUser();

  // Layout
  const [activeItem, setActiveItem] = useState("calendar");

  // Calendar navigation
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [currentView, setCurrentView] = useState<RbcView>("week");

  // Data hooks
  const markerEvents = useMarkers(user?.id);
  const {
    connected: googleConnected,
    events: gcalEvents,
    connect: connectGoogle,
    loadEvents
  } = useGoogleCalendar();

  // Local Wayfeel events
  const [localWayfeel, setLocalWayfeel] = useState<WayfeelEvent[]>([]);
  const [suppressedGcalIds] = useState<Set<string>>(new Set());

  // Modal state
  const [selectedEvent, setSelectedEvent] = useState<WayfeelEvent | null>(null);
  const mapScriptLoaded = useGoogleMapsLoader(process.env.NEXT_PUBLIC_MAP_API_KEY || '');

  // Load events when signed in or view changes
  useEffect(() => {
    if (!isSignedIn) return;
    loadEvents(currentDate, currentView);
  }, [isSignedIn, currentDate, currentView, loadEvents]);

  // Combine events
  const allEvents = useMemo(() => {
    const map = new Map<string, WayfeelEvent>();
    gcalEvents
      .filter((e) => !suppressedGcalIds.has(e.id))
      .forEach((e) => map.set(e.id, e));
    markerEvents.forEach((e) => map.set(e.id, e));
    localWayfeel.forEach((e) => map.set(e.id, e));
    return Array.from(map.values());
  }, [gcalEvents, markerEvents, localWayfeel, suppressedGcalIds]);

  // Event handlers
  const handleSelectEvent = useCallback((e: WayfeelEvent) => {
    if (e.source === "wayfeel") {
      setSelectedEvent(e);
    }
  }, []);

  const onEventDrop = useCallback(async ({ event, start, end }: DropResizeArgs) => {
    if (event.source !== "wayfeel") return;
    const nextStart = toDate(start);
    const nextEnd = toDate(end);

    setLocalWayfeel((prev) => {
      const exists = prev.some((e) => e.id === event.id);
      const updated = { ...event, start: nextStart, end: nextEnd };
      return exists ? prev.map((e) => (e.id === event.id ? updated : e)) : [...prev, updated];
    });

    try {
      const res = await fetch("/api/markers/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: event.id,
          start: nextStart.toISOString(),
          end: nextEnd.toISOString()
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("Persist drop failed:", data.error || res.statusText);
      }
    } catch (e) {
      console.error("Failed to persist event drop:", e);
    }
  }, []);

  const onEventResize = useCallback(async ({ event, start, end }: DropResizeArgs) => {
    if (event.source !== "wayfeel") return;
    const nextStart = toDate(start);
    const nextEnd = toDate(end);

    setLocalWayfeel((prev) => {
      const exists = prev.some((e) => e.id === event.id);
      const updated = { ...event, start: nextStart, end: nextEnd };
      return exists ? prev.map((e) => (e.id === event.id ? updated : e)) : [...prev, updated];
    });

    try {
      const res = await fetch("/api/markers/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: event.id,
          start: nextStart.toISOString(),
          end: nextEnd.toISOString()
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("Persist resize failed:", data.error || res.statusText);
      }
    } catch (e) {
      console.error("Failed to persist event resize:", e);
    }
  }, []);

  return (
    <CalendarShell

      
      activeItem={activeItem}
      setActiveItem={setActiveItem}
    >
      {!isSignedIn ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-xl font-semibold">Please sign in to view the calendar.</p>
        </div>
      ) : (
        <CalendarBoard
          googleConnected={isSignedIn ? googleConnected : false}
          onConnectGoogle={connectGoogle}
          events={allEvents}
          date={currentDate}
          onNavigate={setCurrentDate}
          onView={setCurrentView}
          onSelectEvent={handleSelectEvent}
          onEventDrop={onEventDrop}
          onEventResize={onEventResize} view={"month"} />
      )}

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          emojiMap={emojiMap}
          mapScriptLoaded={mapScriptLoaded}
        />
      )}
    </CalendarShell>
  );
};

export default CalendarPage;