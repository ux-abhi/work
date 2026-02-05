import type { ProductBlockProps } from '@/types/blocks';

interface Props {
  props: ProductBlockProps;
  styles: Record<string, string>;
  blockId: string;
  profileId: string;
}

export default function ProductBlockRender({ props, styles, blockId, profileId }: Props) {
  const handleClick = () => {
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'link_click', profile_id: profileId, block_id: blockId }),
    }).catch(() => {});
  };

  return (
    <div
      className="w-full overflow-hidden"
      style={{ background: styles.cardBg, borderRadius: styles.radius }}
    >
      {props.image && (
        <div className="aspect-video w-full overflow-hidden">
          <img src={props.image} alt={props.title} className="h-full w-full object-cover" />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-sm" style={{ color: styles.text }}>{props.title}</h4>
          {props.price && (
            <span className="text-sm font-bold flex-shrink-0" style={{ color: styles.accent }}>
              {props.price}
            </span>
          )}
        </div>
        <p className="mt-1.5 text-xs leading-relaxed" style={{ color: styles.text, opacity: 0.7 }}>
          {props.description}
        </p>
        <a
          href={props.ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="mt-3 block w-full rounded-lg py-2.5 text-center text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: styles.accent, color: '#fff' }}
        >
          {props.ctaText}
        </a>
      </div>
    </div>
  );
}
