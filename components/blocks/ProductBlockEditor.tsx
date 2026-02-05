'use client';

import type { ProductBlockProps } from '@/types/blocks';

interface Props {
  props: ProductBlockProps;
  onChange: (props: ProductBlockProps) => void;
}

export default function ProductBlockEditor({ props, onChange }: Props) {
  return (
    <div className="space-y-3">
      <div>
        <label className="label">Product Title</label>
        <input
          className="input"
          value={props.title}
          onChange={(e) => onChange({ ...props, title: e.target.value })}
          placeholder="Premium Plan"
        />
      </div>
      <div>
        <label className="label">Price <span className="text-gray-400 font-normal">(optional)</span></label>
        <input
          className="input w-32"
          value={props.price || ''}
          onChange={(e) => onChange({ ...props, price: e.target.value })}
          placeholder="$29/mo"
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
        <label className="label">Description</label>
        <textarea
          className="input min-h-[80px] resize-y"
          value={props.description}
          onChange={(e) => onChange({ ...props, description: e.target.value })}
          placeholder="What the product does..."
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Button Text</label>
          <input
            className="input"
            value={props.ctaText}
            onChange={(e) => onChange({ ...props, ctaText: e.target.value })}
            placeholder="Buy Now"
          />
        </div>
        <div>
          <label className="label">Button URL</label>
          <input
            className="input"
            value={props.ctaUrl}
            onChange={(e) => onChange({ ...props, ctaUrl: e.target.value })}
            placeholder="https://..."
            type="url"
          />
        </div>
      </div>
    </div>
  );
}
