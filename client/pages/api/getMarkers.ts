import { createClient } from '@supabase/supabase-js';
import { Marker } from './insertMarker';

export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, 
    process.env.NEXT_PUBLIC_SUPABASE_API_KEY!
);

export async function getMarkersCurrUserAnon(user_id: string): Promise<Marker[] | null> {
    const { data: markers, error } = await supabase
        .from('markers')
        .select('*')
        .or(`created_by.eq.${user_id},anon.eq.true`); // Fetch user's markers OR anonymous markers

    if (error) {
        console.error('Error fetching markers:', error.message);
        return null; // Or handle this error as needed
    }
    
    // console.log('Fetched markers:', markers);
    return markers;
}
