import { UPSTASH_URL, UPSTASH_TOKEN, verifySession, bearerFrom } from './_upstash.js';

const BLOG_KEY = 'beetle-blog-posts';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    try {
      const result = await fetch(`${UPSTASH_URL}/get/${BLOG_KEY}`, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      });
      const data = await result.json();
      const posts = data.result ? JSON.parse(data.result) : [];
      return res.status(200).json({ posts });
    } catch {
      return res.status(500).json({ error: 'Failed to fetch' });
    }
  }

  if (req.method === 'POST') {
    if (!(await verifySession(bearerFrom(req)))) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { posts } = req.body ?? {};
    if (!Array.isArray(posts)) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    try {
      const encoded = encodeURIComponent(JSON.stringify(posts));
      await fetch(`${UPSTASH_URL}/set/${BLOG_KEY}/${encoded}`, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      });
      return res.status(200).json({ ok: true });
    } catch {
      return res.status(500).json({ error: 'Failed to save' });
    }
  }

  return res.status(405).end();
}
