'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Link } from '@/types';

interface Props {
  profileId: string;
  position: number;
  existingLink?: Link;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddLinkModal({ profileId, position, existingLink, onClose, onSuccess }: Props) {
  const [title, setTitle] = useState(existingLink?.title || '');
  const [url, setUrl] = useState(existingLink?.url || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    // Validate URL
    try {
      new URL(url);
    } catch {
      setError('Please enter a valid URL');
      setSaving(false);
      return;
    }

    const supabase = createClient();

    if (existingLink) {
      const { error } = await supabase
        .from('links')
        .update({ title, url })
        .eq('id', existingLink.id);

      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase.from('links').insert({
        profile_id: profileId,
        title,
        url,
        position,
        is_active: true,
      });

      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }
    }

    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            {existingLink ? 'Edit Link' : 'Add Link'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm text-gray-400">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input w-full bg-zinc-800 border-zinc-700 text-white"
              placeholder="My Website"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-400">URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="input w-full bg-zinc-800 border-zinc-700 text-white"
              placeholder="https://example.com"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-zinc-700 py-2 font-medium text-white hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-white py-2 font-medium text-black hover:bg-gray-200 disabled:opacity-50"
            >
              {saving ? 'Saving...' : existingLink ? 'Save Changes' : 'Add Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
