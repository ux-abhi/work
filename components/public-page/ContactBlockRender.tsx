import type { ContactBlockProps } from '@/types/blocks';

interface Props {
  props: ContactBlockProps;
  styles: Record<string, string>;
  slug: string;
}

export default function ContactBlockRender({ props, styles, slug }: Props) {
  const items = [
    props.email && { label: props.email, href: `mailto:${props.email}`, icon: '✉️' },
    props.phone && { label: props.phone, href: `tel:${props.phone}`, icon: '📞' },
    props.whatsapp && { label: `WhatsApp ${props.whatsapp}`, href: `https://wa.me/${props.whatsapp.replace(/\D/g, '')}`, icon: '💬' },
    props.location && { label: props.location, href: `https://maps.google.com/?q=${encodeURIComponent(props.location)}`, icon: '📍' },
  ].filter(Boolean) as { label: string; href: string; icon: string }[];

  return (
    <div className="w-full space-y-2">
      {items.map((item, i) => (
        <a
          key={i}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg p-3 text-sm transition-all hover:opacity-80"
          style={{ background: styles.cardBg, borderRadius: styles.radius }}
        >
          <span>{item.icon}</span>
          <span style={{ color: styles.text }}>{item.label}</span>
        </a>
      ))}
      {/* vCard download button */}
      {(props.email || props.phone) && (
        <a
          href={`/api/vcard/${slug}`}
          className="block text-center text-xs font-medium mt-2 transition-opacity hover:opacity-80"
          style={{ color: styles.accent }}
        >
          Save Contact
        </a>
      )}
    </div>
  );
}
