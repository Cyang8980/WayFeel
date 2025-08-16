export type RbcView = "month" | "week" | "day";
export type EventSource = "gcal" | "wayfeel";

export type WayfeelEvent = {
  id: string;
  start: Date;
  end: Date;
  title: string;

  source: EventSource;      // <- NEW: distinguishes gcal vs wayfeel

  // Wayfeel (optional for “empty” gcal events)
  emojiId?: number;
  imageUrl?: string;
  description?: string;

  latitude?: number | null;
  longitude?: number | null;
};
