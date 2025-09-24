import { Star, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Kartika Sharma',
      company: 'Small Business Owner',
      rating: 5,
      avatar: '👩‍💼',
      testimonial: "I Can't Be Happier With The Results. The Digital Marketing Expertise Has Significantly Boosted Our Online Presence, Resulting In Increased Traffic And..."
    },
    {
      name: 'John Walker',
      company: 'Creative Director',
      rating: 5,
      avatar: '👨‍💼',
      testimonial: "Their Innovative Digital Marketing Strategies Have Not Only Increased Our Website Traffic By Miles Boosted Our Conversions..."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Why Our Customer Think We Are Best
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            And positive reviews from thousands to help us build a reputation and grow. We're very interested with their and feedback it the top with out business
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 card-hover"
            >
              <div className="space-y-6">
                {/* Rating */}
                <div className="flex items-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <div className="relative">
                  <Quote className="w-8 h-8 text-primary/20 absolute -top-2 -left-2" />
                  <p className="text-gray-700 leading-relaxed pl-6">
                    {testimonial.testimonial}
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;