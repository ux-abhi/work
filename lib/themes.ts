import type { Theme } from '@/types';

export interface ThemeConfig {
  name: string;
  background: string;
  text: string;
  textMuted: string;
  card: string;
  cardHover: string;
  border: string;
  accent: string;
  accentHover: string;
}

export const themes: Record<Theme, ThemeConfig> = {
  dark: {
    name: 'Dark',
    background: 'bg-black',
    text: 'text-white',
    textMuted: 'text-gray-400',
    card: 'bg-zinc-900',
    cardHover: 'hover:bg-zinc-800',
    border: 'border-zinc-800',
    accent: 'bg-white text-black',
    accentHover: 'hover:bg-gray-200',
  },
  modern: {
    name: 'Modern',
    background: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800',
    text: 'text-white',
    textMuted: 'text-purple-200',
    card: 'bg-white/10 backdrop-blur-lg',
    cardHover: 'hover:bg-white/20',
    border: 'border-white/20',
    accent: 'bg-white text-purple-900',
    accentHover: 'hover:bg-purple-100',
  },
  vintage: {
    name: 'Vintage',
    background: 'bg-amber-50',
    text: 'text-amber-900',
    textMuted: 'text-amber-700',
    card: 'bg-white',
    cardHover: 'hover:bg-amber-100',
    border: 'border-amber-200',
    accent: 'bg-amber-900 text-amber-50',
    accentHover: 'hover:bg-amber-800',
  },
  corporate: {
    name: 'Corporate',
    background: 'bg-slate-100',
    text: 'text-slate-900',
    textMuted: 'text-slate-600',
    card: 'bg-white',
    cardHover: 'hover:bg-slate-50',
    border: 'border-slate-200',
    accent: 'bg-blue-600 text-white',
    accentHover: 'hover:bg-blue-700',
  },
};

export function getTheme(theme: Theme): ThemeConfig {
  return themes[theme] || themes.dark;
}
