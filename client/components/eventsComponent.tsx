import { useEffect, useState } from "react";
import { grabTwoEvents } from "../pages/api/getMarkers";
import { Marker } from "@/pages/api/insertMarker";
import { useUser } from "@clerk/nextjs";

export default function EventList() {
  const [events, setEvents] = useState<Marker[]>([]);
  const { isSignedIn, user } = useUser();

  const emojiImages: { [key: number]: string } = {
    1: "sad.svg",
    2: "angry.svg",
    3: "meh.svg",
    4: "happy.svg",
    5: "excited.svg",
  };

  const emojiBackgrounds: { [key: number]: string } = {
    1: "#8BA6D0", // light red for sad
    2: "#E8818C", // stronger red for angry
    3: "#F2A181", // yellowish for meh
    4: "#F7E599", // light green for happy
    5: "#AAD485", // light blue for excited
  };
  useEffect(() => {
    if (!isSignedIn || !user) return;

    const fetchEvents = async () => {
      const result = await grabTwoEvents(user.id);
      setEvents(result);
    };

    fetchEvents();
  }, [isSignedIn, user]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        paddingTop: "20px",
      }}
    >
      {events.map((event) => {
        const emojiId = event.emoji_id;
        const emojiSrc = emojiImages[emojiId];
        const bgColor = emojiBackgrounds[emojiId] || "white"; // fallback if no match

        return (
          <div
            key={event.id}
            style={{
              border: "1px solid #ccc",
              padding: "2rem",
              borderRadius: "8px",
              width: "425px",
              minHeight: "200px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              backgroundColor: bgColor,
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            {emojiSrc && (
              <img
                src={emojiSrc}
                alt={`Emoji ${emojiId}`}
                style={{ width: 150, height: 150 }}
              />
            )}
            <div>
              <h3>{event.text}</h3>
              <p>{new Date(event.created_at).toLocaleString()}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
