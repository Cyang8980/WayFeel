import { createClient } from '@supabase/supabase-js';
import { Marker } from './insertMarker';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_API_KEY!
);

export async function getMarkersCurrUserAnon(user_id: string, startDate?: Date, endDate?: Date, emojiIds?: number[], showAnonymous?: boolean): Promise<Marker[] | null> {
  let query = supabase
    .from('markers')
    .select('*')
    .eq('created_by', user_id); 

    if (emojiIds) {
      query = query.in('emoji_id', emojiIds);
    }
  
    if (showAnonymous === false) {
      query = query.eq('anon', false);
    }
  
    if (startDate) {
      query = query.gte('created_at', startDate.toISOString());
    }
    if (endDate) {
      query = query.lte('created_at', endDate.toISOString());
    }
  
    const { data: markers, error } = await query;
  
    if (error) {
      console.error("Error fetching markers:", error);
      return null;
    }
    
    return markers;
}