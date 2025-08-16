import { useEffect, useState } from "react";
import moment from "moment";
import { WayfeelEvent } from "@/types/events";
import { getMarkers } from "@/pages/api/getMarkers";
import { emojiMap } from "@/lib/constants";

export default function useMarkers(userId?: string) {
  const [events, setEvents] = useState<WayfeelEvent[]>([]);

  useEffect(() => {
    if (!userId) {
      return;
    }
    (async () => {
      const markers = await getMarkers({ user_id: userId });
      if (!markers) {
        return;
      }

      const formatted = markers.map((m: any) => {
        const start = moment.utc(m.created_at).local().toDate();
        const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
        return {
          id: m.id,
          start,
          end,
          title: m.text || "",
          emojiId: m.emoji_id,
          imageUrl: emojiMap[m.emoji_id] || "/happy.svg",
          latitude: m.latitude ?? 37.7749,
          longitude: m.longitude ?? -122.4194,
        } as WayfeelEvent;
      });

      setEvents(formatted);
    })();
  }, [userId]);

  return events;
}
