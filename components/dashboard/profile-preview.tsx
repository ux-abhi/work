'use client';

import type { User, Profile, Link, SocialLink } from '@/types';
import { getTheme } from '@/lib/themes';
import { SocialIcon } from '@/components/ui/social-icon';

interface Props {
  user: User | null;
  profile: Profile | null;
  links: Link[];
  socialLinks: SocialLink[];
}

export function ProfilePreview({ user, profile, links, socialLinks }: Props) {
  if (!user || !profile) return null;

  const theme = getTheme(profile.theme as 'dark' | 'modern' | 'vintage' | 'corporate');

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h2 className="mb-4 text-sm font-medium text-gray-400">Preview</h2>

      <div className={`rounded-xl ${theme.background} ${theme.text} p-4 min-h-[400px]`}>
        <div className="text-center">
          {/* Avatar */}
          <div className="mb-4 flex justify-center">
            <div className={`flex h-16 w-16 items-center justify-center rounded-full ${theme.card} text-2xl font-bold`}>
              {(user.full_name || user.username).charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Name */}
          <h3 className="font-bold">{user.full_name || user.username}</h3>
          <p className={`text-sm ${theme.textMuted}`}>@{user.username}</p>

          {profile.bio && (
            <p className={`mt-2 text-xs ${theme.textMuted}`}>{profile.bio}</p>
          )}

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="mt-4 flex justify-center gap-2">
              {socialLinks.slice(0, 4).map((social) => (
                <div
                  key={social.id}
                  className={`p-1.5 rounded-full ${theme.card}`}
                >
                  <SocialIcon platform={social.platform} className="h-3 w-3" />
                </div>
              ))}
            </div>
          )}

          {/* Links Preview */}
          <div className="mt-4 space-y-2">
            {links.filter(l => l.is_active).slice(0, 3).map((link) => (
              <div
                key={link.id}
                className={`rounded-lg ${theme.card} border ${theme.border} p-2 text-xs`}
              >
                {link.title}
              </div>
            ))}
            {links.filter(l => l.is_active).length > 3 && (
              <p className={`text-xs ${theme.textMuted}`}>
                +{links.filter(l => l.is_active).length - 3} more links
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
