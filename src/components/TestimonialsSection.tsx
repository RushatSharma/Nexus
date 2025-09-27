import { Star, Quote } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Kartika Sharma',
      company: 'Small Business Owner',
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=47',
      testimonial: "I Can't Be Happier With The Results. The Digital Marketing Expertise Has Significantly Boosted Our Online Presence, Resulting In Increased Traffic And Revenue."
    },
    {
      name: 'John Walker',
      company: 'Creative Director',
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=60',
      testimonial: "Their Innovative Digital Marketing Strategies Have Not Only Increased Our Website Traffic By Miles, But Also Significantly Boosted Our Conversions."
    },
    {
        name: 'Samantha Lee',
        company: 'E-commerce Manager',
        rating: 5,
        avatar: 'https://i.pravatar.cc/150?img=25',
        testimonial: "Working with this team was a game-changer for our online store. Their targeted PPC campaigns and SEO strategy doubled our sales in just one quarter."
    },
    {
        name: 'David Chen',
        company: 'Startup Founder',
        rating: 5,
        avatar: 'https://i.pravatar.cc/150?img=12',
        testimonial: "As a new startup, we needed a marketing partner who understood our vision. They delivered a brilliant branding package that has been instrumental in our growth."
    },
    {
        name: 'Maria Garcia',
        company: 'Marketing Director',
        rating: 5,
        avatar: 'https://i.pravatar.cc/150?img=31',
        testimonial: "The level of detail from this team is unparalleled. Their monthly analytics reports are incredibly insightful and have helped us make much smarter marketing decisions."
    },
    {
        name: 'James Wilson',
        company: 'Real Estate Agent',
        rating: 5,
        avatar: 'https://i.pravatar.cc/150?img=57',
        testimonial: "I was struggling to generate leads online, but their content marketing and local SEO efforts have put me on the map. I'm now getting consistent, high-quality inquiries."
    },
    {
      name: 'Olivia Martinez',
      company: 'Restaurant Owner',
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=32',
      testimonial: "Our social media engagement has skyrocketed since we started working with them. They truly understand our brand's voice and connect with our customers."
    },
    {
      name: 'Benjamin Harris',
      company: 'Tech CEO',
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=56',
      testimonial: "Their team is professional, responsive, and incredibly knowledgeable. They are a true extension of our in-house marketing department. Highly recommend their services."
    },
    {
      name: 'Chloe Thompson',
      company: 'Fashion Blogger',
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=49',
      testimonial: "They helped me grow my audience and secure major brand collaborations. Their understanding of influencer marketing is second to none. A fantastic experience."
    },
    {
      name: 'William Anderson',
      company: 'Financial Advisor',
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=63',
      testimonial: "The content they produce for our blog is top-notch. It's well-researched, engaging, and has established us as a thought leader in our industry."
    },
    {
      name: 'Sophia Rodriguez',
      company: 'Non-Profit Coordinator',
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=43',
      testimonial: "Their team helped us increase our online donations by over 200% through a targeted social media campaign. We couldn't be more grateful for their support."
    },
    {
      name: 'Liam Martinez',
      company: 'Lead Developer',
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=68',
      testimonial: "The SEO audit they conducted was incredibly thorough. They identified key areas for improvement that have led to a significant increase in our organic search traffic."
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Why Our Customer Think We Are Best
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            And positive reviews from thousands to help us build a reputation and grow. We're very interested with their and feedback it the top with out business
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2">
                <div className="p-0 h-full">
                  <div className="bg-background rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 card-hover h-full flex flex-col">
                    <div className="space-y-6 flex-grow">
                      <div className="flex items-center space-x-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-warning text-warning" />
                        ))}
                      </div>

                      <div className="relative">
                        <Quote className="w-8 h-8 text-primary/20 absolute -top-2 -left-2" />
                        <p className="text-muted-foreground leading-relaxed pl-6">
                          {testimonial.testimonial}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 pt-4 mt-6 border-t border-border">
                      <Avatar>
                        <AvatarImage src={testimonial.avatar} />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:inline-flex w-10 h-10 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 shadow-md transition-all hover:scale-110 -left-12 disabled:bg-primary/50" />
          <CarouselNext className="hidden md:inline-flex w-10 h-10 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 shadow-md transition-all hover:scale-110 -right-12 disabled:bg-primary/50" />
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialsSection;