// pages/api/markers.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getMarkersCurrUserAnon } from './getMarkers'; // Adjust path as needed
import { Marker } from './insertMarker'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Marker[] | { error: string }>
) {
  const { userId } = req.query;

  if (typeof userId !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing userId' });
  }

  try {
    const markers = await getMarkersCurrUserAnon(userId);

    if (!markers) {
      return res.status(500).json({ error: 'Failed to fetch markers' });
    }

    return res.status(200).json(markers);
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
