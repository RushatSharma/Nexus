import { Button } from '@/components/ui/button';
import { MessageCircle, Shield, BarChart, Users } from 'lucide-react';

const WhatsAppSection = () => {
  const features = [
    {
      icon: Shield,
      title: 'Auto ChatBot',
      description: 'A Must-have Experience Way used to ensure your business & save your from fake & high-risk ads',
    },
    {
      icon: BarChart,
      title: 'Cost-Efficiency',
      description: 'Let other things Those that we do effectively and efficiently to make growth & help get amazing',
    },
    {
      icon: Users,
      title: 'Dedicated Expert',
      description: 'Digital Policy, High-tech AI System to help find Best Algorithms that help find high digital marketing'
    }
  ];

  return (
    <section className="section-padding dark-section">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                Whatsapp Marketing at Your Finger Tips
              </h2>
              
              <p className="text-gray-300 text-lg leading-relaxed">
                Currently work-
              </p>
            </div>

            <Button className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-semibold text-lg">
              Start Building
            </Button>
          </div>

          {/* Right Content - Features */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatsAppSection;