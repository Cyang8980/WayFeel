import { useCallback, useState } from "react";
import { isoRangeForView } from "@/lib/dateRange";
import { WayfeelEvent, RbcView } from "@/types/events";
import { GoogleEvent } from "@/types/google"; // ✅ import

export default function useGoogleCalendar() {
  const [connected, setConnected] = useState(false);
  const [events, setEvents] = useState<WayfeelEvent[]>([]);

  const connect = useCallback(async () => {
    const res = await fetch("/api/google/auth-url");
    const { url } = await res.json();
    window.location.href = url;
  }, []);

  const loadEvents = useCallback(async (date: Date, view: RbcView) => {
    try {
      const { timeMin, timeMax } = isoRangeForView(date, view);
      const res = await fetch(
        `/api/google/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}`
      );

      if (res.status === 401) {
        setConnected(false);
        setEvents([]);
        return;
      }

      const data: { events?: GoogleEvent[] } = await res.json(); // ✅ typed API response
      setConnected(true);

      const mapped: WayfeelEvent[] = (data.events || []).map((e) => ({
        id: `gcal:${e.id}`,
        start: new Date(e.start),
        end: new Date(e.end),
        title: e.title,
        source: "gcal",
        latitude: null,
        longitude: null,
      }));

      setEvents(mapped);
    } catch {
      setConnected(false);
      setEvents([]);
    }
  }, []);

  return { connected, events, connect, loadEvents };
}
