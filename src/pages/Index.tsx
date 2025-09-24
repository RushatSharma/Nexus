import Header from '@/components/Header';
import Hero from '@/components/Hero';
import WhatsAppSection from '@/components/WhatsAppSection';
import PowerSection from '@/components/PowerSection';
import PricingSection from '@/components/PricingSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import StatsSection from '@/components/StatsSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <WhatsAppSection />
      <PowerSection />
      <PricingSection />
      <TestimonialsSection />
      <StatsSection />
      <Footer />
    </div>
  );
};

export default Index;
