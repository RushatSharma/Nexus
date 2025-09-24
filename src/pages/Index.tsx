
import Footer  from "@/components/Footer";
import   Header  from "@/components/Header";
import  Hero  from "@/components/Hero";
import  PowerSection  from "@/components/PowerSection";
import  PricingSection  from "@/components/PricingSection";
import  StatsSection  from "@/components/StatsSection";
import  TestimonialsSection  from "@/components/TestimonialsSection";
import  WhatsAppSection  from "@/components/WhatsAppSection";

export default function Index() {
  return (
    <>
      <Header />
      <Hero />
      <WhatsAppSection />
      <PowerSection />
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </>
  );
}

// <StatsSection />