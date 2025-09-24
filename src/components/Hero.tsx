import { Button } from '@/components/ui/button';
import { Star, ArrowRight, Users, TrendingUp } from 'lucide-react';
import heroImage from '@/assets/hero-woman.jpg';

const Hero = () => {
  return (
    <section className="section-padding bg-gradient-to-br from-orange-50 to-red-50 relative overflow-hidden">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
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

            {/* Stats */}
            <div className="flex items-center space-x-8 pt-6">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 bg-primary rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-xs text-white font-semibold">{i}</span>
                    </div>
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">24k verified work with best client</span>
              </div>
            </div>

            <div className="flex items-center space-x-1 pt-2">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">Rated 4.8/5 from over 1000 reviews</span>
            </div>
          </div>

          {/* Right Content */}
          <div className="relative">
            {/* Main Card */}
            <div className="bg-black rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <div className="w-12 h-12 bg-primary rounded-full"></div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">
                    Explore Our 300+ Real Project That Help Our Clients Business Grow Every Year
                  </h3>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span>Growth 2.8%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span>1000 Project Done</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-primary/20 rounded-full blur-xl"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 bg-blue-500/20 rounded-full blur-xl"></div>
            </div>

            {/* Woman Image */}
            <div className="absolute -right-8 top-8 w-64 h-64 lg:w-80 lg:h-80">
              <div className="relative w-full h-full">
                <img
                  src={heroImage}
                  alt="Marketing Professional"
                  className="w-full h-full object-cover rounded-3xl"
                />
                
                {/* Floating stats */}
                <div className="absolute -top-4 -left-4 bg-white rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-semibold text-gray-900">Available work with best idea</span>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -right-4 bg-primary rounded-2xl p-4 shadow-xl">
                  <div className="text-white text-center">
                    <div className="text-2xl font-bold">24k+</div>
                    <div className="text-xs">Projects Done</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;