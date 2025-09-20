import { createClient } from '@supabase/supabase-js';
import type { Marker } from "../../types/markers";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_API_KEY!
);

export type MarkerFilterOptions = {
  user_id?: string;
  anonFilter?: 'all' | 'only' | 'exclude';
  startDate?: Date;
  endDate?: Date;
  limit?: number;
};

export async function getMarkers(options: MarkerFilterOptions = {}): Promise<Marker[] | null> {
  const { user_id, anonFilter = 'all', startDate, endDate } = options;

  let query = supabase.from('markers').select('*');

  // User ID filtering
  if (user_id) {
    query = query.eq('created_by', user_id);
  }

  // Anonymous filtering logic
  if (anonFilter === 'only') {
    query = query.eq('anon', true);
  } else if (anonFilter === 'exclude') {
    query = query.eq('anon', false);
  }
  // else anonFilter = 'all' → no anon filtering

  // Date range filtering
  if (startDate && endDate) {
    query = query
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());
  } else if (startDate) {
    query = query.gte('created_at', startDate.toISOString());
  } else if (endDate) {
    query = query.lte('created_at', endDate.toISOString());
  }

  const { data: markers, error } = await query;

  if (error) {
    console.error("Error fetching markers:", error);
    return null;
  }

  return markers;
}

export const grabTwoEvents = async (userId: string) => {
  const { data, error } = await supabase
    .from("markers")
    .select("*")
    .eq("created_by", userId)          // filter by current user
    .order("created_at", { ascending: false })
    .limit(2);

  if (error) {
    console.error("Error fetching events:", error);
    return [];
  }

  return data || [];
};