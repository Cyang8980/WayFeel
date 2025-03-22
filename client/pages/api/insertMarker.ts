import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_API_KEY!);

export interface Marker {
    id: string;
    longitude: number;
    latitude: number;
    emoji_id: number;
    created_by: string;
    anon: boolean;
  }
  
export async function insertMarker(marker: Marker): Promise<void> {
const { data, error } = await supabase
    .from('markers')
    .insert([marker])
    .select();

if (error) {
    console.error('Error inserting data:', error);
    return;
}

console.log('Inserted data:', data);
}