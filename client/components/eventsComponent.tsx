import { useEffect, useState } from "react";
import { grabTwoEvents } from "../pages/api/getMarkers";
import type { Marker } from "../types/markers";
import { useUser } from "@clerk/nextjs";


function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function handleResize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}

export default function EventList() {
  const [events, setEvents] = useState<Marker[]>([]);
  const { isSignedIn, user } = useUser();
  const { width: windowWidth } = useWindowSize();

  // Dynamic sizes
  const cardWidth = windowWidth > 1200 ? "425px" : windowWidth > 768 ? "90%" : "100%";
  const cardMinHeight = windowWidth > 768 ? "200px" : "150px";
  const emojiSize = windowWidth > 1200 ? 150 : windowWidth > 768 ? 120 : 80;

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
        alignItems: "center", // center cards on wide screens
      }}
    >
      {events.map((event) => {
        const emojiId = event.emoji_id;
        const emojiSrc = emojiImages[emojiId];
        const bgColor = emojiBackgrounds[emojiId] || "white";

        return (
          <div
            key={event.id}
            style={{
              border: "1px solid #ccc",
              padding: "2rem",
              borderRadius: "8px",
              width: cardWidth,
              minHeight: cardMinHeight,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              backgroundColor: bgColor,
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap", // allow wrapping on small screens
            }}
          >
            {emojiSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={emojiSrc}
                alt={`Emoji ${emojiId}`}
                style={{
                  width: emojiSize,
                  height: emojiSize,
                  objectFit: "contain",
                }}
              />
            )}
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: windowWidth < 500 ? "1rem" : "1.25rem" }}>
                {event.text}
              </h3>
              <p style={{ fontSize: windowWidth < 500 ? "0.8rem" : "1rem" }}>
                {new Date(event.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
