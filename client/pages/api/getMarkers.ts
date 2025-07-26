import { createClient } from '@supabase/supabase-js';
import { Marker } from './insertMarker';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_API_KEY!
);

export async function getMarkersCurrUserAnon(user_id: string, startDate?: Date, endDate?: Date): Promise<Marker[] | null> {
  let query = supabase
    .from('markers')
    .select('*')
    .or(`created_by.eq.${user_id},anon.eq.true`);

  // Just add these three lines for date filtering
  if (startDate && endDate) {
    query = query.gte('created_at', startDate.toISOString())
                .lte('created_at', endDate.toISOString());
  }

  // Keep everything else exactly the same
  const { data: markers, error } = await query;

  if (error) {
    console.error("Error fetching markers:", error);
    return null;
  }

  return markers;
}

export async function getMarkersCurrUser(user_id: string, startDate?: Date, endDate?: Date): Promise<Marker[] | null> {
  let query = supabase
    .from('markers')
    .select('*')
    .or(`created_by.eq.${user_id}`);

  // Just add these three lines for date filtering
  if (startDate && endDate) {
    query = query.gte('created_at', startDate.toISOString())
                .lte('created_at', endDate.toISOString());
  }

  // Keep everything else exactly the same
  const { data: markers, error } = await query;

  if (error) {
    console.error("Error fetching markers:", error);
    return null;
  }

  return markers;
}

export async function getMarkersAll(startDate?: Date, endDate?: Date): Promise<Marker[] | null> {
   let query = supabase
    .from('markers')
    .select('*')

  if (startDate && endDate) {
    query = query.gte('created_at', startDate.toISOString())
                .lte('created_at', endDate.toISOString());
  }
  
  const { data: markers, error } = await query;
  if (error) {
    console.error("Error fetching markers:", error);
    return null;
  }

  return markers;
}