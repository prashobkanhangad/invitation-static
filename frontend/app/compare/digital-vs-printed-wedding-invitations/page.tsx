import type { Metadata } from "next";
import Link from "next/link";
import MarketingShell from "@/components/landing/MarketingShell";

export const metadata: Metadata = {
  title: "Digital vs Printed Wedding Invitations",
  description:
    "Compare digital vs printed wedding invitations in India: cost, time, edits after sending, out-of-town guests and etiquette for elders.",
  alternates: {
    canonical:
      "https://www.invyto.in/compare/digital-vs-printed-wedding-invitations",
  },
};

const rows = [
  {
    label: "Cost",
    digital: "Usually lower than bulk printing and postage",
    printed: "Printing, envelopes and courier add up quickly",
  },
  {
    label: "Time to create",
    digital: "Days, not weeks — share as soon as the link is ready",
    printed: "Design, proof and print cycles take longer",
  },
  {
    label: "Edits after sending",
    digital: "Update timings or venue on the same link",
    printed: "Wrong address means reprinting",
  },
  {
    label: "Out-of-town guests",
    digital: "One WhatsApp link reaches everyone instantly",
    printed: "Courier delays and lost cards are common",
  },
  {
    label: "Environmental impact",
    digital: "No paper waste for the full guest list",
    printed: "Large paper runs for one-time use",
  },
];

export default function DigitalVsPrintedPage() {
  return (
    <MarketingShell>
      <article className="container mx-auto px-6 max-w-4xl">
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground text-balance">
          Digital vs printed wedding invitations
        </h1>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-3xl">
          In India, many families use a digital wedding invitation for most
          guests and still send a physical card or make a personal call for
          elders. Here is a clear comparison.
        </p>

        <div className="mt-12 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 font-semibold text-foreground">
                  Factor
                </th>
                <th className="px-4 py-3 font-semibold text-foreground">
                  Digital (WhatsApp link)
                </th>
                <th className="px-4 py-3 font-semibold text-foreground">
                  Printed cards
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {r.label}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{r.digital}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.printed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-12 font-display text-2xl font-semibold text-foreground">
          Etiquette with elders
        </h2>
        <p className="mt-3 text-muted-foreground leading-relaxed max-w-3xl">
          It is acceptable to use a digital invite for the wider guest list. For
          elders who prefer paper, send a digital invite plus a personal call or
          a physical card. That mix shows respect and still keeps dates, map and
          timings easy for everyone with a phone.
        </p>

        <p className="mt-10 text-sm text-muted-foreground">
          Create yours with{" "}
          <Link href="/" className="text-primary underline-offset-4 hover:underline">
            Invyto
          </Link>{" "}
          or see{" "}
          <Link href="/pricing" className="text-primary underline-offset-4 hover:underline">
            pricing
          </Link>
          .
        </p>
      </article>
    </MarketingShell>
  );
}
