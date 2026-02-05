'use client';

import { useState } from 'react';
import type { Profile } from '@/types/blocks';
import QRModal from './QRModal';

interface Props {
  profile: Profile;
}

export default function Header({ profile }: Props) {
  const [qrOpen, setQrOpen] = useState(false);
  const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/u/${profile.slug}`;

  return (
    <header className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">{profile.display_name}</h1>
        <p className="text-xs text-gray-400">linkks.co/u/{profile.slug}</p>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => setQrOpen(true)} className="btn-secondary text-xs px-3 py-1.5">
          QR Code
        </button>
        <a
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary text-xs px-3 py-1.5"
        >
          Preview
        </a>
      </div>

      {qrOpen && <QRModal slug={profile.slug} onClose={() => setQrOpen(false)} />}
    </header>
  );
}
