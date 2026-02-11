import QRCode from 'qrcode';

export async function generateQRCode(url: string): Promise<Uint8Array> {
  const buffer = await QRCode.toBuffer(url, {
    type: 'png',
    width: 512,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
    errorCorrectionLevel: 'H',
  });
  return new Uint8Array(buffer);
}

export async function generateQRCodeDataURL(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    width: 512,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
    errorCorrectionLevel: 'H',
  });
}
