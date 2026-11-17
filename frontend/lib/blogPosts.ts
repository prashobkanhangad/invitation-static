export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  /** Short label for hub cards */
  topic: string;
  /** Cover image under /public */
  image: string;
  imageAlt: string;
  /** Approximate reading time in minutes */
  readMinutes: number;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-much-does-digital-wedding-invitation-cost-india",
    title: "How Much Does a Digital Wedding Invitation Cost in India?",
    description:
      "What couples in India actually pay for a WhatsApp-ready digital wedding invitation — what changes the quote, and how it compares with printing.",
    date: "2026-11-12",
    topic: "Budget",
    image: "/blog/blog-invite-cost.jpg",
    imageAlt: "Wedding planning desk with soft focus on budget and invitation details",
    readMinutes: 7,
  },
  {
    slug: "north-kerala-wedding-invitation-etiquette",
    title: "North Kerala Wedding Invitation Etiquette (That Still Feels Warm)",
    description:
      "How North Kerala families usually word and share invitations — who gets a call, who gets a link, and how to keep elders comfortable.",
    date: "2026-11-08",
    topic: "Etiquette",
    image: "/blog/blog-north-kerala-etiquette.jpg",
    imageAlt: "Warm coastal Kerala evening light with soft lamp glow",
    readMinutes: 8,
  },
  {
    slug: "save-the-date-vs-wedding-invitation-whatsapp",
    title: "Save the Date vs Wedding Invitation on WhatsApp",
    description:
      "When to send a save-the-date, when the full invite should go out, and how to avoid confusing relatives with two different links.",
    date: "2026-11-03",
    topic: "Planning",
    image: "/blog/blog-save-the-date.jpg",
    imageAlt: "Save-the-date card beside a fuller invitation flat lay",
    readMinutes: 6,
  },
  {
    slug: "guest-list-mistakes-digital-wedding-invites",
    title: "Guest List Mistakes That Break Digital Wedding Invites",
    description:
      "Common guest-list errors Indian couples make with WhatsApp invites — wrong lists, missing elders, and last-minute chaos.",
    date: "2026-10-28",
    topic: "Planning",
    image: "/blog/blog-guest-list-mistakes.jpg",
    imageAlt: "Guest list notes and phone on a wedding planning table",
    readMinutes: 7,
  },
  {
    slug: "digital-vs-video-wedding-invitation-whatsapp",
    title: "Digital Link vs Video Invite on WhatsApp: Which Should You Send?",
    description:
      "Video invites look lovely in the chat — until someone needs the map. Here’s when a hosted link works better than a video file.",
    date: "2026-10-22",
    topic: "WhatsApp",
    image: "/blog/blog-video-vs-link.jpg",
    imageAlt: "Two phones comparing a video glow and a clean invitation page",
    readMinutes: 6,
  },
  {
    slug: "kerala-wedding-invitation-muhurtham-reception-details",
    title: "What to Put on a Kerala Invite: Muhurtham, Reception & Sadya Notes",
    description:
      "The details guests actually look for on a Kerala digital wedding invitation — muhurtham window, reception, venue gates and food timing.",
    date: "2026-10-16",
    topic: "Kerala",
    image: "/blog/blog-muhurtham-reception.jpg",
    imageAlt: "Quiet Kerala banquet hall before guests arrive",
    readMinutes: 8,
  },
  {
    slug: "how-to-add-google-maps-to-wedding-invitation",
    title: "How to Add Google Maps to a Wedding Invitation (So Guests Actually Arrive)",
    description:
      "A practical guide to adding the right Google Maps pin to your digital wedding invitation — hall name vs exact gate, parking, and two venues.",
    date: "2026-10-09",
    topic: "How-to",
    image: "/blog/blog-google-maps.jpg",
    imageAlt: "Phone with map directions beside car keys near a venue",
    readMinutes: 6,
  },
  {
    slug: "digital-wedding-invitation-checklist-india",
    title: "Digital Wedding Invitation Checklist for Couples in India",
    description:
      "A no-drama checklist before you share your WhatsApp wedding invite — names, timings, photos, languages and one last phone preview.",
    date: "2026-10-02",
    topic: "How-to",
    image: "/blog/blog-invite-checklist.jpg",
    imageAlt: "Wedding planning checklist notebook and photos on a desk",
    readMinutes: 7,
  },
  {
    slug: "whatsapp-broadcast-vs-group-wedding-invite",
    title: "WhatsApp Broadcast vs Group for Wedding Invites",
    description:
      "Why broadcast lists feel more personal than dumping your invite in a big group — and how Kerala couples usually split ceremony and reception lists.",
    date: "2026-09-24",
    topic: "WhatsApp",
    image: "/blog/blog-broadcast-vs-group.jpg",
    imageAlt: "Two smartphones suggesting private versus crowded messaging",
    readMinutes: 6,
  },
  {
    slug: "when-to-send-digital-wedding-invitation-whatsapp",
    title: "When to Send a Digital Wedding Invitation on WhatsApp",
    description:
      "Realistic timing for Indian weddings: first share, reminder, and what to do when muhurtham or venue details change late.",
    date: "2026-09-18",
    topic: "Planning",
    image: "/blog/blog-when-to-send.jpg",
    imageAlt: "Calendar and phone on a table during wedding planning",
    readMinutes: 6,
  },
  {
    slug: "how-to-make-a-digital-wedding-invitation-on-phone",
    title: "How to Make a Digital Wedding Invitation on Your Phone",
    description:
      "Step-by-step guide to creating a WhatsApp-ready digital wedding invitation on your phone in India — dates, venue map and story in one link.",
    date: "2026-03-15",
    topic: "How-to",
    image: "/blog/blog-phone-howto.jpg",
    imageAlt: "Hands holding a phone with a soft wedding invitation preview",
    readMinutes: 8,
  },
  {
    slug: "whatsapp-wedding-invitation-message-format",
    title: "WhatsApp Wedding Invitation Message Format (With Examples)",
    description:
      "Copy-ready WhatsApp wedding invitation message formats for India — short texts that introduce your digital invite link politely.",
    date: "2026-03-15",
    topic: "WhatsApp",
    image: "/blog/blog-whatsapp-format.jpg",
    imageAlt: "Phone beside a wedding card corner in warm indoor light",
    readMinutes: 7,
  },
  {
    slug: "malayalam-wedding-invitation-wording",
    title: "Malayalam Wedding Invitation Wording: English + Malayalam Ideas",
    description:
      "Wedding invitation wording for Malayalam and Kerala families — muhurtham, venue and blessings, ready for a digital WhatsApp invite.",
    date: "2026-03-15",
    topic: "Wording",
    image: "/blog/blog-malayalam-wording.jpg",
    imageAlt: "Kasavu silk and jasmine wedding still life",
    readMinutes: 8,
  },
  {
    slug: "hindu-wedding-invitation-wording",
    title: "Hindu Wedding Invitation Wording for Digital E-Invites",
    description:
      "Hindu wedding invitation wording for muhurtham, reception and family blessings — written for WhatsApp digital invitations in India.",
    date: "2026-03-15",
    topic: "Wording",
    image: "/blog/blog-hindu-wording.jpg",
    imageAlt: "Brass diya and flowers in a ceremonial Hindu wedding still life",
    readMinutes: 7,
  },
  {
    slug: "is-digital-wedding-invitation-ok-for-elders",
    title: "Is It Acceptable to Send Only a Digital Invitation to Elders?",
    description:
      "Etiquette for digital wedding invitations in India: when a WhatsApp invite is enough, and when to add a call or printed card for elders.",
    date: "2026-03-15",
    topic: "Etiquette",
    image: "/blog/blog-elders-etiquette.jpg",
    imageAlt: "Elder family member looking at a phone with a younger relative",
    readMinutes: 7,
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getBlogPostsSorted(): BlogPost[] {
  return [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}
