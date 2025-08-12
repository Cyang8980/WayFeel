import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import { SignJWT } from "jose";
import { serialize } from "cookie";

const TOKEN_COOKIE = "gcal_tokens";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const code = req.query.code as string;
    if (!code) {
      return res.status(400).send("Missing code");
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const { tokens } = await oauth2Client.getToken(code);

    const secret = new TextEncoder().encode(process.env.ENCRYPTION_KEY);
    const jwt = await new SignJWT({ tokens })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30d")
      .sign(secret);

    res.setHeader(
      "Set-Cookie",
      serialize(TOKEN_COOKIE, jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      })
    );

    res.redirect("/calendar"); // back to your calendar page
  } catch (err) {
    console.error(err);
    res.status(500).send("OAuth callback failed");
  }
}
