import { createClient } from '@supabase/supabase-js';
import { Marker } from './insertMarker';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_API_KEY!
);

export type MarkerFilterOptions = {
  user_id?: string;
  anonFilter?: 'all' | 'only' | 'exclude';
  startDate?: Date;
  endDate?: Date;
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
  // if 'all', do not filter anon at all

  // If user_id and anonFilter === 'only', maybe want to include anon + user markers? Up to your logic.

  // Date range filtering
  if (startDate && endDate) {
    query = query
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());
  }

  const { data: markers, error } = await query;

  if (error) {
    console.error("Error fetching markers:", error);
    return null;
  }

  return markers;
}
