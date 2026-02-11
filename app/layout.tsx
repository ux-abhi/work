import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LinkCard - Your Digital Identity',
  description: 'Create your professional link-in-bio page with QR codes and Apple Wallet support.',
  keywords: ['link in bio', 'digital business card', 'qr code', 'apple wallet'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
