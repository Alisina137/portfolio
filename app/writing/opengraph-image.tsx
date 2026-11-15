import { notFound } from 'next/navigation';
import { writingIsLive } from '@/lib/writing';
import { renderOgCard, ogContentType } from '@/lib/og-card';
export const size = { width: 1200, height: 630 };
export const contentType = ogContentType;
export const alt = 'Engineering notes by Alisina Sarwari';
export default function Image() {
  if (!writingIsLive()) notFound();
  return renderOgCard({ eyebrow: 'ENGINEERING NOTES', heading: 'Ideas worth writing down', description: 'Practical notes on product engineering and software architecture.' });
}
