import { useEffect, useState } from "react";
import moment from "moment";
import { WayfeelEvent } from "@/types/events";
import { getMarkers } from "@/pages/api/getMarkers";
import { emojiMap } from "@/lib/constants";
import type { Marker }  from "@/types/markers";   // <-- use the real type

export default function useMarkers(userId?: string) {
  const [events, setEvents] = useState<WayfeelEvent[]>([]);

  useEffect(() => {
    if (!userId) {
      setEvents([]);
      return;
    }

    (async () => {
      try {
        const markers: Marker[] | null = await getMarkers({ user_id: userId }); // <-- type matches
        if (!markers) {
          setEvents([]);
          return;
        }

        const formatted: WayfeelEvent[] = markers.map((m) => {
          // m.created_at can be string | number | Date; moment can handle all
          const start = moment.utc(m.created_at).local().toDate();
          const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

          const emojiId = Number(m.emoji_id) || undefined;
          return {
            id: m.id,
            start,
            end,
            title: m.description ?? "",
            emojiId,
            imageUrl: emojiId ? emojiMap[emojiId] : undefined,
            latitude: m.latitude,
            longitude: m.longitude,
            source: "wayfeel",
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
