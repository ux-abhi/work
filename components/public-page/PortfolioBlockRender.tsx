import type { PortfolioBlockProps } from '@/types/blocks';

interface Props {
  props: PortfolioBlockProps;
  styles: Record<string, string>;
  blockId: string;
  profileId: string;
}

export default function PortfolioBlockRender({ props, styles, blockId, profileId }: Props) {
  const handleClick = () => {
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
      className="block w-full overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md"
      style={{ background: styles.cardBg, borderRadius: styles.radius }}
    >
      {props.image && (
        <div className="aspect-video w-full overflow-hidden">
          <img src={props.image} alt={props.title} className="h-full w-full object-cover" />
        </div>
      )}
      <div className="p-3">
        <p className="text-sm font-semibold" style={{ color: styles.text }}>{props.title}</p>
        {props.tags && props.tags.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {props.tags.map((tag, i) => (
              <span
                key={i}
                className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={{ background: styles.accent + '18', color: styles.accent }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}
