'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/types/blocks';

/** Settings page — edit profile, choose template, toggle publish */
export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
      if (data) setProfile(data as unknown as Profile);
    }
    load();
  }, []);

  async function handleSave() {
    if (!profile) return;
    setSaving(true);
    setMessage('');

    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        display_name: profile.display_name,
        template_id: profile.template_id,
        is_published: profile.is_published,
      }),
    });

    if (res.ok) {
      setMessage('Saved!');
    } else {
      const data = await res.json();
      setMessage(data.error || 'Failed to save');
    }
    setSaving(false);
    setTimeout(() => setMessage(''), 2000);
  }

  if (!profile) {
    return <p className="text-sm text-gray-400">Loading...</p>;
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h2 className="text-lg font-semibold">Settings</h2>

      <div className="card space-y-4">
        <div>
          <label className="label">Display Name</label>
          <input
            className="input"
            value={profile.display_name}
            onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
          />
        </div>

        <div>
          <label className="label">URL Slug</label>
          <p className="text-sm text-gray-500">linkks.co/u/{profile.slug}</p>
          <p className="text-xs text-gray-400 mt-1">Slug cannot be changed after creation.</p>
        </div>

        <div>
          <label className="label">Template</label>
          <div className="flex gap-2">
            {['minimal-light', 'minimal-dark'].map((t) => (
              <button
                key={t}
                onClick={() => setProfile({ ...profile, template_id: t })}
                className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all ${
                  profile.template_id === t
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-gray-100 text-gray-600 hover:border-gray-200'
                }`}
              >
                {t === 'minimal-light' ? '☀️ Light' : '🌙 Dark'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-3">
            <button
              onClick={() => setProfile({ ...profile, is_published: !profile.is_published })}
              className={`w-10 h-6 rounded-full transition-colors relative ${
                profile.is_published ? 'bg-green-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  profile.is_published ? 'translate-x-[18px]' : 'translate-x-0.5'
                }`}
              />
            </button>
            <span className="text-sm font-medium">
              {profile.is_published ? 'Published' : 'Unpublished'}
            </span>
          </label>
          <p className="mt-1 text-xs text-gray-400">
            {profile.is_published
              ? 'Your page is live and visible to anyone.'
              : 'Your page is private. Publish to make it accessible.'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        {message && (
          <span className={`text-sm font-medium ${message === 'Saved!' ? 'text-green-600' : 'text-red-500'}`}>
            {message}
          </span>
        )}
      </div>
    </div>
  );
}
