const ALLOWED_FOLDERS = new Set([
  'beetle/gallery',
  'beetle/hero',
  'beetle/history',
  'beetle/archive',
  'beetle/1967',
]);

function addWatermark(url) {
  if (!url || !url.includes('/upload/')) return url;
  const watermark = 'l_text:Arial_24:vwbeetle66.com,co_rgb:FFFFFF,o_40,g_south_east,x_15,y_15';
  return url.replace('/upload/', `/upload/${watermark}/`);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://vwbeetle66.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const folder = req.query.folder || 'beetle/gallery';

  if (!ALLOWED_FOLDERS.has(folder)) {
    return res.status(400).json({ error: 'Invalid folder', images: [] });
  }

  const cloud = process.env.CLOUDINARY_CLOUD;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloud || !apiKey || !apiSecret) {
    return res.status(500).json({ error: 'Photos service not configured', images: [] });
  }

  try {
    const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

    const searchRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloud}/resources/search`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          expression: `folder:${folder}`,
          max_results: 200,
          sort_by: [{ created_at: 'desc' }],
        }),
      }
    );

    if (searchRes.ok) {
      const data = await searchRes.json();
      const images = (data.resources || []).map(r => ({
        url: addWatermark(`https://res.cloudinary.com/${cloud}/image/upload/q_auto,f_auto,w_1400/${r.public_id}`),
        thumb: addWatermark(`https://res.cloudinary.com/${cloud}/image/upload/q_auto,f_auto,w_600/${r.public_id}`),
        full: addWatermark(`https://res.cloudinary.com/${cloud}/image/upload/q_auto,f_auto,w_1800/${r.public_id}`),
        public_id: r.public_id,
        created_at: r.created_at,
      }));
      return res.status(200).json({ images, count: images.length });
    }

    // Fallback — prefix endpoint
    const prefixRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloud}/resources/image?prefix=${encodeURIComponent(folder + '/')}&type=upload&max_results=200`,
      { headers: { Authorization: `Basic ${credentials}` } }
    );

    if (!prefixRes.ok) {
      return res.status(500).json({ error: 'Failed to fetch photos', images: [] });
    }

    const data = await prefixRes.json();
    const images = (data.resources || [])
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map(r => ({
        url: addWatermark(`https://res.cloudinary.com/${cloud}/image/upload/q_auto,f_auto,w_1400/${r.public_id}`),
        thumb: addWatermark(`https://res.cloudinary.com/${cloud}/image/upload/q_auto,f_auto,w_600/${r.public_id}`),
        full: addWatermark(`https://res.cloudinary.com/${cloud}/image/upload/q_auto,f_auto,w_1800/${r.public_id}`),
        public_id: r.public_id,
        created_at: r.created_at,
      }));

    return res.status(200).json({ images, count: images.length });

  } catch {
    return res.status(500).json({ error: 'Failed to fetch photos', images: [] });
  }
}
