import type { SocialBlockProps, SocialPlatform } from '@/types/blocks';

interface Props {
  props: SocialBlockProps;
  styles: Record<string, string>;
}

const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  twitter: '𝕏',
  linkedin: 'in',
  github: 'GH',
  instagram: 'IG',
  facebook: 'fb',
  youtube: 'YT',
  tiktok: 'TT',
  dribbble: 'Dr',
  behance: 'Be',
  medium: 'M',
  other: '🔗',
};

export default function SocialBlockRender({ props, styles }: Props) {
  return (
    <div className="flex flex-wrap justify-center gap-2 py-2">
      {props.socials.map((s, i) => (
        <a
          key={i}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold transition-transform hover:scale-110"
          style={{ background: styles.accent + '22', color: styles.accent }}
          title={s.platform}
        >
          {PLATFORM_LABELS[s.platform]}
        </a>
      ))}
    </div>
  );
}
