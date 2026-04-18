import type { Metadata } from "next";
import { PageHeader } from "@/components/studio-dashboard/blocks";

export const metadata: Metadata = {
  title: "Client invitations",
};

export default function InvitationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Module"
        title="Client invitations"
        description="Connect with admin support."
      />
      <div className="max-w-2xl rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm">
        <p className="text-sm text-zinc-700">Connect with admin support.</p>
      </div>
    </>
  );
}
