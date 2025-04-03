import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_API_KEY!
);

export interface User {
  id: string;
  first_name: string;
  last_name: string;
}

export async function insertUser(user: User): Promise<void> {
  const { data, error } = await supabase.from("users").insert([user]).select();

  if (error) {
    console.error("Error inserting data:", error);
    return;
  }

  console.log("Inserted data:", data);
}
