import { authenticator } from 'otplib';
import QRCode from 'qrcode';

export default async function handler(req, res) {
  if (process.env.TOTP_SECRET) {
    return res.status(403).json({ error: 'Setup already complete. Remove TOTP_SECRET from environment variables to reset.' });
  }

  const secret = authenticator.generateSecret();
  const otpauth = authenticator.keyuri('admin', 'VW Beetle 66', secret);
  const qrDataUrl = await QRCode.toDataURL(otpauth);

  res.status(200).json({ secret, qrDataUrl, otpauth });
}
