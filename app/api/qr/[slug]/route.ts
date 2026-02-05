import { NextResponse } from 'next/server';
import { generateQRPng, generateQRSvg, generateQRDataUrl } from '@/lib/qr';
import { appUrl } from '@/lib/utils';

/**
 * GET /api/qr/:slug — Generate a QR code for a public page.
 * Query params:
 *   format: 'png' (default) | 'svg' | 'dataurl'
 *   size: number (default 300, max 1000)
 */
export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const url = new URL(req.url);
  const format = url.searchParams.get('format') || 'png';
  const size = Math.min(parseInt(url.searchParams.get('size') || '300', 10) || 300, 1000);

  // QR points to the tracking redirect URL
  const targetUrl = appUrl(`/q/${params.slug}`);

  if (format === 'svg') {
    const svg = await generateQRSvg(targetUrl, size);
    return new Response(svg, {
      headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=3600' },
    });
  }

  if (format === 'dataurl') {
    const dataUrl = await generateQRDataUrl(targetUrl, size);
    return NextResponse.json({ dataUrl });
  }

  // Default: PNG
  const png = await generateQRPng(targetUrl, size);
  return new Response(png as unknown as BodyInit, {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=3600' },
  });
}
