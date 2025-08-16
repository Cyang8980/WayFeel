export type MarkerRecord = {
  id: string;
  latitude: number;
  longitude: number;
  emoji_id: number;
  description?: string | null;
  created_at: string | number | Date;  // <-- widened
  created_by?: string;
  anon?: boolean;
};


export interface Marker {
    created_at: string | number | Date;
    id: string;
    longitude: number;
    latitude: number;
    emoji_id: number;
    created_by: string;
    anon: boolean;
    text: string;
  }