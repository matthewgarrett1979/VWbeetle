import { authenticator } from 'otplib';
import crypto from 'crypto';

const UPSTASH_URL = process.env.UPSTASH_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_TOKEN;
const SESSION_TTL = 86400; // 24 hours
const MAX_ATTEMPTS = 5;
const WINDOW_SECONDS = 60;

async function rateLimit(ip) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return false;
  const key = `auth-rate:${ip}`;
  try {
    // Atomic INCR + EXPIRE via pipeline
    const res = await fetch(`${UPSTASH_URL}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', key],
        ['EXPIRE', key, String(WINDOW_SECONDS)],
      ]),
    });
    const data = await res.json();
    const count = data[0]?.result ?? 0;
    return count > MAX_ATTEMPTS;
  } catch {
    return false; // Don't block if rate check fails
  }
}

async function createSession() {
  const sessionId = crypto.randomBytes(32).toString('hex');
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return sessionId;
  try {
    await fetch(`${UPSTASH_URL}/set/session:${sessionId}/1/ex/${SESSION_TTL}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });
  } catch {}
  return sessionId;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { token } = req.body ?? {};

  // Validate format before anything else
  if (!token || typeof token !== 'string' || !/^\d{6}$/.test(token)) {
    return res.status(400).json({ valid: false });
  }

  const secret = process.env.TOTP_SECRET;
  if (!secret) return res.status(500).json({ valid: false });

  // Rate limit by IP
  const ip =
    (req.headers['x-forwarded-for'] ?? '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown';
  const blocked = await rateLimit(ip);
  if (blocked) {
    return res.status(429).json({ valid: false, error: 'Too many attempts' });
  }

  try {
    const isValid = authenticator.verify({ token, secret });
    if (isValid) {
      const session = await createSession();
      return res.status(200).json({ valid: true, session });
    }
    return res.status(200).json({ valid: false });
  } catch {
    return res.status(200).json({ valid: false });
  }
}
