'use client';

import { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Block, BlockType, BlockProps, Persona } from '@/types/blocks';
import { BLOCK_META, DEFAULT_BLOCK_PROPS } from '@/types/blocks';
import BlockEditor from './BlockEditor';
import BlockPicker from './BlockPicker';

interface Props {
  profileId: string;
  persona: Persona;
  initialBlocks: Block[];
}

/** Sortable block item in the list */
function SortableBlock({
  block,
  onEdit,
  onToggle,
  onDelete,
}: {
  block: Block;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const meta = BLOCK_META[block.type as BlockType];
  const title = getBlockTitle(block);

  return (
    <div ref={setNodeRef} style={style} className="card flex items-center gap-3 mb-2">
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-gray-300 hover:text-gray-500"
        title="Drag to reorder"
      >
        ⠿
      </button>

      {/* Icon + info */}
      <span className="text-lg">{meta.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{title || `Untitled ${meta.label}`}</p>
        <p className="text-xs text-gray-400">{meta.label}</p>
      </div>

      {/* Active toggle */}
      <button
        onClick={onToggle}
        className={`w-9 h-5 rounded-full transition-colors relative ${
          block.is_active ? 'bg-brand-500' : 'bg-gray-200'
        }`}
        title={block.is_active ? 'Active' : 'Inactive'}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
            block.is_active ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </button>

      {/* Edit */}
      <button onClick={onEdit} className="text-xs text-brand-600 hover:text-brand-700 font-medium">
        Edit
      </button>

      {/* Delete */}
      <button onClick={onDelete} className="text-xs text-gray-400 hover:text-red-500 transition-colors">
        ×
      </button>
    </div>
  );
}

/** Extract a display title from any block's props */
function getBlockTitle(block: Block): string {
  const p = block.props as Record<string, unknown>;
  return (p.title || p.heading || p.label || p.name || p.quote || '') as string;
}

export default function BlockList({ profileId, persona, initialBlocks }: Props) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [showPicker, setShowPicker] = useState(false);
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // --- Add block ---
  const handleAddBlock = useCallback(async (type: BlockType) => {
    const defaultProps = DEFAULT_BLOCK_PROPS[type];
    const res = await fetch('/api/blocks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile_id: profileId, type, props: defaultProps }),
    });
    if (res.ok) {
      const newBlock = await res.json();
      setBlocks((prev) => [...prev, newBlock]);
      setEditingBlock(newBlock);
    }
  }, [profileId]);

  // --- Save block props ---
  const handleSave = useCallback(async (props: BlockProps) => {
    if (!editingBlock) return;
    setSaving(true);
    const res = await fetch(`/api/blocks/${editingBlock.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ props }),
    });
    if (res.ok) {
      const updated = await res.json();
      setBlocks((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    }
    setSaving(false);
    setEditingBlock(null);
  }, [editingBlock]);

  // --- Toggle active ---
  const handleToggle = useCallback(async (block: Block) => {
    const res = await fetch(`/api/blocks/${block.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !block.is_active }),
    });
    if (res.ok) {
      const updated = await res.json();
      setBlocks((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    }
  }, []);

  // --- Delete block ---
  const handleDelete = useCallback(async (id: string) => {
    const res = await fetch(`/api/blocks/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setBlocks((prev) => prev.filter((b) => b.id !== id));
    }
  }, []);

  // --- Drag-and-drop reorder ---
  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);
    const reordered = arrayMove(blocks, oldIndex, newIndex);
    setBlocks(reordered);

    // Persist new order
    await fetch('/api/blocks/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profile_id: profileId,
        order: reordered.map((b) => b.id),
      }),
    });
  }, [blocks, profileId]);

  return (
    <div>
      {/* Block list with DnD */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          {blocks.map((block) => (
            <SortableBlock
              key={block.id}
              block={block}
              onEdit={() => setEditingBlock(block)}
              onToggle={() => handleToggle(block)}
              onDelete={() => handleDelete(block.id)}
            />
          ))}
        </SortableContext>
      </DndContext>

      {blocks.length === 0 && (
        <div className="card text-center py-12 text-sm text-gray-400">
          No blocks yet. Add one to get started.
        </div>
      )}

      {/* Add block button */}
      <button onClick={() => setShowPicker(true)} className="btn-primary mt-3 w-full">
        + Add Block
      </button>

      {/* Block picker modal */}
      {showPicker && (
        <BlockPicker
          persona={persona}
          onSelect={handleAddBlock}
          onClose={() => setShowPicker(false)}
        />
      )}

      {/* Block editor slide-over */}
      {editingBlock && (
        <BlockEditor
          block={editingBlock}
          onSave={handleSave}
          onClose={() => setEditingBlock(null)}
          saving={saving}
        />
      )}
    </div>
  );
}
