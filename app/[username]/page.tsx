import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getTheme } from '@/lib/themes';
import { getProfileUrl } from '@/lib/utils';
import { PublicProfile } from '@/components/public/public-profile';

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createClient();

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (!user) {
    return { title: 'Not Found' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('bio')
    .eq('user_id', user.id)
    .single();

  return {
    title: `${user.full_name || user.username} | LinkCard`,
    description: profile?.bio || `Check out ${user.full_name || user.username}'s links`,
    openGraph: {
      title: `${user.full_name || user.username} | LinkCard`,
      description: profile?.bio || `Check out ${user.full_name || user.username}'s links`,
      url: getProfileUrl(username),
      type: 'profile',
    },
    twitter: {
      card: 'summary',
      title: `${user.full_name || user.username} | LinkCard`,
      description: profile?.bio || `Check out ${user.full_name || user.username}'s links`,
    },
  };
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const supabase = await createClient();

  // Get user
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (!user) {
    notFound();
  }

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!profile || !profile.is_active) {
    notFound();
  }

  // Get links
  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('profile_id', profile.id)
    .eq('is_active', true)
    .order('position', { ascending: true });

  // Get social links
  const { data: socialLinks } = await supabase
    .from('social_links')
    .select('*')
    .eq('profile_id', profile.id)
    .order('position', { ascending: true });

  const theme = getTheme(profile.theme as 'dark' | 'modern' | 'vintage' | 'corporate');

  return (
    <PublicProfile
      user={user}
      profile={profile}
      links={links || []}
      socialLinks={socialLinks || []}
      theme={theme}
    />
  );
}
