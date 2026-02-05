'use client';

import type { TestimonialBlockProps } from '@/types/blocks';

interface Props {
  props: TestimonialBlockProps;
  onChange: (props: TestimonialBlockProps) => void;
}

export default function TestimonialBlockEditor({ props, onChange }: Props) {
  return (
    <div className="space-y-3">
      <div>
        <label className="label">Quote</label>
        <textarea
          className="input min-h-[80px] resize-y"
          value={props.quote}
          onChange={(e) => onChange({ ...props, quote: e.target.value })}
          placeholder="This product changed my life..."
          maxLength={500}
        />
        <p className="mt-1 text-xs text-gray-400">{props.quote.length}/500 (min 10)</p>
      </div>
      <div>
        <label className="label">Name</label>
        <input
          className="input"
          value={props.name}
          onChange={(e) => onChange({ ...props, name: e.target.value })}
          placeholder="Jane Doe"
        />
      </div>
      <div>
        <label className="label">Role <span className="text-gray-400 font-normal">(optional)</span></label>
        <input
          className="input"
          value={props.role || ''}
          onChange={(e) => onChange({ ...props, role: e.target.value })}
          placeholder="CEO at Acme"
        />
      </div>
    </div>
  );
}
