const express = require('express');
const db = require('../db');
const templates = require('../templates');

const router = express.Router();

/**
 * GET /api/wallet/:slug
 *
 * Generates an Apple Wallet pass manifest for the smart link.
 *
 * NOTE: Real Apple Wallet .pkpass files require:
 * 1. An Apple Developer account
 * 2. A Pass Type ID certificate
 * 3. Signing the pass with the certificate
 *
 * This endpoint returns the pass.json manifest that would be
 * included in a .pkpass bundle. In production, you'd use a
 * service like passkit-generator with proper certificates to
 * create the signed .pkpass file.
 *
 * For demo purposes, this returns a downloadable JSON manifest
 * and instructions for creating the actual pass.
 */
router.get('/wallet/:slug', (req, res) => {
  const row = db.prepare('SELECT * FROM smart_links WHERE slug = ?').get(req.params.slug);

  if (!row) {
    return res.status(404).json({ error: 'Smart link not found' });
  }

  const links = JSON.parse(row.links);
  const template = templates.find((t) => t.id === row.template);

  const protocol = req.get('x-forwarded-proto') || req.protocol;
  const host = req.get('x-forwarded-host') || req.get('host');
  const smartLinkUrl = `${protocol}://${host}/s/${row.slug}`;

  // Apple Wallet pass.json manifest
  // See: https://developer.apple.com/documentation/walletpasses
  const passManifest = {
    formatVersion: 1,
    passTypeIdentifier: 'pass.com.smartlink.card',
    serialNumber: row.id,
    teamIdentifier: 'TEAM_ID',
    organizationName: 'SmartLink',
    description: row.title,
    logoText: 'SmartLink',
    foregroundColor: template?.css.textColor || '#ffffff',
    backgroundColor: template?.preview.background || '#0071e3',
    generic: {
      primaryFields: [
        {
          key: 'title',
          label: 'SMART LINK',
          value: row.title,
        },
      ],
      secondaryFields: [
        {
          key: 'links',
          label: 'LINKS',
          value: `${links.length} link${links.length !== 1 ? 's' : ''}`,
        },
        {
          key: 'created',
          label: 'CREATED',
          value: new Date(row.created_at).toLocaleDateString(),
        },
      ],
      auxiliaryFields: links.slice(0, 4).map((link, i) => ({
        key: `link_${i}`,
        label: link.title || `Link ${i + 1}`,
        value: link.url,
      })),
      backFields: links.map((link, i) => ({
        key: `back_link_${i}`,
        label: link.title || `Link ${i + 1}`,
        value: link.url,
        attributedValue: `<a href="${link.url}">${link.title || link.url}</a>`,
      })),
    },
    barcode: {
      message: smartLinkUrl,
      format: 'PKBarcodeFormatQR',
      messageEncoding: 'iso-8859-1',
    },
    barcodes: [
      {
        message: smartLinkUrl,
        format: 'PKBarcodeFormatQR',
        messageEncoding: 'iso-8859-1',
      },
    ],
  };

  res.json({
    manifest: passManifest,
    smartLinkUrl,
    note: 'To generate a signed .pkpass file, use this manifest with an Apple Developer certificate and a pass signing tool like passkit-generator.',
  });
});

module.exports = router;
