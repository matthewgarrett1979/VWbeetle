const UPSTASH_URL = process.env.UPSTASH_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_TOKEN;
const BLOG_KEY = 'beetle-blog-posts';

async function verifySession(sessionId) {
  if (!sessionId || !UPSTASH_URL || !UPSTASH_TOKEN) return false;
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

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return res.status(500).json({ error: 'Storage not configured' });
  }

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
    const auth = req.headers.authorization ?? '';
    const sessionId = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!(await verifySession(sessionId))) {
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
