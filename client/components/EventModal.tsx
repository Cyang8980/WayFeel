import React, { useEffect, useRef, useState } from "react";
import moment from "moment";

type EmojiMap = { [key: number]: string };

type EventType = {
  imageUrl: string;
  title: string;
  start: Date;
  emojiId: number;
  latitude: number;
  longitude: number;
};

type Props = {
  event: EventType;
  onClose: () => void;
  emojiMap: EmojiMap;
  mapScriptLoaded: boolean;
};

const emojiIds = [1, 2, 3, 4, 5];

const EventModal: React.FC<Props> = ({ event, onClose, emojiMap, mapScriptLoaded }) => {
  const miniMapRef = useRef<HTMLDivElement>(null);

  // Local reaction count state initialized to 0 for each emoji
  const [reactions, setReactions] = useState<{ [key: number]: number }>(() =>
    emojiIds.reduce((acc, id) => {
      acc[id] = 0;
      return acc;
    }, {} as { [key: number]: number })
  );

  const [userReaction, setUserReaction] = useState<number | null>(null);

  const handleReact = (id: number) => {
    setReactions((prev) => {
      const newCounts = { ...prev };

      if (userReaction === id) {
        // Undo current reaction
        newCounts[id] = Math.max(0, newCounts[id] - 1);
        setUserReaction(null);
      } else {
        // Remove previous reaction if any
        if (userReaction !== null) {
          newCounts[userReaction] = Math.max(0, newCounts[userReaction] - 1);
        }
        // Apply new reaction
        newCounts[id] = (newCounts[id] || 0) + 1;
        setUserReaction(id);
      }

      return newCounts;
    });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (
        event &&
        mapScriptLoaded &&
        window.google &&
        miniMapRef.current &&
        event.latitude &&
        event.longitude
      ) {
        miniMapRef.current.innerHTML = "";

        const map = new window.google.maps.Map(miniMapRef.current, {
          center: {
            lat: event.latitude,
            lng: event.longitude,
          },
          zoom: 15,
          disableDefaultUI: true,
        });

        new window.google.maps.Marker({
          map,
          position: {
            lat: event.latitude,
            lng: event.longitude,
          },
          title: event.title || "Event",
          icon: {
            url: event.imageUrl,
            scaledSize: new window.google.maps.Size(40, 40),
          },
        });
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [event, mapScriptLoaded]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 overflow-y-auto">
      <div className="relative w-[96%] max-w-7xl max-h-[90vh] bg-blue-100 rounded-3xl shadow-2xl p-10 flex flex-col md:flex-row gap-10 items-start transition-all duration-200 overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-6 text-3xl text-gray-600 hover:text-black"
        >
          &times;
        </button>

        {/* Left: Main Emoji Image */}
        <div className="flex-shrink-0">
          <img
            src={event.imageUrl}
            alt="emoji"
            className="w-64 h-64 md:w-72 md:h-72 object-contain"
          />
        </div>

        {/* Middle: Details, Emoji Reactions, Comment */}
        <div className="flex-1 w-full max-w-3xl flex flex-col h-full justify-between">
          <div className="bg-white rounded-2xl p-6 shadow-md text-gray-800 mb-6">
            <h3 className="text-2xl font-semibold mb-4">I felt great today!</h3>
            <p className="text-base whitespace-pre-wrap mb-3">{event.title}</p>

            <div className="text-sm text-gray-500 mb-5">
              {moment(event.start).format("MM/DD/YY")} —{" "}
              {moment(event.start).format("h:mm A")}
            </div>

            {/* Emoji Reactions */}
            <div className="flex gap-6 mt-6">
              {emojiIds.map((id) => (
                <div
                  key={id}
                  onClick={() => handleReact(id)}
                  className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
                >
                  <img
                    src={emojiMap[id]}
                    alt={`mood-${id}`}
                    className={`w-14 h-14 ${
                      id === userReaction ? "scale-110 border-2 border-blue-400 rounded-full" : "opacity-60"
                    }`}
                  />
                  <span className="mt-1 text-sm text-gray-700 font-medium">
                    {reactions[id]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Comment Box */}
          <div className="bg-white rounded-2xl p-4 shadow-md mt-auto">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Comments
            </label>
            <textarea
              id="comment"
              className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none"
              placeholder="Add your thoughts or notes here..."
              disabled
            ></textarea>
          </div>
        </div>

        {/* Right: Mini Map */}
        <div className="hidden md:block w-96 h-96 rounded-xl overflow-hidden border-2 border-gray-300">
          <div ref={miniMapRef} id="mini-map" className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default EventModal;
