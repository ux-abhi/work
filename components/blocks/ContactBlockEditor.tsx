'use client';

import type { ContactBlockProps } from '@/types/blocks';

interface Props {
  props: ContactBlockProps;
  onChange: (props: ContactBlockProps) => void;
}

export default function ContactBlockEditor({ props, onChange }: Props) {
  return (
    <div className="space-y-3">
      <div>
        <label className="label">Email</label>
        <input
          className="input"
          value={props.email || ''}
          onChange={(e) => onChange({ ...props, email: e.target.value })}
          placeholder="hello@example.com"
          type="email"
        />
      </div>
      <div>
        <label className="label">Phone</label>
        <input
          className="input"
          value={props.phone || ''}
          onChange={(e) => onChange({ ...props, phone: e.target.value })}
          placeholder="+1 (555) 123-4567"
        />
      </div>
      <div>
        <label className="label">WhatsApp</label>
        <input
          className="input"
          value={props.whatsapp || ''}
          onChange={(e) => onChange({ ...props, whatsapp: e.target.value })}
          placeholder="+1 (555) 123-4567"
        />
      </div>
      <div>
        <label className="label">Location</label>
        <input
          className="input"
          value={props.location || ''}
          onChange={(e) => onChange({ ...props, location: e.target.value })}
          placeholder="San Francisco, CA"
        />
      </div>
      <p className="text-xs text-gray-400">At least one field is required.</p>
    </div>
  );
}
