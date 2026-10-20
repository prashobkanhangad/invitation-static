export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  /** Short label for hub cards */
  topic: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-make-a-digital-wedding-invitation-on-phone",
    title: "How to Make a Digital Wedding Invitation on Your Phone",
    description:
      "Step-by-step guide to creating a WhatsApp-ready digital wedding invitation on your phone in India — dates, venue map and story in one link.",
    date: "2026-03-15",
    topic: "How-to",
  },
  {
    slug: "whatsapp-wedding-invitation-message-format",
    title: "WhatsApp Wedding Invitation Message Format (With Examples)",
    description:
      "Copy-ready WhatsApp wedding invitation message formats for India — short texts that introduce your digital invite link politely.",
    date: "2026-03-15",
    topic: "WhatsApp",
  },
  {
    slug: "malayalam-wedding-invitation-wording",
    title: "Malayalam Wedding Invitation Wording: English + Malayalam Ideas",
    description:
      "Wedding invitation wording for Malayalam and Kerala families — muhurtham, venue and blessings, ready for a digital WhatsApp invite.",
    date: "2026-03-15",
    topic: "Wording",
  },
  {
    slug: "hindu-wedding-invitation-wording",
    title: "Hindu Wedding Invitation Wording for Digital E-Invites",
    description:
      "Hindu wedding invitation wording for muhurtham, reception and family blessings — written for WhatsApp digital invitations in India.",
    date: "2026-03-15",
    topic: "Wording",
  },
  {
    slug: "is-digital-wedding-invitation-ok-for-elders",
    title: "Is It Acceptable to Send Only a Digital Invitation to Elders?",
    description:
      "Etiquette for digital wedding invitations in India: when a WhatsApp invite is enough, and when to add a call or printed card for elders.",
    date: "2026-03-15",
    topic: "Etiquette",
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
