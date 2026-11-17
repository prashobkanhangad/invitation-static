import type { Metadata } from "next";
import MarketingShell from "@/components/landing/MarketingShell";
import PageHeader from "@/components/landing/PageHeader";
import { PageAside, PageLink, articleProse } from "@/components/landing/PageCta";

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
      <article className="container mx-auto max-w-4xl px-6">
        <PageHeader
          title="Digital vs printed wedding invitations"
          lead="In India, many families use a digital wedding invitation for most guests and still send a physical card or make a personal call for elders. Here is a clear comparison."
        />

        <div className="mt-12 overflow-x-auto border border-border/80">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border/80 bg-secondary/40">
                <th className="px-4 py-3.5 font-medium text-foreground">
                  Factor
                </th>
                <th className="px-4 py-3.5 font-medium text-foreground">
                  Digital (WhatsApp link)
                </th>
                <th className="px-4 py-3.5 font-medium text-foreground">
                  Printed cards
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.label}
                  className="border-b border-border/60 last:border-0"
                >
                  <td className="px-4 py-3.5 font-medium text-foreground">
                    {r.label}
                  </td>
                  <td className="px-4 py-3.5 font-light text-muted-foreground">
                    {r.digital}
                  </td>
                  <td className="px-4 py-3.5 font-light text-muted-foreground">
                    {r.printed}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={`${articleProse} max-w-3xl`}>
          <h2>Etiquette with elders</h2>
          <p>
            It is acceptable to use a digital invite for the wider guest list. For
            elders who prefer paper, send a digital invite plus a personal call or
            a physical card. That mix shows respect and still keeps dates, map and
            timings easy for everyone with a phone.
          </p>
          <p>
            Create yours with <PageLink href="/">Invyto</PageLink> or{" "}
            <PageLink href="/contact">message us</PageLink>.
          </p>
        </div>
        <PageAside />
      </article>
    </MarketingShell>
  );
}
