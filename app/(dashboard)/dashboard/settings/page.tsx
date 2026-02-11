'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User, Profile, Theme } from '@/types';
import { themes } from '@/lib/themes';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Form state
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      router.push('/login');
      return;
    }

    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', authUser.id)
      .single();

    if (userData) {
      setUser(userData);
      setUsername(userData.username || '');
      setFullName(userData.full_name || '');
    }

    if (profileData) {
      setProfile(profileData);
      setBio(profileData.bio || '');
      setTheme(profileData.theme as Theme || 'dark');
    }

    setLoading(false);
  };

  const handleSave = async () => {
    if (!user || !profile) return;
    setSaving(true);
    setMessage('');

    const supabase = createClient();

    // Update user
    const { error: userError } = await supabase
      .from('users')
      .update({ username, full_name: fullName })
      .eq('id', user.id);

    if (userError) {
      setMessage(`Error: ${userError.message}`);
      setSaving(false);
      return;
    }

    // Update profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ bio, theme })
      .eq('id', profile.id);

    if (profileError) {
      setMessage(`Error: ${profileError.message}`);
      setSaving(false);
      return;
    }

    setMessage('Settings saved successfully!');
    setSaving(false);
    router.refresh();
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
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400">Manage your profile settings</p>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="mb-6 text-xl font-semibold text-white">Profile Information</h2>

        {message && (
          <div className={`mb-4 rounded-lg p-3 text-sm ${
            message.startsWith('Error') ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
          }`}>
            {message}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-gray-400">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
              className="input w-full bg-zinc-800 border-zinc-700 text-white"
              placeholder="username"
            />
            <p className="mt-1 text-xs text-gray-500">
              Your profile URL: linkcard.com/{username}
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-400">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input w-full bg-zinc-800 border-zinc-700 text-white"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-400">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="input w-full bg-zinc-800 border-zinc-700 text-white min-h-[100px] resize-none"
              placeholder="Tell people about yourself..."
              maxLength={500}
            />
            <p className="mt-1 text-xs text-gray-500">{bio.length}/500 characters</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="mb-6 text-xl font-semibold text-white">Theme</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(themes) as Theme[]).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`rounded-lg border-2 p-4 text-left transition-all ${
                theme === t
                  ? 'border-white'
                  : 'border-zinc-700 hover:border-zinc-600'
              }`}
            >
              <div className={`mb-2 h-20 rounded-lg ${themes[t].background}`} />
              <p className="font-medium text-white">{themes[t].name}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-white px-6 py-2 font-medium text-black hover:bg-gray-200 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
