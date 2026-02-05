import type { ResumeBlockProps } from '@/types/blocks';

interface Props {
  props: ResumeBlockProps;
  styles: Record<string, string>;
  blockId: string;
  profileId: string;
}

export default function ResumeBlockRender({ props, styles, blockId, profileId }: Props) {
  const handleClick = () => {
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'link_click', profile_id: profileId, block_id: blockId }),
    }).catch(() => {});
  };

  return (
    <a
      href={props.resumeUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="flex w-full items-center justify-center gap-2 rounded-xl p-4 text-sm font-semibold transition-all hover:-translate-y-0.5"
      style={{ background: styles.accent, color: '#fff', borderRadius: styles.radius }}
    >
      <span>📄</span>
      {props.label}
    </a>
  );
}
