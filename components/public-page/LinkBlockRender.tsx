import type { LinkBlockProps } from '@/types/blocks';

interface Props {
  props: LinkBlockProps;
  styles: Record<string, string>;
  blockId: string;
  profileId: string;
}

/** Renders a clickable link card on the public page */
export default function LinkBlockRender({ props, styles, blockId, profileId }: Props) {
  const handleClick = () => {
    // Fire-and-forget analytics
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'link_click', profile_id: profileId, block_id: blockId }),
    }).catch(() => {});
  };

  return (
    <a
      href={props.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="block w-full rounded-xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
      style={{
        background: styles.cardBg,
        borderRadius: styles.radius,
        border: props.isFeatured ? `2px solid ${styles.accent}` : '1px solid transparent',
      }}
    >
      <div className="flex items-center gap-3">
        {props.icon && <span className="text-xl flex-shrink-0">{props.icon}</span>}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate" style={{ color: styles.text }}>
            {props.title}
          </p>
          {props.description && (
            <p className="text-xs mt-0.5 truncate" style={{ color: styles.text, opacity: 0.6 }}>
              {props.description}
            </p>
          )}
        </div>
        <span style={{ color: styles.text, opacity: 0.3 }}>→</span>
      </div>
    </a>
  );
}
