import { UPSTASH_URL, UPSTASH_TOKEN, verifySession, bearerFrom } from './_upstash.js';

const STORAGE_KEY = 'beetle-checklist-v1';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    try {
      const result = await fetch(`${UPSTASH_URL}/get/${STORAGE_KEY}`, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      });
      const data = await result.json();
      const checked = data.result ? JSON.parse(data.result) : {};
      return res.status(200).json({ checked });
    } catch {
      return res.status(500).json({ error: 'Failed to fetch' });
    }
  }

  if (req.method === 'POST') {
    if (!(await verifySession(bearerFrom(req)))) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { checked } = req.body ?? {};
    if (!checked || typeof checked !== 'object' || Array.isArray(checked)) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    try {
      const encoded = encodeURIComponent(JSON.stringify(checked));
      await fetch(`${UPSTASH_URL}/set/${STORAGE_KEY}/${encoded}`, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      });
      return res.status(200).json({ ok: true });
    } catch {
      return res.status(500).json({ error: 'Failed to save' });
    }
  }

  return res.status(405).end();
}
