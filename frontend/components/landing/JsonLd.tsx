const organization = {
  "@type": "Organization",
  "@id": "https://www.invyto.in/#organization",
  name: "Invyto",
  alternateName: ["Invyto Wedding Invitations", "Invyto India"],
  url: "https://www.invyto.in",
  logo: "https://www.invyto.in/Invyto/og-cover.png",
  description:
    "Invyto is an India-based platform for creating digital wedding invitations that you share as a single link on WhatsApp.",
  areaServed: {
    "@type": "Country",
    name: "India",
  },
  sameAs: [
    "https://www.instagram.com/invyto",
    "https://x.com/invyto",
  ],
};

const website = {
  "@type": "WebSite",
  "@id": "https://www.invyto.in/#website",
  url: "https://www.invyto.in",
  name: "Invyto",
  description:
    "Invyto is an India-based platform for creating digital wedding invitations that you share as a single link on WhatsApp.",
  publisher: { "@id": "https://www.invyto.in/#organization" },
  inLanguage: "en-IN",
};

const software = {
  "@type": "SoftwareApplication",
  name: "Invyto",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  url: "https://www.invyto.in",
  description:
    "Create a digital wedding invitation with dates, venue map, timings and your story — then share one WhatsApp link with guests.",
  offers: {
    "@type": "Offer",
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    url: "https://www.invyto.in/pricing",
  },
};

const faqPage = {
  "@type": "FAQPage",
  "@id": "https://www.invyto.in/#faq",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a digital wedding invitation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A digital wedding invitation is an online invitation you share as a link, usually on WhatsApp, containing the wedding dates, venue map, timings and your story. Guests open it on their phone with no app needed.",
      },
    },
    {
      "@type": "Question",
      name: "How do I send a digital wedding invitation on WhatsApp?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "After your Invyto invitation is ready, you get a shareable link. Paste that link into a WhatsApp chat or group. Guests tap it and see your dates, venue map, timings and story in their browser — no login required.",
      },
    },
    {
      "@type": "Question",
      name: "How much does a digital wedding invitation cost in India?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Invyto wedding invitations are priced in INR based on your design needs. Message us on WhatsApp for a package quote for your wedding. Studio plans for photographers start from ₹2,999 per month for storage and tools.",
      },
    },
    {
      "@type": "Question",
      name: "Is it acceptable to send only a digital invitation to elders?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Many Kerala families use a digital invite for most guests, then add a personal call or a physical card for elders who prefer paper. A polished WhatsApp invite still feels proper when families can open dates, map and timings easily.",
      },
    },
    {
      "@type": "Question",
      name: "Can I get my invitation in Malayalam?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We create Kerala and Malayalam wedding invitations with English layouts and Malayalam wedding details where needed. Tell us your preferred language mix when you message us on WhatsApp.",
      },
    },
    {
      "@type": "Question",
      name: "Can guests open it without an app or login?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Guests open the invitation link in their phone browser. No Invyto app and no login are required to view dates, venue map, timings and your story.",
      },
    },
    {
      "@type": "Question",
      name: "Can I edit details after sharing the link?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, with limits. Core details such as timings, venue text and map can usually be updated after sharing so the same link stays correct. Major redesigns may need a short turnaround — ask us before your send date.",
      },
    },
    {
      "@type": "Question",
      name: "How long does the invitation stay live?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Your invitation stays live through the wedding season and beyond for guests who revisit the map or timings. Long-term hosting depends on your package — confirm duration when you book.",
      },
    },
  ],
};

export default function JsonLd() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [organization, website, software, faqPage],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
