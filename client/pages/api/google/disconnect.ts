import type { NextApiRequest, NextApiResponse } from "next";

const TOKEN_COOKIE = "gcal_tokens";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Clear the OAuth token cookie to force re-auth
  res.setHeader(
    "Set-Cookie",
    `${TOKEN_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; ${
      process.env.NODE_ENV === "production" ? "Secure;" : ""
    }`
  );
  res.status(200).json({ ok: true });
}

