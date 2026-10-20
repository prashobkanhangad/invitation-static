import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Invyto on WhatsApp to create a digital wedding invitation for India — dates, venue map and story in one link.",
  alternates: { canonical: "https://www.invyto.in/contact" },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
