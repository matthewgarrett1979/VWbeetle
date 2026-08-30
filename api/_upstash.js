// Shared Upstash Redis configuration.
//
// TEMPORARY FALLBACK: these literals keep the site working until UPSTASH_URL
// and UPSTASH_TOKEN are set in the Vercel project settings. Once those env
// vars are configured, delete the `||` fallbacks below — no other code change
// is needed. The token in git history should be rotated at that point.
export const UPSTASH_URL =
  process.env.UPSTASH_URL || 'https://tight-magpie-91087.upstash.io';

export const UPSTASH_TOKEN =
  process.env.UPSTASH_TOKEN ||
  'gQAAAAAAAWPPAAIncDEyZTk4MjE1MTdmMmU0ODJiYTkzOWY5NTlmZDhkOTgyOXAxOTEwODc';

// Verify a session id issued by /api/auth. Write endpoints gate on this.
export async function verifySession(sessionId) {
  if (!sessionId) return false;
  try {
    const res = await fetch(`${UPSTASH_URL}/get/session:${sessionId}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });
    const data = await res.json();
    return data.result === '1';
  } catch {
    return false;
  }
}

// Extract a bearer token from an Authorization header.
export function bearerFrom(req) {
  const auth = req.headers.authorization ?? '';
  return auth.startsWith('Bearer ') ? auth.slice(7) : null;
}
