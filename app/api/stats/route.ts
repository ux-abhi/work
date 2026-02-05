import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/** GET /api/stats — Returns analytics summary for the current user's profile */
export async function GET() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!profile) return NextResponse.json({ error: 'No profile' }, { status: 404 });

  // Total counts by event type
  const { data: events } = await supabase
    .from('events')
    .select('type, created_at, block_id')
    .eq('profile_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(1000);

  const allEvents = events || [];

  const totalViews = allEvents.filter((e) => e.type === 'page_view').length;
  const totalClicks = allEvents.filter((e) => e.type === 'link_click').length;
  const totalScans = allEvents.filter((e) => e.type === 'qr_scan').length;

  // Last 7 days breakdown
  const now = new Date();
  const days: { date: string; views: number; clicks: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const dayEvents = allEvents.filter((e) => e.created_at.slice(0, 10) === dateStr);
    days.push({
      date: dateStr,
      views: dayEvents.filter((e) => e.type === 'page_view').length,
      clicks: dayEvents.filter((e) => e.type === 'link_click').length,
    });
  }

  // Top clicked blocks
  const clicksByBlock: Record<string, number> = {};
  allEvents
    .filter((e) => e.type === 'link_click' && e.block_id)
    .forEach((e) => {
      clicksByBlock[e.block_id!] = (clicksByBlock[e.block_id!] || 0) + 1;
    });

  const topBlocks = Object.entries(clicksByBlock)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([block_id, count]) => ({ block_id, count }));

  return NextResponse.json({
    totalViews,
    totalClicks,
    totalScans,
    days,
    topBlocks,
  });
}
