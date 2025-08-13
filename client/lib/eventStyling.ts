import { emojiColorMap } from "./constants";
import { WayfeelEvent } from "@/types/events";

export const eventStyleGetter = (event: WayfeelEvent) => {
  const isEmptyGcal = event.source === "gcal" && event.emojiId == null;
  const backgroundColor = isEmptyGcal
    ? "#C9CDD3"              // neutral grey
    : (emojiColorMap[event.emojiId ?? 0] || "#E8E8E8");

  return {
    style: {
      backgroundColor,
      borderRadius: "6px",
      opacity: isEmptyGcal ? 0.7 : 0.95,
      color: isEmptyGcal ? "#555" : "#333",
      border: isEmptyGcal ? "1px dashed #9aa2a9" : "none",
      display: "block",
      padding: "5px",
      height: "auto",
      fontSize: "0.85rem",
    },
  };
};
