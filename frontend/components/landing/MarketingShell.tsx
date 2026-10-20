import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function MarketingShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-[2] min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">{children}</main>
      <Footer />
    </div>
  );
}
