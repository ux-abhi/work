import { z } from 'zod';

// --- Shared ---

const urlSchema = z.string().url('Must be a valid URL');

// --- Slug ---

export const slugSchema = z
  .string()
  .min(4, 'At least 4 characters')
  .max(50, 'At most 50 characters')
  .regex(/^[a-z0-9][a-z0-9-]{2,48}[a-z0-9]$/, 'Lowercase letters, numbers, and hyphens only. Must start and end with a letter or number.');

export const displayNameSchema = z.string().min(1, 'Required').max(100, 'At most 100 characters');

// --- Block props schemas ---

export const linkBlockSchema = z.object({
  title: z.string().min(1, 'Title required').max(200),
  url: urlSchema,
  icon: z.string().max(10).optional(),
  description: z.string().max(500).optional(),
  isFeatured: z.boolean().default(false),
});

export const textBlockSchema = z.object({
  heading: z.string().max(200).optional(),
  body: z.string().min(1, 'Body required').max(2000),
});

export const socialBlockSchema = z.object({
  socials: z
    .array(
      z.object({
        platform: z.enum([
          'twitter', 'linkedin', 'github', 'instagram', 'facebook',
          'youtube', 'tiktok', 'dribbble', 'behance', 'medium', 'other',
        ]),
        url: urlSchema,
      })
    )
    .min(1, 'Add at least one social link')
    .max(10, 'At most 10 social links'),
});

export const contactBlockSchema = z
  .object({
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().max(30).optional(),
    whatsapp: z.string().max(30).optional(),
    location: z.string().max(200).optional(),
  })
  .refine(
    (d) => d.email || d.phone || d.whatsapp || d.location,
    { message: 'At least one contact field is required' }
  );

export const productBlockSchema = z.object({
  title: z.string().min(1, 'Title required').max(200),
  price: z.string().max(50).optional(),
  image: urlSchema.optional().or(z.literal('')),
  description: z.string().min(1, 'Description required').max(1000),
  ctaText: z.string().min(1).max(50),
  ctaUrl: urlSchema,
});

export const testimonialBlockSchema = z.object({
  quote: z.string().min(10, 'At least 10 characters').max(500),
  name: z.string().min(1, 'Name required').max(100),
  role: z.string().max(100).optional(),
});

export const resumeBlockSchema = z.object({
  resumeUrl: urlSchema,
  label: z.string().min(1).max(100),
});

export const portfolioBlockSchema = z.object({
  title: z.string().min(1, 'Title required').max(200),
  image: urlSchema.optional().or(z.literal('')),
  url: urlSchema,
  tags: z.array(z.string().min(1).max(30)).max(5, 'At most 5 tags').optional(),
});

/** Map block type to its validation schema */
export const blockSchemas: Record<string, z.ZodSchema> = {
  link: linkBlockSchema,
  text: textBlockSchema,
  social: socialBlockSchema,
  contact: contactBlockSchema,
  product: productBlockSchema,
  testimonial: testimonialBlockSchema,
  resume: resumeBlockSchema,
  portfolio: portfolioBlockSchema,
};
