"use client";

import { motion } from "framer-motion";

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

const ComparisonTable = () => (
  <section id="digital-vs-printed" className="py-24 md:py-32">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
          Digital vs printed wedding invitations
        </h2>
        <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
          Many Kerala families use a digital invite for most guests, and still
          send a card or call to elders who prefer paper.
        </p>
      </motion.div>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-5 py-4 font-semibold text-foreground">Factor</th>
              <th className="px-5 py-4 font-semibold text-primary">
                Digital (Invyto)
              </th>
              <th className="px-5 py-4 font-semibold text-muted-foreground">
                Printed cards
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {rows.map((row) => (
              <tr key={row.label}>
                <th
                  scope="row"
                  className="px-5 py-4 font-medium text-foreground whitespace-nowrap"
                >
                  {row.label}
                </th>
                <td className="px-5 py-4 text-foreground/90">{row.digital}</td>
                <td className="px-5 py-4 text-muted-foreground">
                  {row.printed}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

export default ComparisonTable;
