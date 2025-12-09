import { createClient } from '@supabase/supabase-js';
import type { Marker } from "../../types/markers"
import { client } from '@/lib/graphql/client';
import { CREATE_MARKER } from '@/lib/graphql/queries/insertMarker';
import { GET_MARKERS } from '@/lib/graphql/queries/getMarkers';
export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_API_KEY!);
  
  export async function insertMarker(marker: Marker): Promise<void> {
    const createdAtISO = marker.created_at ? new Date(marker.created_at).toISOString() : new Date().toISOString();
    const endAtISO = marker.end_at
      ? new Date(marker.end_at).toISOString()
      : new Date(new Date(createdAtISO).getTime() + 60 * 60 * 1000).toISOString();

    const safeMarker = {
      ...marker,
      created_at: createdAtISO,
      end_at: endAtISO,
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
  
export async function insertMarkerApollo(marker: Marker): Promise<Marker | null> {
  // ensure timestamps
  const createdAtISO = marker.created_at
    ? new Date(marker.created_at).toISOString()
    : new Date().toISOString();

  const endAtISO = marker.end_at
    ? new Date(marker.end_at).toISOString()
    : new Date(new Date(createdAtISO).getTime() + 60 * 60 * 1000).toISOString();

  // Build CreateMarkerInput
  const input: any = {
    longitude: marker.longitude,
    latitude: marker.latitude,
    text: marker.text ?? null,
    emoji_id: marker.emoji_id ?? null,
    anon: marker.anon ?? false,
    created_at: createdAtISO,
    end_at: endAtISO,
  };

  // Only pass created_by if it’s a UUID (your DB expects uuid)
  if (isUUID(marker.created_by)) {
    input.created_by = marker.created_by!;
  }

  try {
    console.log("Data to be mutated: ", marker);
    const { data } = await client.mutate<{ createMarker: Marker }>({
      mutation: CREATE_MARKER,
      variables: { marker: input },
      refetchQueries: [{ query: GET_MARKERS, variables: { options: { limit: 50 } } }],
      awaitRefetchQueries: true,
    });
    console.log("data returned: ", data);

    return data?.createMarker ?? null;
  } catch (err) {
    console.error('Error inserting marker via GraphQL:', err);
    return null;
  }
}

const isUUID = (s?: string) => !!s && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(s);
