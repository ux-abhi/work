const express = require('express');
const QRCode = require('qrcode');
const db = require('../db');

const router = express.Router();

/**
 * GET /api/qr/:slug
 * Generates a QR code PNG for the given smart link slug.
 * Query params:
 *   - size: QR code size in pixels (default: 400)
 *   - format: 'png' (default) or 'svg'
 */
router.get('/qr/:slug', async (req, res) => {
  const row = db.prepare('SELECT slug FROM smart_links WHERE slug = ?').get(req.params.slug);

  if (!row) {
    return res.status(404).json({ error: 'Smart link not found' });
  }

  const size = Math.min(parseInt(req.query.size) || 400, 1000);
  const format = req.query.format || 'png';

  // Build the full URL for the smart link
  const protocol = req.get('x-forwarded-proto') || req.protocol;
  const host = req.get('x-forwarded-host') || req.get('host');
  const smartLinkUrl = `${protocol}://${host}/s/${row.slug}`;

  const qrOptions = {
    width: size,
    margin: 2,
    color: {
      dark: '#1d1d1f',
      light: '#ffffff',
    },
    errorCorrectionLevel: 'M',
  };

  try {
    if (format === 'svg') {
      const svg = await QRCode.toString(smartLinkUrl, { ...qrOptions, type: 'svg' });
      res.type('svg').send(svg);
    } else {
      const buffer = await QRCode.toBuffer(smartLinkUrl, qrOptions);
      res.type('png').send(buffer);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

/**
 * GET /api/qr/:slug/dataurl
 * Returns QR code as a base64 data URL (for embedding in the frontend).
 */
router.get('/qr/:slug/dataurl', async (req, res) => {
  const row = db.prepare('SELECT slug FROM smart_links WHERE slug = ?').get(req.params.slug);

  if (!row) {
    return res.status(404).json({ error: 'Smart link not found' });
  }

  const protocol = req.get('x-forwarded-proto') || req.protocol;
  const host = req.get('x-forwarded-host') || req.get('host');
  const smartLinkUrl = `${protocol}://${host}/s/${row.slug}`;

  try {
    const dataUrl = await QRCode.toDataURL(smartLinkUrl, {
      width: 400,
      margin: 2,
      color: { dark: '#1d1d1f', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    });
    res.json({ dataUrl, url: smartLinkUrl });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

module.exports = router;
