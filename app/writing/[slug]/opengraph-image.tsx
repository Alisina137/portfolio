import { notFound } from 'next/navigation';
import { getPublicWriting } from '@/lib/writing';
import { renderOgCard, ogContentType } from '@/lib/og-card';
export const size = { width: 1200, height: 630 };
export const contentType = ogContentType;
export const alt = 'An engineering article by Alisina Sarwari';
export const dynamicParams = false;
export function generateStaticParams() { return getPublicWriting().map(post => ({ slug: post.slug })); }
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPublicWriting().find(p => p.slug === slug);
  if (!post) notFound();
  return renderOgCard({ eyebrow: post.category, heading: post.title, description: post.excerpt, label: 'WRITING / ALISINA SARWARI' });
}
