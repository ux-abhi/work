'use client';

import { useEffect, useState } from 'react';

interface Props {
  slug: string;
  onClose: () => void;
}

/** Modal that displays a QR code for the public page with download option */
export default function QRModal({ slug, onClose }: Props) {
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    fetch(`/api/qr/${slug}?format=dataurl`)
      .then((r) => r.json())
      .then((d) => setQrDataUrl(d.dataUrl))
      .catch(() => {});
  }, [slug]);

  function handleDownload() {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `linkks-${slug}-qr.png`;
    a.click();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="card w-full max-w-xs text-center" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-4 text-base font-semibold">QR Code</h3>

        {qrDataUrl ? (
          <img src={qrDataUrl} alt="QR Code" className="mx-auto h-48 w-48 rounded-lg" />
        ) : (
          <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-lg bg-gray-50 text-sm text-gray-400">
            Loading...
          </div>
        )}

        <p className="mt-3 text-xs text-gray-400">Scan to open linkks.co/u/{slug}</p>

        <div className="mt-4 flex gap-2">
          <button onClick={onClose} className="btn-secondary flex-1 text-xs">Close</button>
          <button onClick={handleDownload} disabled={!qrDataUrl} className="btn-primary flex-1 text-xs">
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
