import { Button } from '@/components/ui/button';
import { Star, ArrowRight } from 'lucide-react';
import heroImage from '@/assets/megaphone-illustration.png';

const Hero = () => {
  return (
    <section className="pt-8 pb-16 lg:pt-12 lg:pb-24 bg-gradient-to-br from-orange-50 to-red-50 relative overflow-hidden">
      <div className="container-custom">
        <div className="grid lg:grid-cols-1 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                <span className="text-sm font-semibold">BoostTip Assistant</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Marketing{' '}
                <span className="text-gradient">Digital Partner</span>
              </h1>
              
              <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                Discover Your New Website/Product/App for Marketing Efforts to your business. To bring the power of Online Market.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="btn-primary group">
                Start Demo
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" className="btn-outline">
                Learn More
              </Button>
            </div>

            {/* --- NEW BLACK COMPONENT START --- */}
            <div className="bg-gray-900 text-white p-8 rounded-3xl relative max-w-md pt-6">
                <div className="absolute top-4 right-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform -rotate-45"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                </div>
              <div className="flex items-center space-x-2 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Users
                </div>
                <div className="flex -space-x-3">
                    <img className="w-8 h-8 rounded-full border-2 border-gray-800 object-cover" src="https://i.pravatar.cc/32?img=1" alt="user 1" />
                    <img className="w-8 h-8 rounded-full border-2 border-gray-800 object-cover" src="https://i.pravatar.cc/32?img=2" alt="user 2" />
                    <img className="w-8 h-8 rounded-full border-2 border-gray-800 object-cover" src="https://i.pravatar.cc/32?img=3" alt="user 3" />
                </div>
              </div>
              <h3 className="text-xl font-semibold leading-snug text-left">
                Explore Our 370+ Real Project That Help Our Clients Business Growth Every Year
              </h3>
            </div>
            {/* --- NEW BLACK COMPONENT END --- */}
<div className="relative flex justify-center lg:justify-end">
            <img
              src={heroImage}
              alt="Digital Marketing Illustration"
              className="w-full max-w-sm md:max-w-md lg:max-w-full h-auto object-contain"
            />
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;