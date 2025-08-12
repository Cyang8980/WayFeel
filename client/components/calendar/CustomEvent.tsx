import React from "react";
import { WayfeelEvent } from "@/types/events";

export default function CustomEvent({ event }: { event: WayfeelEvent }) {
  const name = event.imageUrl
    ?.split("/")
    .pop()
    ?.replace(".svg", "")
    ?.replace(/^\w/, (c) => c.toUpperCase());

  return (
    <div className="flex items-center gap-2 px-2 py-1 h-full overflow-hidden">
      {event.imageUrl && (
        <img src={event.imageUrl} alt={name} style={{ width: 24, height: 24 }} />
      )}
      <span className="truncate text-sm">
        {event.title?.split(" ").slice(0, 5).join(" ") || "No description"}
      </span>
    </div>
  );
}
