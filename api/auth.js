import { authenticator } from 'otplib';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { token } = req.body;
  const secret = process.env.TOTP_SECRET;
  if (!secret) return res.status(500).json({ valid: false, error: 'No secret configured' });
  try {
    const isValid = authenticator.verify({ token, secret });
    res.status(200).json({ valid: isValid });
  } catch {
    res.status(200).json({ valid: false });
  }
}
