'use client';

import type { BlockType, Persona } from '@/types/blocks';
import { BLOCK_META, PERSONA_BLOCKS } from '@/types/blocks';

interface Props {
  persona: Persona;
  onSelect: (type: BlockType) => void;
  onClose: () => void;
}

/** Grid modal for choosing which block type to add */
export default function BlockPicker({ persona, onSelect, onClose }: Props) {
  const available = PERSONA_BLOCKS[persona];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="card w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-4 text-base font-semibold">Add Block</h3>

        <div className="grid grid-cols-2 gap-2">
          {available.map((type) => {
            const meta = BLOCK_META[type];
            return (
              <button
                key={type}
                onClick={() => { onSelect(type); onClose(); }}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-100 p-4 text-center transition-all hover:border-brand-200 hover:bg-brand-50"
              >
                <span className="text-2xl">{meta.icon}</span>
                <span className="text-sm font-medium">{meta.label}</span>
                <span className="text-xs text-gray-400">{meta.description}</span>
              </button>
            );
          })}
        </div>

        <button onClick={onClose} className="btn-secondary mt-4 w-full text-sm">
          Cancel
        </button>
      </div>
    </div>
  );
}
