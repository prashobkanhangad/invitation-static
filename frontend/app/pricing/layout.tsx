import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Invyto digital wedding invitation pricing in INR. WhatsApp quotes for couples; studio plans from ₹2,999/month.",
  alternates: { canonical: "https://www.invyto.in/pricing" },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
