'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import type { User, Profile, Link, SocialLink } from '@/types';
import type { ThemeConfig } from '@/lib/themes';
import { SocialIcon } from '@/components/ui/social-icon';

interface Props {
  user: User;
  profile: Profile;
  links: Link[];
  socialLinks: SocialLink[];
  theme: ThemeConfig;
}

export function PublicProfile({ user, profile, links, socialLinks, theme }: Props) {
  // Track profile view
  useEffect(() => {
    fetch('/api/analytics/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: profile.id }),
    }).catch(() => {});
  }, [profile.id]);

  const handleLinkClick = async (linkId: string, url: string) => {
    // Track click
    fetch('/api/analytics/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ linkId, profileId: profile.id }),
    }).catch(() => {});

    // Open link
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`min-h-screen ${theme.background} ${theme.text}`}>
      <div className="mx-auto max-w-lg px-4 py-12">
        {/* Avatar */}
        <div className="mb-6 flex justify-center">
          {user.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt={user.full_name || user.username}
              width={96}
              height={96}
              className="rounded-full object-cover"
            />
          ) : (
            <div className={`flex h-24 w-24 items-center justify-center rounded-full ${theme.card} text-3xl font-bold`}>
              {(user.full_name || user.username).charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Name & Bio */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">{user.full_name || user.username}</h1>
          <p className={`mt-1 ${theme.textMuted}`}>@{user.username}</p>
          {profile.bio && (
            <p className={`mt-3 ${theme.textMuted}`}>{profile.bio}</p>
          )}
        </div>

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div className="mb-8 flex justify-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full ${theme.card} ${theme.cardHover} transition-colors`}
              >
                <SocialIcon platform={social.platform} className="h-5 w-5" />
              </a>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="space-y-3">
          {links.map((link, index) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id, link.url)}
              className={`w-full rounded-xl ${theme.card} ${theme.cardHover} border ${theme.border} p-4 text-center transition-all hover:scale-[1.02] animate-fade-in`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <span className="font-medium">{link.title}</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <a
            href="/"
            className={`text-sm ${theme.textMuted} hover:${theme.text}`}
          >
            Made with LinkCard
          </a>
        </div>
      </div>
    </div>
  );
}
