'use client';

import type { TextBlockProps } from '@/types/blocks';

interface Props {
  props: TextBlockProps;
  onChange: (props: TextBlockProps) => void;
}

export default function TextBlockEditor({ props, onChange }: Props) {
  return (
    <div className="space-y-3">
      <div>
        <label className="label">Heading <span className="text-gray-400 font-normal">(optional)</span></label>
        <input
          className="input"
          value={props.heading || ''}
          onChange={(e) => onChange({ ...props, heading: e.target.value })}
          placeholder="Section Title"
        />
      </div>
      <div>
        <label className="label">Body</label>
        <textarea
          className="input min-h-[100px] resize-y"
          value={props.body}
          onChange={(e) => onChange({ ...props, body: e.target.value })}
          placeholder="Write something..."
          maxLength={2000}
        />
        <p className="mt-1 text-xs text-gray-400">{props.body.length}/2000</p>
      </div>
    </div>
  );
}
