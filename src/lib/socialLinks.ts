export const FELT_CONTACT_EMAIL = 'drhumeyrakalafat@gmail.com';

export const FELT_SOCIAL_LINKS = {
  linkedIn: 'https://www.linkedin.com/in/hümeyra-kalafat-a070833a1',
  instagram: 'https://www.instagram.com/humeyra_kalafat',
  email: `mailto:${FELT_CONTACT_EMAIL}`,
} as const;

export type SocialLinkId = 'linkedin' | 'instagram' | 'email';

export type SocialLinkConfig = {
  id: SocialLinkId;
  href: string;
  label: string;
  opensInNewTab: boolean;
};

/** Shared social profiles for Footer, Contact, and elsewhere. */
export const SOCIAL_LINK_ITEMS: SocialLinkConfig[] = [
  {
    id: 'linkedin',
    href: FELT_SOCIAL_LINKS.linkedIn,
    label: 'LinkedIn',
    opensInNewTab: true,
  },
  {
    id: 'instagram',
    href: FELT_SOCIAL_LINKS.instagram,
    label: 'Instagram',
    opensInNewTab: true,
  },
  {
    id: 'email',
    href: FELT_SOCIAL_LINKS.email,
    label: 'E-posta',
    opensInNewTab: false,
  },
];
