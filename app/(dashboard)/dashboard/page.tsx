import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LinksList } from '@/components/dashboard/links-list';
import { ProfilePreview } from '@/components/dashboard/profile-preview';
import { QuickStats } from '@/components/dashboard/quick-stats';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('profile_id', profile?.id)
    .order('position', { ascending: true });

  const { data: socialLinks } = await supabase
    .from('social_links')
    .select('*')
    .eq('profile_id', profile?.id)
    .order('position', { ascending: true });

  // Get click stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count: totalClicks } = await supabase
    .from('click_analytics')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', profile?.id);

  const { count: todayClicks } = await supabase
    .from('click_analytics')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', profile?.id)
    .gte('clicked_at', today.toISOString());

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">Manage your links and profile</p>
      </div>

      <QuickStats
        totalClicks={totalClicks || 0}
        todayClicks={todayClicks || 0}
        totalLinks={links?.length || 0}
        username={userData?.username || ''}
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LinksList
            links={links || []}
            socialLinks={socialLinks || []}
            profileId={profile?.id || ''}
          />
        </div>
        <div>
          <ProfilePreview
            user={userData}
            profile={profile}
            links={links || []}
            socialLinks={socialLinks || []}
          />
        </div>
      </div>
    </div>
  );
}
