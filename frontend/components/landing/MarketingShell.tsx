import type { ReactNode } from "react";
import HomeShell from "@/components/landing/HomeShell";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function MarketingShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <HomeShell>
      <div className="relative min-h-screen overflow-hidden">
        <img
          src="/landing/hero-atmosphere.jpg"
          alt=""
          width={1920}
          height={1080}
          className="pointer-events-none absolute inset-0 h-[70vh] w-full object-cover object-center opacity-45"
          aria-hidden
        />
        <img
          src="/landing/hero-florals.jpg"
          alt=""
          width={1920}
          height={1080}
          className="pointer-events-none absolute inset-0 h-[70vh] w-full object-cover opacity-20 mix-blend-screen"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(7,18,16,0.55) 0%, rgba(7,18,16,0.82) 42%, hsl(160 28% 5%) 68%, hsl(160 28% 5%) 100%)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-20 top-24 h-64 w-64 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(201,168,96,0.16), transparent 70%)",
          }}
          aria-hidden
        />

        <Navbar />
        <main className="relative z-10 pt-28 pb-20 md:pt-32 md:pb-28">
          {children}
        </main>
        <div className="relative z-10">
          <Footer />
        </div>
      </div>
    </HomeShell>
  );
}
