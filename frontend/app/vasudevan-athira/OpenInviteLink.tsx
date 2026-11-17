"use client";

import type { ReactNode } from "react";

type OpenInviteLinkProps = {
  className?: string;
  children: ReactNode;
};

export function OpenInviteLink({ className, children }: OpenInviteLinkProps) {
  return (
    <a
      href="#details"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        document
          .getElementById("details")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    >
      {children}
    </a>
  );
}
