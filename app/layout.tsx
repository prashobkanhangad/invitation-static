import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InviteElegance - Beautiful Digital Invitations",
  description: "Create stunning digital invitations for weddings, birthdays, and corporate events in minutes. Effortless, elegant, and eco-friendly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
