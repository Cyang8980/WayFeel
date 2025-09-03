// pages/api/google/events.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { google, calendar_v3 } from "googleapis";
import { jwtVerify, type JWTPayload } from "jose";
import { parse } from "cookie";
import type { Credentials } from "google-auth-library";

const TOKEN_COOKIE = "gcal_tokens";

type ApiEvent = {
  id: string;
  title: string;
  start: string; // ISO
  end: string;   // ISO
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // --- Auth cookie present? ---
    const cookies = parse(req.headers.cookie ?? "");
    const tokenCookie = cookies[TOKEN_COOKIE];
    if (!tokenCookie) return res.status(401).json({ error: "Not connected" });

    // --- Verify JWT & extract tokens (typed) ---
    const secret = new TextEncoder().encode(process.env.ENCRYPTION_KEY ?? "");
    const { payload }: { payload: JWTPayload & { tokens?: Credentials } } =
      await jwtVerify(tokenCookie, secret);

    const tokens = payload.tokens;
    if (!tokens) return res.status(401).json({ error: "Not connected" });

    // --- OAuth client ---
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    oauth2Client.setCredentials(tokens);

    // --- Optional time window (falls back to now -> open-ended) ---
    const timeMin =
      typeof req.query.timeMin === "string" ? req.query.timeMin : new Date().toISOString();
    const timeMax = typeof req.query.timeMax === "string" ? req.query.timeMax : undefined;

    // --- Fetch events ---
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const result = await calendar.events.list({
      calendarId: "primary",
      singleEvents: true,
      orderBy: "startTime",
      timeMin,
      timeMax,
      maxResults: 50,
    });

    // --- Map to API shape (guard missing dates) ---
    const items = (result.data.items ?? []) as calendar_v3.Schema$Event[];
    const events: ApiEvent[] = items
      .map((e): ApiEvent | null => {
        const id = e.id;
        const title = e.summary ?? "(No title)";
        const startStr = e.start?.dateTime ?? e.start?.date;
        const endStr = e.end?.dateTime ?? e.end?.date;
        if (!id || !startStr || !endStr) return null;

        const startISO = new Date(startStr).toISOString();
        const endISO = new Date(endStr).toISOString();

        return { id, title, start: startISO, end: endISO };
      })
      .filter((v): v is ApiEvent => v !== null);

    return res.status(200).json({ events });
  } catch (err: unknown) {
    // Normalize error
    const msg = typeof err === "object" && err !== null ? (err as any).message : String(err);
    const isInvalidGrant = msg?.toLowerCase?.().includes("invalid_grant");

    // If tokens are invalid, clear cookie and ask client to reconnect
    if (isInvalidGrant) {
      try {
        res.setHeader(
          "Set-Cookie",
          `${TOKEN_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; ${
            process.env.NODE_ENV === "production" ? "Secure;" : ""
          }`
        );
      } catch {}
      return res.status(401).json({ error: "Not connected" });
    }

    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch events" });
  }
}
