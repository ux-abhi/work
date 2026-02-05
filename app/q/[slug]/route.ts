import { createServerClient } from '@/lib/supabase/server';
import { appUrl } from '@/lib/utils';

/** GET /q/:slug — QR scan tracking redirect */
export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const supabase = createServerClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('slug', params.slug)
    .single();

  if (!profile) {
    return new Response('Not found', { status: 404 });
  }

  // Log QR scan event asynchronously (fire and forget)
  void supabase.from('events').insert({
    profile_id: profile.id,
    type: 'qr_scan',
    user_agent: req.headers.get('user-agent'),
  });

  return Response.redirect(appUrl(`/u/${params.slug}`), 302);
}
