import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/** GET /api/profile/check-slug?slug=xxx — Check slug availability */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get('slug');

  if (!slug || slug.length < 4) {
    return NextResponse.json({ available: false, reason: 'Too short' });
  }

  const supabase = createServerClient();

  // Check reserved list
  const { data: reserved } = await supabase
    .from('reserved_slugs')
    .select('slug')
    .eq('slug', slug)
    .single();

  if (reserved) {
    return NextResponse.json({ available: false, reason: 'Reserved' });
  }

  // Check existing profiles
  const { data: existing } = await supabase
    .from('profiles')
    .select('slug')
    .eq('slug', slug)
    .single();

  return NextResponse.json({ available: !existing });
}
