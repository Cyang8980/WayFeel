export type RbcView = "month" | "week" | "day";

export type WayfeelEvent = {
  id: string | number;
  start: Date;
  end: Date;
  title: string;
  emojiId?: number;
  imageUrl?: string;
  latitude?: number | null;
  longitude?: number | null;
};
