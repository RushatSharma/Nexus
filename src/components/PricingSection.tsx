import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const PricingSection = () => {
  const plans = [
    {
      name: 'Basic Small Package',
      price: 1499,
      period: 'month',
      features: [
        'Social Media Management',
        'Content Creation',
        'Basic Analytics',
        'Email Support',
        'Up to 3 Campaigns'
      ],
      isPopular: false,
      isDark: true,
    },
    {
      name: 'Professional Package',
      price: 1999,
      period: 'month',
      features: [
        'Digital marketing support 500+ Projects',
        'Priority Technical Support',
        'Social Media Management Automation',
        'Advanced Content Creation',
        'Expert Consultation'
      ],
      isPopular: true,
      isDark: false,
    }
  ];

  return (
    <section className="py-10 bg-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Selecting Right Plan for Your Business
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Join Over 4,000+ Startups Already Growing with Startup.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-3xl p-8 relative overflow-hidden ${
                plan.isDark 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-50 text-gray-900 border border-gray-200'
              } ${plan.isPopular ? 'ring-2 ring-primary' : ''}`}
            >
              {plan.isPopular && (
                <div className="absolute top-6 right-6">
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className={`text-lg ${plan.isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      /{plan.period}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className={`text-sm ${plan.isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    What's included:
                  </p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <Check className="w-5 h-5 text-green-500 mt-0.5" />
                        </div>
                        <span className={`text-sm ${plan.isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <Button 
                    className={`w-full ${
                      plan.isDark 
                        ? 'bg-primary hover:bg-primary-dark text-white' 
                        : 'btn-outline'
                    }`}
                  >
                    {plan.isPopular ? 'Get Started' : 'Choose Plan'}
                  </Button>
                </div>
              </div>

              {/* Decorative elements */}
              <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full ${
                plan.isDark ? 'bg-white/10' : 'bg-primary/10'
              }`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;