'use client';

import type { LinkBlockProps } from '@/types/blocks';

interface Props {
  props: LinkBlockProps;
  onChange: (props: LinkBlockProps) => void;
}

export default function LinkBlockEditor({ props, onChange }: Props) {
  return (
    <div className="space-y-3">
      <div>
        <label className="label">Title</label>
        <input
          className="input"
          value={props.title}
          onChange={(e) => onChange({ ...props, title: e.target.value })}
          placeholder="My Website"
        />
      </div>
      <div>
        <label className="label">URL</label>
        <input
          className="input"
          value={props.url}
          onChange={(e) => onChange({ ...props, url: e.target.value })}
          placeholder="https://example.com"
          type="url"
        />
      </div>
      <div>
        <label className="label">Icon (emoji)</label>
        <input
          className="input w-20"
          value={props.icon || ''}
          onChange={(e) => onChange({ ...props, icon: e.target.value })}
          placeholder="🔗"
          maxLength={4}
        />
      </div>
      <div>
        <label className="label">Description <span className="text-gray-400 font-normal">(optional)</span></label>
        <input
          className="input"
          value={props.description || ''}
          onChange={(e) => onChange({ ...props, description: e.target.value })}
          placeholder="Short description"
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={props.isFeatured}
          onChange={(e) => onChange({ ...props, isFeatured: e.target.checked })}
          className="rounded border-gray-300"
        />
        Featured link
      </label>
    </div>
  );
}
