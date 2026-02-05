'use client';

import type { Block, Profile } from '@/types/blocks';
import LinkBlockRender from './LinkBlockRender';
import TextBlockRender from './TextBlockRender';
import SocialBlockRender from './SocialBlockRender';
import ContactBlockRender from './ContactBlockRender';
import ProductBlockRender from './ProductBlockRender';
import TestimonialBlockRender from './TestimonialBlockRender';
import ResumeBlockRender from './ResumeBlockRender';
import PortfolioBlockRender from './PortfolioBlockRender';

interface Props {
  profile: Profile;
  blocks: Block[];
  styles: Record<string, string>;
}

/** Renders the full public smart page with all active blocks */
export default function PublicPage({ profile, blocks, styles }: Props) {
  return (
    <div
      className="flex min-h-dvh justify-center px-4 py-12"
      style={{ background: styles.background, color: styles.text }}
    >
      <div className="w-full max-w-md space-y-4">
        {/* Avatar + name */}
        <div className="text-center">
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold"
            style={{ background: styles.accent + '22', color: styles.accent }}
          >
            {profile.display_name.charAt(0).toUpperCase()}
          </div>
          <h1 className="mt-3 text-xl font-bold tracking-tight">{profile.display_name}</h1>
        </div>

        {/* Blocks */}
        {blocks.map((block) => (
          <div key={block.id}>
            {block.type === 'link' && (
              <LinkBlockRender
                props={block.props as any}
                styles={styles}
                blockId={block.id}
                profileId={profile.id}
              />
            )}
            {block.type === 'text' && <TextBlockRender props={block.props as any} styles={styles} />}
            {block.type === 'social' && <SocialBlockRender props={block.props as any} styles={styles} />}
            {block.type === 'contact' && (
              <ContactBlockRender props={block.props as any} styles={styles} slug={profile.slug} />
            )}
            {block.type === 'product' && (
              <ProductBlockRender
                props={block.props as any}
                styles={styles}
                blockId={block.id}
                profileId={profile.id}
              />
            )}
            {block.type === 'testimonial' && (
              <TestimonialBlockRender props={block.props as any} styles={styles} />
            )}
            {block.type === 'resume' && (
              <ResumeBlockRender
                props={block.props as any}
                styles={styles}
                blockId={block.id}
                profileId={profile.id}
              />
            )}
            {block.type === 'portfolio' && (
              <PortfolioBlockRender
                props={block.props as any}
                styles={styles}
                blockId={block.id}
                profileId={profile.id}
              />
            )}
          </div>
        ))}

        {/* Footer */}
        <p className="pt-4 text-center text-xs" style={{ color: styles.text, opacity: 0.3 }}>
          Built with Linkks
        </p>
      </div>
    </div>
  );
}
