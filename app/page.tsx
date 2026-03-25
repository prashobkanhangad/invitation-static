import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import PhotoFinder from "@/components/landing/PhotoFinder";
import Showcase from "@/components/landing/Showcase";
// import Stats from "@/components/landing/Stats";
import Testimonials from "@/components/landing/Testimonials";
// import Pricing from "@/components/landing/Pricing";
import CtaBanner from "@/components/landing/CtaBanner";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="relative z-[2] min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <PhotoFinder />
      <Showcase />
      {/* <Stats /> */}
      <Testimonials />
      {/* <Pricing /> */}
      <CtaBanner />
      <Footer />
    </div>
  );
}
