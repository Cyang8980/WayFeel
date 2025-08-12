import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import { jwtVerify } from "jose";
import { parse } from "cookie";

const TOKEN_COOKIE = "gcal_tokens";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const cookies = parse(req.headers.cookie || "");
    if (!cookies[TOKEN_COOKIE]) {
      return res.status(401).json({ error: "Not connected" });
    }

    const secret = new TextEncoder().encode(process.env.ENCRYPTION_KEY);
    const { payload }: any = await jwtVerify(cookies[TOKEN_COOKIE], secret);
    const { tokens } = payload;

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    oauth2Client.setCredentials(tokens);

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const result = await calendar.events.list({
      calendarId: "primary",
      singleEvents: true,
      orderBy: "startTime",
      timeMin: new Date().toISOString(),
      maxResults: 50,
    });

    const events = (result.data.items || []).map((e) => ({
      id: e.id,
      title: e.summary || "(No title)",
      start: new Date(e.start?.dateTime || e.start?.date || ""),
      end: new Date(e.end?.dateTime || e.end?.date || ""),
    }));

    res.status(200).json({ events });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
}
