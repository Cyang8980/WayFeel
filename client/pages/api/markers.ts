import type { NextApiRequest, NextApiResponse } from 'next';
import { getMarkers } from './getMarkers'; 
import { Marker } from './insertMarker';
import { MarkerFilterOptions } from "../api/getMarkers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Marker[] | { error: string }>
) {
  const { userId, startDate, endDate, view } = req.query;
  const options: MarkerFilterOptions = {};

  if (typeof userId === 'string') {
    options.user_id = userId;
  }

  if (typeof view === 'string') {
    switch (view) {
      case 'personal':
        options.user_id = userId as string;
        options.anonFilter = 'all'; // include anon and non-anon markers created by user
        break;
      case 'anon':
        options.anonFilter = 'only'; // only anonymous markers (from any user)
        break;
      case 'notanon':
        options.anonFilter = 'exclude'; // only non-anonymous markers (from any user)
        break;
      case 'all':
      default:
        options.anonFilter = 'all'; // all markers
        break;
    }
} else {
    // default case if no view specified
    options.anonFilter = 'all';
  }

  if (typeof startDate === 'string' && typeof endDate === 'string') {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
      options.startDate = start;
      options.endDate = end;
    }
  }

  try {
    const markers = await getMarkers(options);

    if (!markers) {
      return res.status(500).json({ error: 'Failed to fetch markers' });
    }

    return res.status(200).json(markers);
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
