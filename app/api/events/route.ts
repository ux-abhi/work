import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { hashIP } from '@/lib/utils';

/** POST /api/events — Track a page view, link click, or QR scan */
export async function POST(req: Request) {
  const body = await req.json();
  const { type, profile_id, block_id, metadata } = body;

  if (!type || !profile_id) {
    return NextResponse.json({ error: 'type and profile_id required' }, { status: 400 });
  }

  const allowedTypes = ['page_view', 'link_click', 'qr_scan'];
  if (!allowedTypes.includes(type)) {
    return NextResponse.json({ error: 'Invalid event type' }, { status: 400 });
  }

  // Hash the IP for privacy
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
  const ipHash = hashIP(ip);

  const supabase = createServerClient();

  const { error } = await supabase.from('events').insert({
    profile_id,
    type,
    block_id: block_id || null,
    metadata: metadata || {},
    ip_hash: ipHash,
    user_agent: req.headers.get('user-agent') || null,
    referrer: req.headers.get('referer') || null,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
