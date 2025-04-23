import { createClient } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_API_KEY!
);

export interface Marker {
    id: string;
    longitude: number;
    latitude: number;
    emoji_id: number;
    created_by: string;
    anon: boolean;
    text: string;
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const marker = req.body as Marker;
    const { data, error } = await supabase
      .from("markers")
      .insert([marker])
      .select();

    if (error) {
      console.error("Error inserting data:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
