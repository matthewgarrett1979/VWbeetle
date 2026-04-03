export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const folder = req.query.folder || 'beetle/gallery';
  const cloud = 'dnpglftl4';
  const apiKey = '434363825281813';
  const apiSecret = '1a2_pEqEnCRBL1riRamlJjbCbts';

  try {
    const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
    const url = `https://api.cloudinary.com/v1_1/${cloud}/resources/image?prefix=${encodeURIComponent(folder)}&type=upload&max_results=200`;

    const response = await fetch(url, {
      headers: { Authorization: `Basic ${credentials}` },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Cloudinary error', status: response.status });
    }

    const data = await response.json();
    const images = (data.resources || []).map(r => ({
      url: `https://res.cloudinary.com/${cloud}/image/upload/q_auto,f_auto,w_1400/${r.public_id}`,
      thumb: `https://res.cloudinary.com/${cloud}/image/upload/q_auto,f_auto,w_600/${r.public_id}`,
      full: `https://res.cloudinary.com/${cloud}/image/upload/q_auto,f_auto,w_1800/${r.public_id}`,
      public_id: r.public_id,
    }));

    res.status(200).json({ images });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
