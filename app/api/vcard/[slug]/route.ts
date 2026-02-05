import { createServerClient } from '@/lib/supabase/server';
import { generateVCard } from '@/lib/vcard';
import { appUrl } from '@/lib/utils';
import type { ContactBlockProps } from '@/types/blocks';

/** GET /api/vcard/:slug — Download a .vcf contact card */
export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const supabase = createServerClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single();

  if (!profile) {
    return new Response('Not found', { status: 404 });
  }

  // Find the contact block
  const { data: blocks } = await supabase
    .from('blocks')
    .select('props')
    .eq('profile_id', profile.id)
    .eq('type', 'contact')
    .eq('is_active', true)
    .limit(1);

  const contact = (blocks?.[0]?.props || {}) as ContactBlockProps;

  const vcard = generateVCard({
    displayName: profile.display_name,
    email: contact.email,
    phone: contact.phone,
    location: contact.location,
    url: appUrl(`/u/${params.slug}`),
  });

  return new Response(vcard, {
    headers: {
      'Content-Type': 'text/vcard',
      'Content-Disposition': `attachment; filename="${params.slug}.vcf"`,
    },
  });
}
