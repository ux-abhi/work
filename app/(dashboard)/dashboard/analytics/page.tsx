import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { formatNumber } from '@/lib/utils';

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!profile) {
    redirect('/dashboard');
  }

  // Get all links for this profile
  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('profile_id', profile.id);

  // Get click analytics
  const { data: clickData } = await supabase
    .from('click_analytics')
    .select('*')
    .eq('profile_id', profile.id)
    .order('clicked_at', { ascending: false })
    .limit(1000);

  // Calculate stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const monthAgo = new Date(today);
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  const totalClicks = clickData?.length || 0;
  const todayClicks = clickData?.filter(c => new Date(c.clicked_at) >= today).length || 0;
  const weekClicks = clickData?.filter(c => new Date(c.clicked_at) >= weekAgo).length || 0;
  const monthClicks = clickData?.filter(c => new Date(c.clicked_at) >= monthAgo).length || 0;

  // Top links
  const linkClickCounts = new Map<string, number>();
  clickData?.forEach(click => {
    if (click.link_id) {
      linkClickCounts.set(click.link_id, (linkClickCounts.get(click.link_id) || 0) + 1);
    }
  });

  const topLinks = links
    ?.map(link => ({
      ...link,
      clicks: linkClickCounts.get(link.id) || 0,
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5);

  // Clicks by country
  const countryCounts = new Map<string, number>();
  clickData?.forEach(click => {
    const country = click.country || 'Unknown';
    countryCounts.set(country, (countryCounts.get(country) || 0) + 1);
  });

  const topCountries = Array.from(countryCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Last 7 days clicks
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const clicksByDay = last7Days.map(date => {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    const count = clickData?.filter(c => {
      const clickDate = new Date(c.clicked_at);
      return clickDate >= date && clickDate < nextDay;
    }).length || 0;
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      clicks: count,
    };
  });

  const maxDayClicks = Math.max(...clicksByDay.map(d => d.clicks), 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="text-gray-400">Track your link performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Clicks" value={formatNumber(totalClicks)} />
        <StatCard label="Today" value={formatNumber(todayClicks)} />
        <StatCard label="This Week" value={formatNumber(weekClicks)} />
        <StatCard label="This Month" value={formatNumber(monthClicks)} />
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="mb-6 text-lg font-semibold text-white">Last 7 Days</h2>
        <div className="flex h-48 items-end justify-between gap-2">
          {clicksByDay.map((day, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div className="relative w-full flex-1">
                <div
                  className="absolute bottom-0 w-full rounded-t bg-white transition-all"
                  style={{ height: `${(day.clicks / maxDayClicks) * 100}%`, minHeight: day.clicks > 0 ? '4px' : '0' }}
                />
              </div>
              <span className="text-xs text-gray-500">{day.date}</span>
              <span className="text-xs text-gray-400">{day.clicks}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Top Links */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Top Links</h2>
          {topLinks && topLinks.length > 0 ? (
            <div className="space-y-3">
              {topLinks.map((link, i) => (
                <div key={link.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">{i + 1}</span>
                    <span className="text-white truncate max-w-[200px]">{link.title}</span>
                  </div>
                  <span className="text-gray-400">{formatNumber(link.clicks)} clicks</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No click data yet</p>
          )}
        </div>

        {/* Top Countries */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Top Countries</h2>
          {topCountries.length > 0 ? (
            <div className="space-y-3">
              {topCountries.map(([country, count], i) => (
                <div key={country} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">{i + 1}</span>
                    <span className="text-white">{country}</span>
                  </div>
                  <span className="text-gray-400">{formatNumber(count)} clicks</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No location data yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="mt-1 text-3xl font-bold text-white">{value}</p>
    </div>
  );
}
