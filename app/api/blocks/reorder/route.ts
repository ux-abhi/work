import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/** POST /api/blocks/reorder — Persist new block ordering */
export async function POST(req: Request) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { profile_id, order } = await req.json();

  // Verify ownership
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', profile_id)
    .eq('user_id', user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  // Update each block's position
  const updates = (order as string[]).map((id: string, index: number) =>
    supabase
      .from('blocks')
      .update({ position: index })
      .eq('id', id)
      .eq('profile_id', profile_id)
  );

  await Promise.all(updates);

  return NextResponse.json({ ok: true });
}
