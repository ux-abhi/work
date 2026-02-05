'use client';

import type { PortfolioBlockProps } from '@/types/blocks';

interface Props {
  props: PortfolioBlockProps;
  onChange: (props: PortfolioBlockProps) => void;
}

export default function PortfolioBlockEditor({ props, onChange }: Props) {
  function handleTagsChange(value: string) {
    const tags = value.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 5);
    onChange({ ...props, tags });
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="label">Project Title</label>
        <input
          className="input"
          value={props.title}
          onChange={(e) => onChange({ ...props, title: e.target.value })}
          placeholder="My Cool Project"
        />
      </div>
      <div>
        <label className="label">Project URL</label>
        <input
          className="input"
          value={props.url}
          onChange={(e) => onChange({ ...props, url: e.target.value })}
          placeholder="https://project.com"
          type="url"
        />
      </div>
      <div>
        <label className="label">Image URL <span className="text-gray-400 font-normal">(optional)</span></label>
        <input
          className="input"
          value={props.image || ''}
          onChange={(e) => onChange({ ...props, image: e.target.value })}
          placeholder="https://..."
          type="url"
        />
      </div>
      <div>
        <label className="label">Tags <span className="text-gray-400 font-normal">(comma-separated, max 5)</span></label>
        <input
          className="input"
          value={(props.tags || []).join(', ')}
          onChange={(e) => handleTagsChange(e.target.value)}
          placeholder="React, TypeScript, Design"
        />
      </div>
    </div>
  );
}
