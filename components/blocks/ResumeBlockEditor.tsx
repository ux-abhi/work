'use client';

import type { ResumeBlockProps } from '@/types/blocks';

interface Props {
  props: ResumeBlockProps;
  onChange: (props: ResumeBlockProps) => void;
}

export default function ResumeBlockEditor({ props, onChange }: Props) {
  return (
    <div className="space-y-3">
      <div>
        <label className="label">Resume URL</label>
        <input
          className="input"
          value={props.resumeUrl}
          onChange={(e) => onChange({ ...props, resumeUrl: e.target.value })}
          placeholder="https://drive.google.com/..."
          type="url"
        />
        <p className="mt-1 text-xs text-gray-400">Link to your hosted resume (PDF, Google Drive, etc.)</p>
      </div>
      <div>
        <label className="label">Button Label</label>
        <input
          className="input"
          value={props.label}
          onChange={(e) => onChange({ ...props, label: e.target.value })}
          placeholder="Download Resume"
        />
      </div>
    </div>
  );
}
