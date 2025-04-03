import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_API_KEY!
);

interface Marker {
  id: number;
  user_id: string;
  anon: boolean;
}

export async function getMarkersCurrUserAnon(
  user_id: string
): Promise<Marker[] | null> {
  const { data: markers, error } = (await supabase
    .from("markers")
    .select("*")
    .or(`user_id.eq.${user_id},anon.eq.true`)) as unknown as {
    data: Marker[] | null;
    error: any;
  };

  if (error) {
    console.error("Error fetching markers:", error.message);
    return null;
  }

  console.log("Fetched markers:", markers);
  return markers;
}
