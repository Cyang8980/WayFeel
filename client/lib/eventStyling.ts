import { emojiColorMap } from "./constants";
import { WayfeelEvent } from "@/types/events";

export const eventStyleGetter = (event: WayfeelEvent) => {
  const backgroundColor =
    emojiColorMap[event.emojiId ?? 0] || "#E8E8E8";

  return {
    style: {
      backgroundColor,
      borderRadius: "5px",
      opacity: 0.9,
      color: "#333",
      border: "none",
      display: "block",
      padding: "5px",
      height: "auto",
      fontSize: "0.85rem",
    },
  };
};
