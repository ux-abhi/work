'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Persona } from '@/types/blocks';
import PersonaSelector from './PersonaSelector';
import ProfileSetup from './ProfileSetup';
import { createClient } from '@/lib/supabase/client';

/**
 * Two-step onboarding:
 * 1. Choose persona (individual / business)
 * 2. Set display name + slug
 */
export default function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const [persona, setPersona] = useState<Persona | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleComplete() {
    if (!persona || !displayName || slug.length < 4) return;
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, display_name: displayName, persona }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create profile');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  }

  return (
    <div className="card max-w-md mx-auto">
      {/* Progress bar */}
      <div className="mb-6 flex gap-2">
        {[1, 2].map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-colors ${
              s <= step ? 'bg-brand-500' : 'bg-gray-100'
            }`}
          />
        ))}
      </div>

      {step === 1 && (
        <>
          <PersonaSelector value={persona} onChange={setPersona} />
          <button
            onClick={() => setStep(2)}
            disabled={!persona}
            className="btn-primary mt-6 w-full"
          >
            Continue
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <ProfileSetup
            displayName={displayName}
            slug={slug}
            onNameChange={setDisplayName}
            onSlugChange={setSlug}
          />

          {error && <p className="error-text mt-2">{error}</p>}

          <div className="mt-6 flex gap-3">
            <button onClick={() => setStep(1)} className="btn-secondary flex-1">
              Back
            </button>
            <button
              onClick={handleComplete}
              disabled={loading || !displayName || slug.length < 4}
              className="btn-primary flex-1"
            >
              {loading ? 'Creating...' : 'Create Page'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
