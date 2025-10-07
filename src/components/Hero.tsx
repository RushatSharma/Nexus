import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import heroImage from '@/assets/hero.png';
import { Link } from 'react-router-dom';
import { AuroraTextEffect } from './AuroraTextEffect'; // Make sure this path is correct
import { cn } from '@/lib/utils';

const Hero = () => {
  return (
    <section className="pt-8 pb-12 lg:pt-12 lg:pb-12 bg-background relative overflow-hidden">
      <div className="container-custom">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 lg:col-span-7">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                <span className="text-sm font-semibold">AI Assistance coming soon!</span>
              </div>
              
              {/* --- UPDATED HEADLINE START --- */}
              <div className="flex flex-wrap items-baseline gap-x-2 lg:gap-x-3">
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  Next-Gen
                </h1>
                <AuroraTextEffect
                  text="Brand & Digital"
                  fontSize="clamp(2.25rem, 7vw, 3.75rem)" // Matches lg:text-6xl
                  className="p-0 m-0"
                  textClassName="leading-tight font-bold"
                />
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  Growth
                </h1>
              </div>
              {/* --- UPDATED HEADLINE END --- */}
              
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                We craft stunning and data-driven marketing strategies that captivate your audience and accelerate business growth. Let us be the catalyst that brings your vision to the online market.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
               <Link to="/about">
              <Button variant="outline" className="btn-outline">
                Learn More
              </Button>
              </Link>
            </div>

            {/* --- UPDATED BLACK COMPONENT START --- */}
            <div className={cn(
                "p-8 rounded-3xl relative max-w-md pt-6",
                "bg-foreground text-background dark:bg-[#FFFBF5] dark:text-black"
              )}>
              <Link to="/projects">
                <div className="absolute top-4 right-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform -rotate-45"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                </div>
              </Link>
              <div className="flex items-center space-x-2 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-warning text-warning" />
                ))}
              </div>
              <div className="flex items-center space-x-4 mb-4">
              </div>
              <h3 className="text-xl font-semibold leading-snug text-left">
                Explore Our Real Project That Help Our Clients Business Growth Every Year
              </h3>
            </div>
            {/* --- UPDATED BLACK COMPONENT END --- */}
          </div>
          
          {/* Right Content (Image) */}
           <div className="relative flex justify-center lg:justify-end lg:w-[950%] lg:-mt-20 lg:translate-x-0">
            <img
              src={heroImage}
              alt="Digital Marketing Illustration"
              className="w-full max-w-sm md:max-w-md lg:max-w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;