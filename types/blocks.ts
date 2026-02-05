export type BlockType =
  | 'link'
  | 'text'
  | 'social'
  | 'contact'
  | 'product'
  | 'testimonial'
  | 'resume'
  | 'portfolio';

export type Persona = 'individual' | 'business';

/** Which block types are available per persona */
export const PERSONA_BLOCKS: Record<Persona, BlockType[]> = {
  individual: ['link', 'text', 'social', 'contact', 'resume', 'portfolio'],
  business: ['link', 'text', 'social', 'contact', 'product', 'testimonial'],
};

// --- Block props by type ---

export interface LinkBlockProps {
  title: string;
  url: string;
  icon?: string;
  description?: string;
  isFeatured: boolean;
}

export interface TextBlockProps {
  heading?: string;
  body: string;
}

export type SocialPlatform =
  | 'twitter'
  | 'linkedin'
  | 'github'
  | 'instagram'
  | 'facebook'
  | 'youtube'
  | 'tiktok'
  | 'dribbble'
  | 'behance'
  | 'medium'
  | 'other';

export interface SocialBlockProps {
  socials: Array<{
    platform: SocialPlatform;
    url: string;
  }>;
}

export interface ContactBlockProps {
  email?: string;
  phone?: string;
  whatsapp?: string;
  location?: string;
}

export interface ProductBlockProps {
  title: string;
  price?: string;
  image?: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
}

export interface TestimonialBlockProps {
  quote: string;
  name: string;
  role?: string;
}

export interface ResumeBlockProps {
  resumeUrl: string;
  label: string;
}

export interface PortfolioBlockProps {
  title: string;
  image?: string;
  url: string;
  tags?: string[];
}

export type BlockProps =
  | LinkBlockProps
  | TextBlockProps
  | SocialBlockProps
  | ContactBlockProps
  | ProductBlockProps
  | TestimonialBlockProps
  | ResumeBlockProps
  | PortfolioBlockProps;

export interface Block {
  id: string;
  profile_id: string;
  type: BlockType;
  position: number;
  is_active: boolean;
  props: BlockProps;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  slug: string;
  display_name: string;
  avatar_url?: string;
  persona: Persona;
  template_id: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: string;
  name: string;
  styles: {
    background: string;
    text: string;
    accent: string;
    cardBg: string;
    radius: string;
  };
}

/** Metadata for block type display in the picker */
export const BLOCK_META: Record<BlockType, { label: string; icon: string; description: string }> = {
  link: { label: 'Link', icon: '🔗', description: 'Add a clickable link' },
  text: { label: 'Text', icon: '📝', description: 'Add a heading or paragraph' },
  social: { label: 'Social', icon: '💬', description: 'Social media icons' },
  contact: { label: 'Contact', icon: '📧', description: 'Email, phone, location' },
  product: { label: 'Product', icon: '🛍️', description: 'Showcase a product' },
  testimonial: { label: 'Testimonial', icon: '💬', description: 'Customer quote' },
  resume: { label: 'Resume', icon: '📄', description: 'Downloadable resume' },
  portfolio: { label: 'Portfolio', icon: '🎨', description: 'Portfolio piece' },
};

/** Default props for new blocks */
export const DEFAULT_BLOCK_PROPS: Record<BlockType, BlockProps> = {
  link: { title: '', url: '', isFeatured: false } as LinkBlockProps,
  text: { body: '' } as TextBlockProps,
  social: { socials: [] } as SocialBlockProps,
  contact: {} as ContactBlockProps,
  product: { title: '', description: '', ctaText: 'Buy Now', ctaUrl: '' } as ProductBlockProps,
  testimonial: { quote: '', name: '' } as TestimonialBlockProps,
  resume: { resumeUrl: '', label: 'Download Resume' } as ResumeBlockProps,
  portfolio: { title: '', url: '' } as PortfolioBlockProps,
};
