import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/** PATCH /api/blocks/:id — Update a block's props or active state */
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const updates: { props?: unknown; is_active?: boolean } = {};

  if ('props' in body) updates.props = body.props;
  if ('is_active' in body) updates.is_active = body.is_active;

  const { data, error } = await supabase
    .from('blocks')
    .update(updates)
    .eq('id', params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

/** DELETE /api/blocks/:id — Remove a block */
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { error } = await supabase
    .from('blocks')
    .delete()
    .eq('id', params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
