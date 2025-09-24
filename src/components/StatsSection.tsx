import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const StatsSection = () => {
  return (
    <section className="section-padding dark-section">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Stats */}
          <div className="space-y-8">
            <div className="bg-primary rounded-3xl p-8 text-white">
              <div className="space-y-4">
                <div className="text-5xl lg:text-6xl font-bold">280+</div>
                <div className="text-xl">Marketing Expert Deliver</div>
                
                <div className="pt-4 border-t border-white/20">
                  <div className="text-3xl lg:text-4xl font-bold">10,000+</div>
                  <div className="text-lg">Digital Marketing Support Campaign</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                Ready to Elevate Your Digital Presence?
              </h2>
              
              <p className="text-gray-300 text-lg leading-relaxed">
                Ready to take your business to new heights? Let's embark on a digital journey that transforms your brand and achieves remarkable success.
              </p>
            </div>

            <Button className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-semibold text-lg group">
              Book A Demo
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;