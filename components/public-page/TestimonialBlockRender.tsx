import type { TestimonialBlockProps } from '@/types/blocks';

interface Props {
  props: TestimonialBlockProps;
  styles: Record<string, string>;
}

export default function TestimonialBlockRender({ props, styles }: Props) {
  return (
    <div className="w-full p-4" style={{ background: styles.cardBg, borderRadius: styles.radius }}>
      <p className="text-sm italic leading-relaxed" style={{ color: styles.text, opacity: 0.9 }}>
        &ldquo;{props.quote}&rdquo;
      </p>
      <div className="mt-3 flex items-center gap-2">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
          style={{ background: styles.accent + '22', color: styles.accent }}
        >
          {props.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-xs font-semibold" style={{ color: styles.text }}>{props.name}</p>
          {props.role && (
            <p className="text-xs" style={{ color: styles.text, opacity: 0.5 }}>{props.role}</p>
          )}
        </div>
      </div>
    </div>
  );
}
