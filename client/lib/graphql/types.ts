// lib/graphql/types.ts
export interface Marker {
  id: string;
  created_at: string;
  end_at?: string;
  longitude: number;
  latitude: number;
  created_by?: string;
  text?: string;
  emoji_id?: number;
  anon: boolean;
}

export interface User {
  id: string;
  created_at: string;
  first_name?: string;
  last_name?: string;
  dob?: string;
  email?: string;
  is_public: boolean;
  city?: string;
  state?: string;
  phone_number?: string;
}

// Query response types
export interface GetMarkersResponse {
  getMarkers: Marker[];
}

export interface GetMarkerResponse {
  getMarker: Marker;
}

export interface GetUserResponse {
  getUser: User;
}

// Input types
export interface MarkerFilterInput {
  user_id?: string;
  anonFilter?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

export interface CreateMarkerInput {
  longitude: number;
  latitude: number;
  text?: string;
  emoji_id?: number;
  anon?: boolean;
  created_by?: string;
  created_at?: string;
  end_at?: string;
}