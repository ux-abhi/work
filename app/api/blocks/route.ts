import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/** POST /api/blocks — Create a new block */
export async function POST(req: Request) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { profile_id, type, props } = body;

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

  // Get next position
  const { count } = await supabase
    .from('blocks')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', profile_id);

  const { data, error } = await supabase
    .from('blocks')
    .insert({
      profile_id,
      type,
      props: props || {},
      position: (count || 0),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
