import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

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
              className={cn(
                "rounded-3xl p-8 relative overflow-hidden",
                {
                  'bg-primary text-primary-foreground': plan.isPopular,
                  'bg-foreground text-background dark:bg-[#FFFBF5] dark:text-black': !plan.isPopular
                }
              )}
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
                    <span className={cn(
                        "text-lg",
                        plan.isPopular ? "text-primary-foreground/70" : "text-background/70 dark:text-black/70"
                    )}>
                      /{plan.period}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className={cn(
                      "text-sm",
                      plan.isPopular ? "text-primary-foreground/70" : "text-background/70 dark:text-black/70"
                  )}>
                    What's included:
                  </p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <Check className={cn("w-5 h-5 mt-0.5", 
                            plan.isPopular ? 'text-primary-foreground' : 'text-success dark:text-success'
                          )} />
                        </div>
                        <span className="text-sm">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <Button 
                    className={`w-full ${
                      plan.isPopular 
                        ? 'bg-background text-foreground hover:bg-background/90' 
                        : 'btn-primary'
                    }`}
                  >
                    {plan.isPopular ? 'Get Started' : 'Choose Plan'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
