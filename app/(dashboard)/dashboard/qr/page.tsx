'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getProfileUrl } from '@/lib/utils';

export default function QRCodePage() {
  const [username, setUsername] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data } = await supabase
        .from('users')
        .select('username')
        .eq('id', user.id)
        .single();

      if (data?.username) {
        setUsername(data.username);
        generateQR(data.username);
      }
    }
    setLoading(false);
  };

  const generateQR = async (user: string) => {
    const profileUrl = getProfileUrl(user);
    const response = await fetch(`/api/qr?url=${encodeURIComponent(profileUrl)}`);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    setQrDataUrl(url);
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `linkcard-${username}-qr.png`;
    link.click();
  };

  const profileUrl = getProfileUrl(username);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">QR Code</h1>
        <p className="text-gray-400">Download your profile QR code</p>
      </div>

      <div className="mx-auto max-w-md">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center">
          {qrDataUrl ? (
            <div className="space-y-6">
              <div className="inline-block rounded-2xl bg-white p-4">
                <img
                  src={qrDataUrl}
                  alt="QR Code"
                  className="h-64 w-64"
                />
              </div>
              <div>
                <p className="text-sm text-gray-400">Scan to visit</p>
                <p className="mt-1 font-medium text-white">{profileUrl}</p>
              </div>
              <button
                onClick={downloadQR}
                className="w-full rounded-lg bg-white py-3 font-medium text-black hover:bg-gray-200"
              >
                Download PNG
              </button>
            </div>
          ) : (
            <div className="py-12 text-gray-400">
              Generating QR code...
            </div>
          )}
        </div>

        <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h3 className="mb-4 font-semibold text-white">Usage Tips</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• Print on business cards or flyers</li>
            <li>• Add to your email signature</li>
            <li>• Display at events or conferences</li>
            <li>• Include in presentations</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
