import React, {
  useRef,
  useEffect,
  useState,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "../hooks/use-mobile";
import { useDrag } from '@use-gesture/react';

// Import local assets
import howwework1 from "@/assets/howwework1.webp";
import howwework2 from "@/assets/howwework2.webp";
import howwework3 from "@/assets/howwework3.webp";
import howwework4 from "@/assets/howwework4.webp";

export interface ThreeDCarouselItem {
  id: number;
  title: string;
  step: string;
  description: string;
  tags: string[];
  imageUrl: string; // Keep as string, will hold the imported image variable
}

interface ThreeDCarouselProps {
  items: ThreeDCarouselItem[];
  autoRotate?: boolean;
  rotateInterval?: number;
}

// Data for the carousel cards - UPDATED imageUrl paths
const processItems: ThreeDCarouselItem[] = [
  {
    id: 1,
    title: "Discovery & Strategy",
    step: "Step 1",
    description:
      "We start by diving deep into your business, goals, and industry to build a custom marketing roadmap designed for success.",
    tags: ["Research", "Analysis", "Planning"],
    imageUrl: howwework1, // Use imported variable
  },
  {
    id: 2,
    title: "Implementation",
    step: "Step 2",
    description:
      "Our expert team executes the strategy with precision, launching campaigns and creating compelling content to capture your audience.",
    tags: ["Execution", "Content Creation", "Campaigns"],
    imageUrl: howwework2, // Use imported variable
  },
  {
    id: 3,
    title: "Analysis & Optimization",
    step: "Step 3",
    description:
      "We constantly monitor performance and analyze data, making data-driven adjustments to optimize for the best possible results.",
    tags: ["Monitoring", "Data Analysis", "Optimization"],
    imageUrl: howwework3, // Use imported variable
  },
  {
    id: 4,
    title: "Reporting & Scaling",
    step: "Step 4",
    description:
      "You get transparent, easy-to-understand reports on our progress, and we work with you to scale success and find new growth opportunities.",
    tags: ["Reporting", "Growth", "Scaling"],
    imageUrl: howwework4, // Use imported variable
  },
];

const ThreeDCarousel = ({
  items,
  autoRotate = true,
  rotateInterval = 5000,
}: ThreeDCarouselProps) => {
  const [active, setActive] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const isMobile = useIsMobile();
  const minSwipeDistance = 50;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 }
    );

    const currentRef = carouselRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    if (autoRotate && isInView && !isHovering) {
      const interval = setInterval(() => {
        setActive((prev) => (prev + 1) % items.length);
      }, rotateInterval);
      return () => clearInterval(interval);
    }
  }, [isInView, isHovering, autoRotate, rotateInterval, items.length]);

  const bind = useDrag(({ active: dragging, movement: [mx], direction: [xDir], cancel }) => {
    if (dragging && Math.abs(mx) > minSwipeDistance) {
      setActive(prev => (prev + (xDir > 0 ? -1 : 1) + items.length) % items.length);
      cancel();
    }
  });

  const getCardAnimationClass = (index: number) => {
    if (index === active) return "scale-100 opacity-100 z-20";
    if (index === (active + 1) % items.length)
      return "translate-x-[40%] scale-95 opacity-60 z-10";
    if (index === (active - 1 + items.length) % items.length)
      return "translate-x-[-40%] scale-95 opacity-60 z-10";
    return "scale-90 opacity-0 hidden"; // Hide non-visible cards
  };

  return (
    <section className="bg-background py-10 sm:py-10 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            How We Work
          </h2>
          <p className="mt-4 text-lg text-muted-foreground md:text-xl">
            A proven path to digital marketing success, tailored to your business.
          </p>
        </div>
        <div
          className="relative overflow-hidden h-[500px]"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          {...bind()}
          ref={carouselRef}
          style={{ touchAction: 'pan-y' }}
        >
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`absolute top-0 w-full max-w-md transform transition-all duration-500 ${getCardAnimationClass(
                  index
                )}`}
              >
                <Card className="overflow-hidden bg-background h-[450px] border shadow-lg flex flex-col">
                  {/* Background image style now uses the imported variable */}
                  <div
                    className="relative bg-black p-6 flex items-center justify-center h-48 overflow-hidden"
                    style={{
                      backgroundImage: `url(${item.imageUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="absolute inset-0 bg-black/60" />
                    <div className="relative z-10 text-center text-white">
                      <h3 className="text-3xl font-bold mb-2">{item.step}</h3>
                      <div className="w-12 h-1 bg-primary mx-auto mb-2" />
                      <p className="text-base">{item.title}</p>
                    </div>
                  </div>
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold mb-2 text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-base text-muted-foreground flex-grow mb-4">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          {!isMobile && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground hover:bg-primary/90 z-30 shadow-md transition-all hover:scale-110"
                onClick={() =>
                  setActive((prev) => (prev - 1 + items.length) % items.length)
                }
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground hover:bg-primary/90 z-30 shadow-md transition-all hover:scale-110"
                onClick={() => setActive((prev) => (prev + 1) % items.length)}
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center space-x-3 z-30">
            {items.map((_, idx) => (
              <button
                key={idx}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  active === idx
                    ? "bg-primary w-6"
                    : "bg-muted hover:bg-muted-foreground"
                }`}
                onClick={() => setActive(idx)}
                aria-label={`Go to item ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Wrapper component to pass the data
const HowWeWorkCarousel = () => {
  return <ThreeDCarousel items={processItems} />;
};

export default HowWeWorkCarousel;