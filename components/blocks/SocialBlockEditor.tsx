'use client';

import type { SocialBlockProps, SocialPlatform } from '@/types/blocks';

interface Props {
  props: SocialBlockProps;
  onChange: (props: SocialBlockProps) => void;
}

const PLATFORMS: { id: SocialPlatform; label: string }[] = [
  { id: 'twitter', label: 'Twitter / X' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'github', label: 'GitHub' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'dribbble', label: 'Dribbble' },
  { id: 'behance', label: 'Behance' },
  { id: 'medium', label: 'Medium' },
  { id: 'other', label: 'Other' },
];

export default function SocialBlockEditor({ props, onChange }: Props) {
  const socials = props.socials || [];

  function addSocial() {
    if (socials.length >= 10) return;
    onChange({ ...props, socials: [...socials, { platform: 'twitter', url: '' }] });
  }

  function updateSocial(index: number, field: 'platform' | 'url', value: string) {
    const updated = [...socials];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...props, socials: updated });
  }

  function removeSocial(index: number) {
    onChange({ ...props, socials: socials.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-3">
      <label className="label">Social Links</label>

      {socials.map((s, i) => (
        <div key={i} className="flex items-start gap-2">
          <select
            className="input w-36 flex-shrink-0"
            value={s.platform}
            onChange={(e) => updateSocial(i, 'platform', e.target.value)}
          >
            {PLATFORMS.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
          <input
            className="input flex-1"
            value={s.url}
            onChange={(e) => updateSocial(i, 'url', e.target.value)}
            placeholder="https://..."
            type="url"
          />
          <button
            onClick={() => removeSocial(i)}
            className="mt-1.5 text-gray-400 hover:text-red-500 transition-colors text-lg"
            title="Remove"
          >
            ×
          </button>
        </div>
      ))}

      <button onClick={addSocial} disabled={socials.length >= 10} className="btn-secondary w-full text-sm">
        + Add Social Link
      </button>
    </div>
  );
}
