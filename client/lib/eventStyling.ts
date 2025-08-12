import { emojiColorMap } from "./constants";

export const eventStyleGetter = (event: any) => {
  const backgroundColor = emojiColorMap[event.emojiId] || "#E8E8E8";
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
