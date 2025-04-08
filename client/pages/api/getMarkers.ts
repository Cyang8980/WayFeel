import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, 
    process.env.NEXT_PUBLIC_SUPABASE_API_KEY!
);

export async function getMarkersCurrUserAnon(user_id: string): Promise<any[] | null> {
    const { data: markers, error } = await supabase
        .from('markers')
        .select('id, longitude, latitude, emoji_id, created_by, anon, created_at') // Ensure timestamp is fetched
        .or(`created_by.eq.${user_id}, anon.eq.true`) // Fetch user-specific and anonymous markers
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching markers:', error.message);
        return null;
    }

    console.log('Fetched markers:', markers);
    return markers;
}

