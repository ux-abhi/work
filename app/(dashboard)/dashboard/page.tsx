import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import BlockList from '@/components/blocks/BlockList';
import type { Block, Persona, Profile } from '@/types/blocks';

/** Dashboard home — block management page */
export default async function DashboardPage() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profileRow } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!profileRow) redirect('/onboarding');
  // After redirect (which throws), TypeScript narrows to `never`.
  // Use an explicit cast to recover the correct type.
  const profile = profileRow as unknown as Profile;

  const { data: blocks } = await supabase
    .from('blocks')
    .select('*')
    .eq('profile_id', profile.id)
    .order('position');

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Content Blocks</h2>
        <span className="text-xs text-gray-400">{(blocks || []).length} blocks</span>
      </div>
      <BlockList
        profileId={profile.id}
        persona={profile.persona as Persona}
        initialBlocks={(blocks || []) as unknown as Block[]}
      />
    </div>
  );
}
