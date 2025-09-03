import React, { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { RbcView, WayfeelEvent } from "@/types/events";
import CalendarShell from "@/components/calendar/CalendarShell";
import CalendarBoard, { type DropResizeArgs } from "@/components/calendar/CalendarBoard";
import EventModal from "@/components/EventModal";
// REMOVE: import CreateEventModal from "@/components/CreateEventModal";
// REMOVE: import AssignWayfeelModal from "@/components/AssignWayfeelModal";
import useMarkers from "@/hooks/useMarkers";
import useGoogleCalendar from "@/hooks/useGoogleCalendar";
import useGoogleMapsLoader from "@/hooks/useGoogleMapsLoader";
import { emojiMap } from "@/lib/constants";

const toDate = (d: Date | string): Date => (d instanceof Date ? d : new Date(d));

const CalendarPage = () => {
  const { isSignedIn, user } = useUser();

  // layout
  const [activeItem, setActiveItem] = useState("calander");

  // calendar navigation
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [currentView, setCurrentView] = useState<RbcView>("week");

  // data hooks
  const markerEvents = useMarkers(user?.id);
  const { connected: googleConnected, events: gcalEvents, connect: connectGoogle, loadEvents } =
    useGoogleCalendar();

  // local Wayfeel events created/edited in UI (persist later)
  const [localWayfeel, setLocalWayfeel] = useState<WayfeelEvent[]>([]);
  const [suppressedGcalIds, setSuppressedGcalIds] = useState<Set<string>>(new Set());

  // modal states
  const [selectedEvent, setSelectedEvent] = useState<WayfeelEvent | null>(null);
  // REMOVE: const [slotDraft, setSlotDraft] = useState<{ start: Date; end: Date } | null>(null);
  // REMOVE: const [assignTarget, setAssignTarget] = useState<WayfeelEvent | null>(null);

  // maps for EventModal
  const mapScriptLoaded = useGoogleMapsLoader(process.env.NEXT_PUBLIC_MAP_API_KEY);

  useEffect(() => {
    if (!isSignedIn) return;
    loadEvents(currentDate, currentView);
  }, [isSignedIn, currentDate, currentView, loadEvents]);

  // combine events (gcal grey + wayfeel)
  const allEvents = useMemo(() => {
    // Prefer localWayfeel changes over fetched markers to avoid duplicates
    const map = new Map<string, WayfeelEvent>();
    gcalEvents
      .filter((e) => !suppressedGcalIds.has(e.id))
      .forEach((e) => map.set(e.id, e));
    markerEvents.forEach((e) => map.set(e.id, e));
    localWayfeel.forEach((e) => map.set(e.id, e)); // override with local edits
    return Array.from(map.values());
  }, [gcalEvents, markerEvents, localWayfeel, suppressedGcalIds]);

  // select an event
  const handleSelectEvent = (e: WayfeelEvent) => {
    // Only allow viewing/editing Wayfeel events
    if (e.source === "wayfeel") {
      setSelectedEvent(e);
    } else {
      // For GCal (read-only), do nothing or optionally show a read-only modal if you have one
      return;
    }
  };

  // REMOVE: onSelectSlot handler & creation path
  // const handleSelectSlot = (...) => { /* disabled */ };

  // DnD handlers (only mutate Wayfeel events; GCal are read-only)
  const onEventDrop = async ({ event, start, end }: DropResizeArgs) => {
    if (event.source !== "wayfeel") return;
    const nextStart = toDate(start);
    const nextEnd = toDate(end);
    setLocalWayfeel((prev) => {
      const exists = prev.some((e) => e.id === event.id);
      const updated = { ...event, start: nextStart, end: nextEnd };
      return exists ? prev.map((e) => (e.id === event.id ? updated : e)) : [...prev, updated];
    });
    // persist to Supabase via API route (server-side service key)
    try {
      const res = await fetch("/api/markers/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: event.id, start: nextStart.toISOString(), end: nextEnd.toISOString() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        // eslint-disable-next-line no-console
        console.error("Persist drop failed:", data.error || res.statusText);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Failed to persist event drop:", e);
    }
  };

  const onEventResize = async ({ event, start, end }: DropResizeArgs) => {
    if (event.source !== "wayfeel") return;
    const nextStart = toDate(start);
    const nextEnd = toDate(end);
    setLocalWayfeel((prev) => {
      const exists = prev.some((e) => e.id === event.id);
      const updated = { ...event, start: nextStart, end: nextEnd };
      return exists ? prev.map((e) => (e.id === event.id ? updated : e)) : [...prev, updated];
    });
    // persist to Supabase via API route (server-side service key)
    try {
      const res = await fetch("/api/markers/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: event.id, start: nextStart.toISOString(), end: nextEnd.toISOString() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        // eslint-disable-next-line no-console
        console.error("Persist resize failed:", data.error || res.statusText);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Failed to persist event resize:", e);
    }
  };

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
          onSelectEvent={handleSelectEvent}
          // REMOVE: onSelectSlot={handleSelectSlot}
          onEventDrop={onEventDrop}
          onEventResize={onEventResize}
        />
      )}

      {/* View an existing Wayfeel event */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          emojiMap={emojiMap}
          mapScriptLoaded={mapScriptLoaded}
        />
      )}

      {/* REMOVE: CreateEventModal (no new events) */}
      {/* REMOVE: AssignWayfeelModal (no converting GCal to Wayfeel) */}
    </CalendarShell>
  );
};

export default CalendarPage;
