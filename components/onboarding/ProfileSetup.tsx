'use client';

import { useState, useEffect } from 'react';

interface Props {
  displayName: string;
  slug: string;
  onNameChange: (v: string) => void;
  onSlugChange: (v: string) => void;
}

/** Step 2 of onboarding: set display name and choose a unique slug */
export default function ProfileSetup({ displayName, slug, onNameChange, onSlugChange }: Props) {
  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  // Debounced slug availability check
  useEffect(() => {
    if (slug.length < 4) {
      setSlugStatus('idle');
      return;
    }

    setSlugStatus('checking');
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/profile/check-slug?slug=${encodeURIComponent(slug)}`);
        const data = await res.json();
        setSlugStatus(data.available ? 'available' : 'taken');
      } catch {
        setSlugStatus('idle');
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [slug]);

  /** Auto-generate slug from display name */
  function handleNameChange(value: string) {
    onNameChange(value);
    const auto = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 50);
    if (auto.length >= 4) onSlugChange(auto);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Set up your page</h2>

      <div>
        <label htmlFor="displayName" className="label">Display Name</label>
        <input
          id="displayName"
          value={displayName}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="John Doe"
          className="input"
          maxLength={100}
        />
      </div>

      <div>
        <label htmlFor="slug" className="label">Your URL</label>
        <div className="flex items-center gap-0">
          <span className="rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500">
            linkks.co/u/
          </span>
          <input
            id="slug"
            value={slug}
            onChange={(e) => onSlugChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
            placeholder="your-name"
            className="input rounded-l-none"
            maxLength={50}
          />
        </div>

        {/* Availability indicator */}
        {slug.length >= 4 && (
          <p className={`mt-1.5 text-xs font-medium ${
            slugStatus === 'checking' ? 'text-gray-400' :
            slugStatus === 'available' ? 'text-green-600' :
            slugStatus === 'taken' ? 'text-red-500' : 'text-gray-400'
          }`}>
            {slugStatus === 'checking' && 'Checking availability...'}
            {slugStatus === 'available' && 'Available!'}
            {slugStatus === 'taken' && 'Already taken. Try another.'}
          </p>
        )}

        {slug.length > 0 && slug.length < 4 && (
          <p className="error-text">At least 4 characters</p>
        )}
      </div>
    </div>
  );
}
