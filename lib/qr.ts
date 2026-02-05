import QRCode from 'qrcode';

/** Generate a QR code as a PNG Uint8Array */
export async function generateQRPng(url: string, size = 300): Promise<Uint8Array> {
  const buf = await QRCode.toBuffer(url, {
    width: Math.min(size, 1000),
    margin: 2,
    color: { dark: '#000000', light: '#ffffff' },
  });
  return new Uint8Array(buf);
}

/** Generate a QR code as an SVG string */
export async function generateQRSvg(url: string, size = 300): Promise<string> {
  return QRCode.toString(url, {
    type: 'svg',
    width: Math.min(size, 1000),
    margin: 2,
  });
}

/** Generate a QR code as a data URL (for embedding in img tags) */
export async function generateQRDataUrl(url: string, size = 300): Promise<string> {
  return QRCode.toDataURL(url, {
    width: Math.min(size, 1000),
    margin: 2,
  });
}
