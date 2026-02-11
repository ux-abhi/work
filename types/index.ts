// LinkCard Types

export type Theme = 'dark' | 'modern' | 'vintage' | 'corporate';

export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  bio: string | null;
  theme: Theme;
  custom_css: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Link {
  id: string;
  profile_id: string;
  title: string;
  url: string;
  icon: string | null;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  profile_id: string;
  platform: string;
  url: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface ClickAnalytics {
  id: string;
  link_id: string | null;
  profile_id: string;
  referrer: string | null;
  user_agent: string | null;
  country: string | null;
  city: string | null;
  clicked_at: string;
}

// API Types
export interface ProfileWithLinks extends Profile {
  user: User;
  links: Link[];
  social_links: SocialLink[];
}

export interface AnalyticsSummary {
  total_clicks: number;
  clicks_today: number;
  clicks_this_week: number;
  clicks_this_month: number;
  top_links: {
    link_id: string;
    title: string;
    clicks: number;
  }[];
  clicks_by_day: {
    date: string;
    clicks: number;
  }[];
  top_countries: {
    country: string;
    clicks: number;
  }[];
}

// Form Types
export interface LinkFormData {
  title: string;
  url: string;
  icon?: string;
  is_active?: boolean;
}

export interface SocialLinkFormData {
  platform: string;
  url: string;
}

export interface ProfileFormData {
  bio?: string;
  theme?: Theme;
}

export interface UserFormData {
  username?: string;
  full_name?: string;
}

// Validation Schemas (Zod)
import { z } from 'zod';

export const linkSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  url: z.string().url('Must be a valid URL'),
  icon: z.string().optional(),
  is_active: z.boolean().optional().default(true),
});

export const socialLinkSchema = z.object({
  platform: z.string().min(1, 'Platform is required'),
  url: z.string().url('Must be a valid URL'),
});

export const profileSchema = z.object({
  bio: z.string().max(500).optional(),
  theme: z.enum(['dark', 'modern', 'vintage', 'corporate']).optional(),
});

export const userSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
    .optional(),
  full_name: z.string().max(100).optional(),
});

// Social Platforms
export const SOCIAL_PLATFORMS = [
  { id: 'twitter', name: 'Twitter/X', icon: 'twitter' },
  { id: 'instagram', name: 'Instagram', icon: 'instagram' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin' },
  { id: 'github', name: 'GitHub', icon: 'github' },
  { id: 'youtube', name: 'YouTube', icon: 'youtube' },
  { id: 'tiktok', name: 'TikTok', icon: 'tiktok' },
  { id: 'facebook', name: 'Facebook', icon: 'facebook' },
  { id: 'discord', name: 'Discord', icon: 'discord' },
  { id: 'twitch', name: 'Twitch', icon: 'twitch' },
  { id: 'spotify', name: 'Spotify', icon: 'spotify' },
] as const;

export type SocialPlatform = typeof SOCIAL_PLATFORMS[number]['id'];
