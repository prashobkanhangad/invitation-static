import type { Metadata } from "next";
import { Calendar, Heart, Mail, MapPin, Users } from "lucide-react";
import { GhostButton, PageHeader, PrimaryButton, StatusBadge } from "@/components/studio-dashboard/blocks";

export const metadata: Metadata = {
  title: "Client invitations",
};

const invites = [
  {
    couple: "Anaya & Rohan",
    date: "May 18, 2026",
    venue: "Goa · cliffside",
    guests: 212,
    rsvp: "84%",
    status: "Live" as const,
    link: "inv.lumiere.studio/anaya-rohan",
  },
  {
    couple: "Priya & Leo",
    date: "Jun 06, 2026",
    venue: "Delhi · heritage hotel",
    guests: 540,
    rsvp: "61%",
    status: "Review" as const,
    link: "inv.lumiere.studio/priya-leo",
  },
  {
    couple: "Sahana & Iman",
    date: "Jul 22, 2026",
    venue: "Coorg · estate lawn",
    guests: 165,
    rsvp: "—",
    status: "Draft" as const,
    link: "inv.lumiere.studio/sahana-iman",
  },
];

export default function InvitationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Module 2"
        title="Wedding invitation landing pages"
        description="One elegant link for schedule, dress code, travel, registry, and RSVPs. Built for mobile-first guests and studio-grade brand polish."
        actions={
          <>
            <GhostButton type="button">Templates</GhostButton>
            <PrimaryButton type="button">New invitation</PrimaryButton>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50">
                  <Heart className="h-5 w-5 text-rose-700" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">Guest experience checklist</p>
                  <p className="text-xs text-zinc-600">What couples feel before they ever reach the venue.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <GhostButton type="button">Brand kit</GhostButton>
                <PrimaryButton type="button">Open editor</PrimaryButton>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
                  <Users className="h-4 w-4" strokeWidth={1.75} />
                  RSVP pipeline
                </div>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">Automated</p>
                <p className="mt-1 text-xs text-zinc-600">Reminders + export to CSV</p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
                  <MapPin className="h-4 w-4" strokeWidth={1.75} />
                  Travel blocks
                </div>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">Maps</p>
                <p className="mt-1 text-xs text-zinc-600">Ceremony vs. reception routing</p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
                  <Mail className="h-4 w-4" strokeWidth={1.75} />
                  Comms
                </div>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">3 touches</p>
                <p className="mt-1 text-xs text-zinc-600">Save the date → details → week-of</p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
            <div className="flex flex-col gap-2 border-b border-zinc-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-zinc-900">Active invitations</h2>
                <p className="mt-1 text-sm text-zinc-600">Share links, track opens, and lock content after the event.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <select className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-900">
                  <option>All statuses</option>
                  <option>Live</option>
                  <option>Review</option>
                  <option>Draft</option>
                </select>
                <select className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-900">
                  <option>Sort by date</option>
                  <option>Sort by RSVP</option>
                  <option>Sort by guests</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  <tr>
                    <th className="px-5 py-3">Couple</th>
                    <th className="px-5 py-3">Event</th>
                    <th className="px-5 py-3">Guests</th>
                    <th className="px-5 py-3">RSVP</th>
                    <th className="px-5 py-3">Link</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {invites.map((row) => (
                    <tr key={row.link} className="bg-white">
                      <td className="px-5 py-3 font-semibold text-zinc-900">{row.couple}</td>
                      <td className="px-5 py-3 text-zinc-700">
                        <span className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-zinc-400" strokeWidth={1.75} />
                          <span>
                            {row.date}
                            <span className="block text-xs text-zinc-500">{row.venue}</span>
                          </span>
                        </span>
                      </td>
                      <td className="px-5 py-3 text-zinc-700">{row.guests}</td>
                      <td className="px-5 py-3 text-zinc-700">{row.rsvp}</td>
                      <td className="px-5 py-3">
                        <span className="font-mono text-xs text-zinc-700">{row.link}</span>
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge
                          tone={row.status === "Live" ? "good" : row.status === "Review" ? "warn" : "neutral"}
                        >
                          {row.status}
                        </StatusBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-zinc-900">Studio workflow</p>
            <ol className="mt-4 space-y-3 text-sm text-zinc-700">
              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-xs font-bold text-white">
                  1
                </span>
                <span>
                  <span className="font-semibold text-zinc-900">Intake questionnaire</span>
                  <span className="block text-zinc-600">Couple details, families, and tone of voice.</span>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-xs font-bold text-white">
                  2
                </span>
                <span>
                  <span className="font-semibold text-zinc-900">Template + typography</span>
                  <span className="block text-zinc-600">Choose a layout spine, then customize copy and imagery.</span>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-xs font-bold text-white">
                  3
                </span>
                <span>
                  <span className="font-semibold text-zinc-900">Client approval</span>
                  <span className="block text-zinc-600">Share preview, capture sign-off, publish the link.</span>
                </span>
              </li>
            </ol>
          </div>

          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-5">
            <p className="text-sm font-semibold text-zinc-900">Deliverable clarity</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              Separate “planning” access for planners vs. public guest view. Add OTP for sensitive details if needed.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
