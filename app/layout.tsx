import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Linkks — Your smart page, one link',
  description: 'Build a shareable smart page with modular content blocks, QR codes, and analytics.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
