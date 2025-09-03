import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { getAuth } from "@clerk/nextjs/server";

type Body = {
  id?: string;
  start?: string; // ISO
  end?: string;   // ISO
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const { id, start, end } = (req.body ?? {}) as Body;
  if (!id || !start || !end) return res.status(400).json({ error: "Missing id/start/end" });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return res.status(500).json({ error: "Supabase server credentials missing" });
  }

  const supabase = createClient(url, serviceKey);

  try {
    // Only update the caller's own marker
    const { error } = await supabase
      .from("markers")
      .update({ created_at: new Date(start).toISOString(), end_at: new Date(end).toISOString() })
      .eq("id", id)
      .eq("created_by", userId);

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ ok: true });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Update marker failed:", e);
    return res.status(500).json({ error: "Unexpected server error" });
  }
}
