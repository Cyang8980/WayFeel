import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_API_KEY!
  );

interface User {
    id: string;
    first_name: string;
    last_name: string;
  }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Extract user ID from query parameters
  const { id } = req.query;

  // Check if 'id' is provided in the query parameters
  if (!id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Fetch the user from the 'users' table based on the provided ID
    const { data, error } = await supabase
      .from('users')
      .select('*')  // Or any specific fields you need
      .eq('id', id)  // Filter by the ID provided in the query string

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch user' });
    }

    // Check if a user was found
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user data if found
    return res.status(200).json({ success: true, user: data[0] });
  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
