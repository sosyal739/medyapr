import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MedyaPR — Resmi Google Ads Destekli YouTube Klip PR',
  description:
    'Sanatçılar, yapım şirketleri ve markalar için 18+ yıllık tecrübeyle resmi Google Ads altyapılı YouTube video ve klip PR tanıtım hizmeti.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
