import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/** POST /api/profile — Create a new profile during onboarding */
export async function POST(req: Request) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { slug, display_name, persona } = body;

  // Check reserved slugs
  const { data: reserved } = await supabase
    .from('reserved_slugs')
    .select('slug')
    .eq('slug', slug)
    .single();

  if (reserved) {
    return NextResponse.json({ error: 'This URL is reserved' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('profiles')
    .insert({ user_id: user.id, slug, display_name, persona })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Slug already taken' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}

/** PATCH /api/profile — Update current user's profile */
export async function PATCH(req: Request) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const allowed = ['display_name', 'avatar_url', 'template_id', 'is_published'];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) updates[key] = body[key];
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
