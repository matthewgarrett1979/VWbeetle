export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const folder = req.query.folder || 'beetle/gallery';
  const cloud = 'dnpglftl4';
  const apiKey = '434363825281813';
  const apiSecret = '1a2_pEqEnCRBL1riRamlJjbCbts';

  try {
    const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

    // Search API — works in both fixed and dynamic folder mode
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
        url: `https://res.cloudinary.com/${cloud}/image/upload/q_auto,f_auto,w_1400/${r.public_id}`,
        thumb: `https://res.cloudinary.com/${cloud}/image/upload/q_auto,f_auto,w_600/${r.public_id}`,
        full: `https://res.cloudinary.com/${cloud}/image/upload/q_auto,f_auto,w_1800/${r.public_id}`,
        public_id: r.public_id,
      }));
      return res.status(200).json({ images, count: images.length });
    }

    // Fallback — resources by prefix
    const prefixRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloud}/resources/image?prefix=${encodeURIComponent(folder + '/')}&type=upload&max_results=200`,
      { headers: { Authorization: `Basic ${credentials}` } }
    );

    if (!prefixRes.ok) {
      const errText = await prefixRes.text();
      return res.status(prefixRes.status).json({ error: errText, images: [] });
    }

    const data = await prefixRes.json();
    const images = (data.resources || []).map(r => ({
      url: `https://res.cloudinary.com/${cloud}/image/upload/q_auto,f_auto,w_1400/${r.public_id}`,
      thumb: `https://res.cloudinary.com/${cloud}/image/upload/q_auto,f_auto,w_600/${r.public_id}`,
      full: `https://res.cloudinary.com/${cloud}/image/upload/q_auto,f_auto,w_1800/${r.public_id}`,
      public_id: r.public_id,
    }));

    return res.status(200).json({ images, count: images.length });

  } catch (err) {
    return res.status(500).json({ error: err.message, images: [] });
  }
}
