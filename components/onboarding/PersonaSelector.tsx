'use client';

import type { Persona } from '@/types/blocks';

interface Props {
  value: Persona | null;
  onChange: (p: Persona) => void;
}

const personas: { id: Persona; label: string; icon: string; desc: string }[] = [
  { id: 'individual', label: 'Individual', icon: '👤', desc: 'Personal links, portfolio, resume' },
  { id: 'business', label: 'Business', icon: '🏢', desc: 'Products, testimonials, team links' },
];

/** Step 1 of onboarding: choose individual or business persona */
export default function PersonaSelector({ value, onChange }: Props) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">What best describes you?</h2>
      <p className="text-sm text-gray-500">This determines which content blocks are available.</p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {personas.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onChange(p.id)}
            className={`flex flex-col items-center gap-2 rounded-xl border-2 p-5 transition-all hover:border-brand-400 ${
              value === p.id
                ? 'border-brand-500 bg-brand-50'
                : 'border-gray-100 bg-white'
            }`}
          >
            <span className="text-3xl">{p.icon}</span>
            <span className="text-sm font-semibold">{p.label}</span>
            <span className="text-xs text-gray-500 text-center">{p.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
