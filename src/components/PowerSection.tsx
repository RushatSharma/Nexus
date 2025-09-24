import { Button } from '@/components/ui/button';
import { Download, Users, CheckCircle } from 'lucide-react';

const PowerSection = () => {
  const cards = [
    {
      title: 'Easy To Export Data',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      icon: Download,
    },
    {
      title: 'X17 Delivered Reports',
      color: 'bg-gradient-to-br from-primary to-red-500',
      icon: CheckCircle,
    },
    {
      title: 'Easy To Download',
      color: 'bg-gradient-to-br from-gray-800 to-gray-900',
      isLarge: true,
    },
    {
      title: 'Manage Multiple Account',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      icon: Users,
    },
    {
      title: 'Check Our Product Features',
      color: 'bg-gradient-to-br from-gray-800 to-gray-900',
      isLarge: true,
      isProduct: true,
    }
  ];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            The Power of Our Marketing Software
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Software Your Company Decline to Feel Their Has created an incredible Impact & Excellent Solution, to help your Product & Helping you find much better your business for the new Year.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`${card.color} rounded-3xl p-8 text-white relative overflow-hidden card-hover ${
                card.isLarge ? 'md:col-span-2' : ''
              } ${index === 2 ? 'lg:row-span-2' : ''}`}
            >
              <div className="relative z-10">
                {card.icon && (
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                    <card.icon className="w-6 h-6" />
                  </div>
                )}
                
                <h3 className="text-xl lg:text-2xl font-bold mb-4">
                  {card.title}
                </h3>
                
                {card.isProduct && (
                  <div className="mt-8">
                    <Button variant="secondary" className="bg-primary hover:bg-primary-dark text-white">
                      Check Features
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Decorative circle */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
              
              {/* Additional decorative elements for larger cards */}
              {card.isLarge && (
                <>
                  <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full"></div>
                  <div className="absolute bottom-8 left-8 w-8 h-8 bg-white/20 rounded-full"></div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PowerSection;