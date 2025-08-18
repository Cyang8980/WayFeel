import { createClient } from '@supabase/supabase-js';
import type { Marker } from "../../types/markers"
export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_API_KEY!);
  
  export async function insertMarker(marker: Marker): Promise<void> {
    const safeMarker = {
      ...marker,
      created_at: marker.created_at ? new Date(marker.created_at).toISOString() : new Date().toISOString(),
    };
  
    const { data, error } = await supabase
      .from('markers')
      .insert([safeMarker])
      .select();
  
    if (error) {
      console.error('Error inserting data:', error);
      return;
    }
  
    console.log('Inserted data:', data);
  }
  