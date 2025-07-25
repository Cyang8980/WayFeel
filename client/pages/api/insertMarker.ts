import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_API_KEY!);

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
  