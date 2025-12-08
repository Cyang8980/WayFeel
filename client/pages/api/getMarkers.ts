import { createClient } from '@supabase/supabase-js';
import type { Marker } from "../../types/markers";
import { client } from '@/lib/graphql/client';
import { GET_MARKERS } from '@/lib/graphql/queries/getMarkers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_API_KEY!
);

export type GetMarkersResponse = {
  getMarkers: Marker[];
};

export type MarkerFilterOptions = {
  user_id?: string;
  anonFilter?: 'all' | 'only' | 'exclude';
  startDate?: Date;
  endDate?: Date;
  limit?: number;
};


export async function getMarkersApollo(options: MarkerFilterOptions = {}): Promise<Marker[] | null> {
  try {
    const { data } = await client.query<GetMarkersResponse>({
      query: GET_MARKERS,
      variables: {
        options: {
          startDate: options.startDate?.toISOString(),
          endDate: options.endDate?.toISOString(),
          limit: options.limit,
        }
      }
    });
    return data?.getMarkers || [];
  } catch (error) {
    console.error('Error fetching markers:', error);
    return null;
  }
}

export async function getMarkers(options: MarkerFilterOptions = {}): Promise<Marker[] | null> {
  const { user_id, anonFilter = 'all', startDate, endDate } = options;

  let query = supabase.from('markers').select('*');

  // User ID filtering
  if (user_id) {
    query = query.eq('created_by', user_id);
  }

  // Anonymous filtering logic
  if (user_id) {
    query = query.eq('created_by', user_id);
    if (anonFilter === 'only') {
      query = query.eq('anon', true);
    } else if (anonFilter === 'exclude') {
      query = query.eq('anon', false);
    } // else anonFilter = 'all' → no anon filtering on user markers
  } else {
    if (anonFilter === 'only') {
      query = query.eq('anon', true);
    } else if (anonFilter === 'exclude') {
      query = query.eq('anon', false);
    }
    // else anonFilter = 'all' → no filtering at all
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