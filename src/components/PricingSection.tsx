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
      isDark: true, // This plan has a dark background
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
      isPopular: true, // This plan is popular
      isDark: false, // This plan uses the primary color, which is a dark background
    }
  ];

  return (
    <section className="py-10 bg-background">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Selecting Right Plan for Your Business
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Join Over 4,000+ Startups Already Growing with Startup.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-3xl p-8 relative overflow-hidden 
                ${plan.name === 'Professional Package' // Target the Professional Package
                  ? 'bg-primary text-primary-foreground' // Primary red background, white text
                  : plan.isDark 
                    ? 'bg-foreground text-background' // Black background for basic package
                    : 'bg-secondary text-foreground border border-border' // Fallback (not used here)
                } 
                ${plan.isPopular ? 'ring-2 ring-primary' : ''}`}
            >
              {plan.isPopular && (
                <div className="absolute top-6 right-6">
                  <span className="bg-background text-foreground px-3 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className={`text-lg 
                      ${plan.name === 'Professional Package' || plan.isDark ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      /{plan.period}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className={`text-sm 
                    ${plan.name === 'Professional Package' || plan.isDark ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    What's included:
                  </p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {/* Green checkmark for all plans, now white */}
                          <Check className="w-5 h-5 text-primary-foreground mt-0.5" /> 
                        </div>
                        <span className={`text-sm 
                          ${plan.name === 'Professional Package' || plan.isDark ? 'text-primary-foreground' : 'text-foreground'}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <Button 
                    className={`w-full ${
                      plan.name === 'Professional Package'
                        ? 'bg-background hover:bg-white/90 text-foreground' // White button on red background
                        : plan.isDark 
                          ? 'bg-primary hover:bg-primary-dark text-primary-foreground' // Red button on black background
                          : 'btn-outline' // Fallback (not used here)
                    }`}
                  >
                    {plan.isPopular ? 'Get Started' : 'Choose Plan'}
                  </Button>
                </div>
              </div>

              {/* Decorative elements */}
              <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full 
                ${plan.name === 'Professional Package' ? 'bg-primary-dark/20' : (plan.isDark ? 'bg-background/10' : 'bg-primary/10')}`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;