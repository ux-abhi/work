'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { createClient } from '@/lib/supabase/client';
import type { Link, SocialLink } from '@/types';
import { AddLinkModal } from './add-link-modal';
import { AddSocialModal } from './add-social-modal';

interface Props {
  links: Link[];
  socialLinks: SocialLink[];
  profileId: string;
}

export function LinksList({ links: initialLinks, socialLinks, profileId }: Props) {
  const router = useRouter();
  const [links, setLinks] = useState(initialLinks);
  const [showAddLink, setShowAddLink] = useState(false);
  const [showAddSocial, setShowAddSocial] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = links.findIndex((l) => l.id === active.id);
      const newIndex = links.findIndex((l) => l.id === over.id);

      const newLinks = arrayMove(links, oldIndex, newIndex);
      setLinks(newLinks);

      // Update positions in database
      const supabase = createClient();
      const updates = newLinks.map((link, index) => ({
        id: link.id,
        position: index,
      }));

      for (const update of updates) {
        await supabase
          .from('links')
          .update({ position: update.position })
          .eq('id', update.id);
      }

      router.refresh();
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    const supabase = createClient();
    await supabase.from('links').delete().eq('id', linkId);
    setLinks(links.filter((l) => l.id !== linkId));
    router.refresh();
  };

  const handleToggleActive = async (link: Link) => {
    const supabase = createClient();
    await supabase
      .from('links')
      .update({ is_active: !link.is_active })
      .eq('id', link.id);

    setLinks(
      links.map((l) =>
        l.id === link.id ? { ...l, is_active: !l.is_active } : l
      )
    );
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Links Section */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Links</h2>
          <button
            onClick={() => setShowAddLink(true)}
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-200"
          >
            Add Link
          </button>
        </div>

        {links.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={links.map((l) => l.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {links.map((link) => (
                  <SortableLink
                    key={link.id}
                    link={link}
                    onEdit={() => setEditingLink(link)}
                    onDelete={() => handleDeleteLink(link.id)}
                    onToggle={() => handleToggleActive(link)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <p className="text-center py-8 text-gray-500">
            No links yet. Add your first link to get started.
          </p>
        )}
      </div>

      {/* Social Links Section */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Social Links</h2>
          <button
            onClick={() => setShowAddSocial(true)}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Add Social
          </button>
        </div>

        {socialLinks.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {socialLinks.map((social) => (
              <SocialBadge key={social.id} social={social} />
            ))}
          </div>
        ) : (
          <p className="text-center py-4 text-gray-500">
            No social links yet.
          </p>
        )}
      </div>

      {/* Modals */}
      {showAddLink && (
        <AddLinkModal
          profileId={profileId}
          position={links.length}
          onClose={() => setShowAddLink(false)}
          onSuccess={() => {
            setShowAddLink(false);
            router.refresh();
          }}
        />
      )}

      {editingLink && (
        <AddLinkModal
          profileId={profileId}
          position={editingLink.position}
          existingLink={editingLink}
          onClose={() => setEditingLink(null)}
          onSuccess={() => {
            setEditingLink(null);
            router.refresh();
          }}
        />
      )}

      {showAddSocial && (
        <AddSocialModal
          profileId={profileId}
          position={socialLinks.length}
          onClose={() => setShowAddSocial(false)}
          onSuccess={() => {
            setShowAddSocial(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function SortableLink({
  link,
  onEdit,
  onDelete,
  onToggle,
}: {
  link: Link;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-800 p-3 ${
        !link.is_active ? 'opacity-50' : ''
      }`}
    >
      <button
        className="cursor-grab text-gray-500 hover:text-white"
        {...attributes}
        {...listeners}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </button>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-white truncate">{link.title}</p>
        <p className="text-sm text-gray-500 truncate">{link.url}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggle}
          className={`p-2 rounded ${link.is_active ? 'text-green-500' : 'text-gray-500'}`}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
        <button onClick={onEdit} className="p-2 text-gray-400 hover:text-white">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button onClick={onDelete} className="p-2 text-gray-400 hover:text-red-500">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function SocialBadge({ social }: { social: SocialLink }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Remove this social link?')) return;
    const supabase = createClient();
    await supabase.from('social_links').delete().eq('id', social.id);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2 rounded-full bg-zinc-800 px-3 py-1.5">
      <span className="text-sm capitalize text-white">{social.platform}</span>
      <button onClick={handleDelete} className="text-gray-500 hover:text-red-500">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
