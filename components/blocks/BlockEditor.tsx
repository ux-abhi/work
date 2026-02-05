'use client';

import { useState } from 'react';
import type { Block, BlockType, BlockProps } from '@/types/blocks';
import { BLOCK_META } from '@/types/blocks';
import LinkBlockEditor from './LinkBlockEditor';
import TextBlockEditor from './TextBlockEditor';
import SocialBlockEditor from './SocialBlockEditor';
import ContactBlockEditor from './ContactBlockEditor';
import ProductBlockEditor from './ProductBlockEditor';
import TestimonialBlockEditor from './TestimonialBlockEditor';
import ResumeBlockEditor from './ResumeBlockEditor';
import PortfolioBlockEditor from './PortfolioBlockEditor';

interface Props {
  block: Block;
  onSave: (props: BlockProps) => void;
  onClose: () => void;
  saving: boolean;
}

/**
 * Slide-over panel for editing a block's props.
 * Delegates to the type-specific editor component.
 */
export default function BlockEditor({ block, onSave, onClose, saving }: Props) {
  const meta = BLOCK_META[block.type as BlockType];

  // Local state to hold edits before saving
  const [localProps, setLocalProps] = useState<BlockProps>(block.props);

  function handleSave() {
    onSave(localProps);
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose}>
      <div
        className="h-full w-full max-w-md overflow-y-auto bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-5 py-4">
          <div className="flex items-center gap-2">
            <span>{meta.icon}</span>
            <h3 className="text-base font-semibold">Edit {meta.label}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>

        {/* Editor body */}
        <div className="p-5">
          {block.type === 'link' && <LinkBlockEditor props={localProps as any} onChange={setLocalProps as any} />}
          {block.type === 'text' && <TextBlockEditor props={localProps as any} onChange={setLocalProps as any} />}
          {block.type === 'social' && <SocialBlockEditor props={localProps as any} onChange={setLocalProps as any} />}
          {block.type === 'contact' && <ContactBlockEditor props={localProps as any} onChange={setLocalProps as any} />}
          {block.type === 'product' && <ProductBlockEditor props={localProps as any} onChange={setLocalProps as any} />}
          {block.type === 'testimonial' && <TestimonialBlockEditor props={localProps as any} onChange={setLocalProps as any} />}
          {block.type === 'resume' && <ResumeBlockEditor props={localProps as any} onChange={setLocalProps as any} />}
          {block.type === 'portfolio' && <PortfolioBlockEditor props={localProps as any} onChange={setLocalProps as any} />}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t bg-white px-5 py-4">
          <div className="flex gap-2">
            <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
