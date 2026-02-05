import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import PublicPage from '@/components/public-page/PublicPage';
import type { Metadata } from 'next';
import type { Block, Profile, Template } from '@/types/blocks';

interface PageProps {
  params: { slug: string };
}

/** Generate Open Graph metadata for social sharing */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = createServerClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, slug')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single();

  if (!profile) return { title: 'Not Found' };

  return {
    title: `${profile.display_name} — Linkks`,
    description: `Visit ${profile.display_name}'s smart page`,
    openGraph: {
      title: profile.display_name,
      description: `Visit ${profile.display_name}'s smart page`,
    },
  };
}

/** Public page — SSR rendered for fast loads and SEO */
export default async function PublicPageRoute({ params }: PageProps) {
  const supabase = createServerClient();

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single();

  if (!profileData) notFound();
  const profile = profileData as unknown as Profile;

  const { data: blocks } = await supabase
    .from('blocks')
    .select('*')
    .eq('profile_id', profile.id)
    .eq('is_active', true)
    .order('position');

  const { data: template } = await supabase
    .from('templates')
    .select('styles')
    .eq('id', profile.template_id)
    .single();

  const styles = (template?.styles || {
    background: '#ffffff',
    text: '#1a1a1a',
    accent: '#0066cc',
    cardBg: '#f5f5f5',
    radius: '8px',
  }) as Record<string, string>;

  // Log page view (fire and forget, don't block render)
  fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'page_view', profile_id: profile.id }),
  }).catch(() => {});

  return (
    <PublicPage
      profile={profile as unknown as Profile}
      blocks={(blocks || []) as unknown as Block[]}
      styles={styles}
    />
  );
}
