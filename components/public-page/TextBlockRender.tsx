import type { TextBlockProps } from '@/types/blocks';

interface Props {
  props: TextBlockProps;
  styles: Record<string, string>;
}

export default function TextBlockRender({ props, styles }: Props) {
  return (
    <div className="w-full px-1 py-2">
      {props.heading && (
        <h3 className="text-base font-bold mb-1" style={{ color: styles.text }}>
          {props.heading}
        </h3>
      )}
      <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: styles.text, opacity: 0.8 }}>
        {props.body}
      </p>
    </div>
  );
}
