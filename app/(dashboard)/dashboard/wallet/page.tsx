'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getProfileUrl } from '@/lib/utils';

export default function WalletPage() {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      const { data: profileData } = await supabase
        .from('profiles')
        .select('bio')
        .eq('user_id', user.id)
        .single();

      if (userData) {
        setUsername(userData.username || '');
        setFullName(userData.full_name || '');
      }
      if (profileData) {
        setBio(profileData.bio || '');
      }
    }
    setLoading(false);
  };

  const downloadPass = async () => {
    setDownloading(true);
    try {
      const response = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName || username,
          username,
          bio,
          profileUrl: getProfileUrl(username),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate pass');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `linkcard-${username}.pkpass`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading pass:', error);
      alert('Failed to generate Apple Wallet pass. Please try again.');
    }
    setDownloading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Apple Wallet</h1>
        <p className="text-gray-400">Add your LinkCard to Apple Wallet</p>
      </div>

      <div className="mx-auto max-w-md">
        {/* Pass Preview */}
        <div className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black p-6 shadow-2xl">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-400">LinkCard</span>
            <div className="h-8 w-8 rounded-full bg-white/10" />
          </div>

          <div className="mb-6">
            <p className="text-xs uppercase tracking-wide text-gray-500">NAME</p>
            <p className="text-xl font-semibold text-white">{fullName || username}</p>
          </div>

          <div className="mb-6">
            <p className="text-xs uppercase tracking-wide text-gray-500">USERNAME</p>
            <p className="text-white">@{username}</p>
          </div>

          {bio && (
            <div className="mb-6">
              <p className="text-xs uppercase tracking-wide text-gray-500">BIO</p>
              <p className="text-sm text-gray-300 line-clamp-2">{bio}</p>
            </div>
          )}

          <div className="flex justify-center pt-4">
            <div className="rounded-lg bg-white p-3">
              <div className="h-24 w-24 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTMgM2gxOHYxOEgzVjN6Ii8+PC9zdmc+')] bg-contain" />
            </div>
          </div>
        </div>

        <button
          onClick={downloadPass}
          disabled={downloading}
          className="mt-6 w-full rounded-lg bg-white py-4 font-medium text-black hover:bg-gray-200 disabled:opacity-50"
        >
          {downloading ? 'Generating...' : 'Add to Apple Wallet'}
        </button>

        <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h3 className="mb-4 font-semibold text-white">How it works</h3>
          <ol className="space-y-2 text-sm text-gray-400 list-decimal list-inside">
            <li>Click &quot;Add to Apple Wallet&quot;</li>
            <li>Open the downloaded .pkpass file</li>
            <li>Tap &quot;Add&quot; in Apple Wallet</li>
            <li>Share your card with a tap</li>
          </ol>
        </div>

        <div className="mt-4 rounded-lg bg-yellow-500/10 p-4 text-sm text-yellow-500">
          <strong>Note:</strong> Apple Wallet passes require certificate configuration.
          Contact your administrator if the pass doesn&apos;t work.
        </div>
      </div>
    </div>
  );
}
