import { useEffect, useState } from "react";
import moment from "moment";
import { WayfeelEvent } from "@/types/events";
import { getMarkers } from "@/pages/api/getMarkers";
import { emojiMap } from "@/lib/constants";
import type { Marker } from "@/types/markers"; // use the real type

export default function useMarkers(userId?: string) {
  const [events, setEvents] = useState<WayfeelEvent[]>([]);

  useEffect(() => {
    if (!userId) {
      setEvents([]);
      return;
    }

    (async () => {
      try {
        const markers: Marker[] | null = await getMarkers({ user_id: userId });
        if (!markers) {
          setEvents([]);
          return;
        }

        // Map Supabase markers to calendar events for the signed-in user.
        // If an end_at exists, use it; otherwise default to 1 hour after start
        const formatted: WayfeelEvent[] = markers.map((m: Marker) => {
          const start = moment.utc(m.created_at).local().toDate();
          const end = m.end_at
            ? moment.utc(m.end_at).local().toDate()
            : new Date(start.getTime() + 60 * 60 * 1000); // 1 hour block
          return {
            id: m.id,
            start,
            end,
            title: m.text || "",
            source: "wayfeel",
            emojiId: m.emoji_id,
            imageUrl: emojiMap[m.emoji_id] || "/happy.svg",
            latitude: m.latitude ?? 37.7749,
            longitude: m.longitude ?? -122.4194,
          };
        });

        setEvents(formatted);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Failed to load markers:", e);
        setEvents([]);
      }
    })();
  }, [userId]);

  return events;
}
