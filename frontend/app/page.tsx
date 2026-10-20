import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import DefinitionBlock from "@/components/landing/DefinitionBlock";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import CategoryTeaser from "@/components/landing/CategoryTeaser";
import ComparisonTable from "@/components/landing/ComparisonTable";
import Showcase from "@/components/landing/Showcase";
import Testimonials from "@/components/landing/Testimonials";
import FaqSection from "@/components/landing/FaqSection";
import CtaBanner from "@/components/landing/CtaBanner";
import Footer from "@/components/landing/Footer";
import JsonLd from "@/components/landing/JsonLd";

export default function Home() {
  return (
    <div className="relative z-[2] min-h-screen">
      <JsonLd />
      <Navbar />
      <Hero />
      <DefinitionBlock />
      <Features />
      <HowItWorks />
      <CategoryTeaser />
      <ComparisonTable />
      <Showcase />
      <Testimonials />
      <FaqSection />
      <CtaBanner />
      <Footer />
    </div>
  );
}
