// EventModal.tsx
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import moment from "moment";
import { WayfeelEvent } from "@/types/events";
import { emojiMap as defaultEmojiMap } from "@/lib/constants";

type EmojiMap = { [key: number]: string };

type Props = {
  event: WayfeelEvent;
  onClose: () => void;
  emojiMap?: EmojiMap;
  mapScriptLoaded: boolean;
};

const emojiIds = [1, 2, 3, 4, 5];

// Minimal Maps typings for what we use (no `any`)
interface GoogleMapsShim {
  maps: {
    Map: new (
      el: HTMLElement,
      opts: { center: { lat: number; lng: number }; zoom: number; disableDefaultUI?: boolean }
    ) => unknown;
    Marker: new (opts: {
      map: unknown;
      position: { lat: number; lng: number };
      title?: string;
      icon?: { url: string; scaledSize?: unknown };
    }) => unknown;
    Size: new (width: number, height: number) => unknown;
  };
}

const EventModal: React.FC<Props> = ({
  event,
  onClose,
  emojiMap = defaultEmojiMap,
  mapScriptLoaded,
}) => {
  const miniMapRef = useRef<HTMLDivElement>(null);

  const [reactions, setReactions] = useState<Record<number, number>>(
    () => Object.fromEntries(emojiIds.map((id) => [id, 0])) as Record<number, number>
  );
  const [userReaction, setUserReaction] = useState<number | null>(null);

  const handleReact = (id: number) => {
    setReactions((prev) => {
      const next = { ...prev };
      if (userReaction === id) {
        next[id] = Math.max(0, next[id] - 1);
        setUserReaction(null);
      } else {
        if (userReaction !== null) {
          next[userReaction] = Math.max(0, next[userReaction] - 1);
        }
        next[id] = (next[id] || 0) + 1;
        setUserReaction(id);
      }
      return next;
    });
  };

  useEffect(() => {
    const t = setTimeout(() => {
      const g = (window as unknown as { google?: GoogleMapsShim }).google;

      if (
        event &&
        mapScriptLoaded &&
        g?.maps &&
        miniMapRef.current &&
        event.latitude != null &&
        event.longitude != null
      ) {
        miniMapRef.current.innerHTML = "";

        // Map
        const map = new g.maps.Map(miniMapRef.current, {
          center: { lat: event.latitude, lng: event.longitude },
          zoom: 15,
          disableDefaultUI: true,
        });

        // Marker
        const iconUrl = event.imageUrl ?? "/happy.svg";
        new g.maps.Marker({
          map,
          position: { lat: event.latitude, lng: event.longitude },
          title: event.title || "Event",
          icon: { url: iconUrl, scaledSize: new g.maps.Size(40, 40) },
        });
      }
    }, 100);

    return () => clearTimeout(t);
  }, [event, mapScriptLoaded]);

  const imgSrc = event.imageUrl ?? "/happy.svg";

  // Derive a human-readable emotion name from the image URL or emojiId
  const deriveEmotionName = () => {
    const src = (event.emojiId && emojiMap[event.emojiId]) || event.imageUrl;
    if (!src) return null;
    const last = src.split("/").pop();
    if (!last) return null;
    const base = last.replace(".svg", "");
    // Capitalize first letter
    return base.replace(/^./, (c) => c.toUpperCase());
  };

  const emotionName = deriveEmotionName();

  // Prefer user-provided text (description/title). Fallback to emotion-based sentence.
  const description = (() => {
    const text = (event.description ?? event.title ?? "").trim();
    if (text.length > 0) return text;
    return emotionName ? `I feel ${emotionName} today!` : "I feel something today!";
  })();

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 overflow-y-auto">
      <div className="relative w-[96%] max-w-7xl max-h-[90vh] bg-blue-100 rounded-3xl shadow-2xl p-10 flex flex-col md:flex-row gap-10 items-start overflow-y-auto">
        <button onClick={onClose} className="absolute top-5 right-6 text-3xl text-gray-600 hover:text-black">
          &times;
        </button>

        {/* Left: Main Emoji Image */}
        <div className="flex-shrink-0">
          <Image src={imgSrc} alt="emoji" width={256} height={256} className="w-64 h-64 md:w-72 md:h-72 object-contain" />
        </div>

        {/* Middle: Details, Emoji Reactions, Comment */}
        <div className="flex-1 w-full max-w-3xl flex flex-col h-full justify-between">
          <div className="bg-white rounded-2xl p-6 shadow-md text-gray-800 mb-6">
            <h3 className="ext-base whitespace-pre-wrap mb-3 font-semibold">{description}</h3>
            <div className="text-sm text-gray-500 mb-5">
              {moment(event.start).format("MM/DD/YY")} — {moment(event.start).format("h:mm A")}
            </div>

            <div className="flex gap-6 mt-6">
              {emojiIds.map((id) => (
                <div
                  key={id}
                  onClick={() => handleReact(id)}
                  className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
                >
                  <Image
                    src={emojiMap[id]}
                    alt={`mood-${id}`}
                    width={56}
                    height={56}
                    className={`w-14 h-14 ${id === userReaction ? "scale-110 border-2 border-blue-400 rounded-full" : "opacity-60"}`}
                  />
                  <span className="mt-1 text-sm text-gray-700 font-medium">{reactions[id]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md mt-auto">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Comments
            </label>
            <textarea id="comment" className="w-full p-3 border border-gray-300 rounded-lg resize-none" placeholder="Add your thoughts or notes here..." />
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
