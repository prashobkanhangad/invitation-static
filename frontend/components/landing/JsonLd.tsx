import { HOME_FAQS, LIVE_EXAMPLE_LIST } from "@/lib/homeFaqs";

const organization = {
  "@type": "Organization",
  "@id": "https://www.invyto.in/#organization",
  name: "Invyto",
  alternateName: ["Invyto Wedding Invitations", "Invyto India"],
  url: "https://www.invyto.in",
  logo: "https://www.invyto.in/Invyto/og-cover.png",
  description:
    "Invyto creates digital wedding invitations for India that you share as a single WhatsApp link — with dates, venue map, timings and your story.",
  areaServed: {
    "@type": "Country",
    name: "India",
  },
  sameAs: ["https://www.instagram.com/invyto", "https://x.com/invyto"],
};

const website = {
  "@type": "WebSite",
  "@id": "https://www.invyto.in/#website",
  url: "https://www.invyto.in",
  name: "Invyto",
  description:
    "Digital wedding invitations for WhatsApp — Kerala, Malayalam and Hindu e-invites with dates, map and story.",
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
  mainEntity: HOME_FAQS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

const exampleList = {
  "@type": "ItemList",
  "@id": "https://www.invyto.in/#live-examples",
  name: "Live digital wedding invitation examples",
  itemListElement: LIVE_EXAMPLE_LIST.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    url: item.url,
  })),
};

export default function JsonLd() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [organization, website, software, faqPage, exampleList],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
