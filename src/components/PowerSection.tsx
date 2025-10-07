import {
  TrendingUp,
  MousePointerClick,
  ThumbsUp,
  FileText,
  Palette,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const services = [
  {
    icon: <Search className="h-8 w-8 text-info" />,
    title: "Search Engine Optimization (SEO)",
    description:
      "Boost your website's visibility on search engines to rank higher for relevant keywords and increase organic traffic.",
    gradient: "from-info to-blue-300",
    shadowColor: "hover:shadow-info/40",
  },
  {
    icon: <MousePointerClick className="h-8 w-8 text-success" />,
    title: "Pay-Per-Click (PPC) Advertising",
    description:
      "Get immediate, targeted traffic. We create and manage effective PPC campaigns to maximize your return on investment.",
    gradient: "from-success to-green-300",
    shadowColor: "hover:shadow-success/40",
  },
  {
    icon: <ThumbsUp className="h-8 w-8 text-indigo-500" />,
    title: "Social Media Marketing",
    description:
      "Engage your audience and build your brand on social platforms. We develop strategies to grow your community and drive meaningful interactions.",
    gradient: "from-indigo-500 to-indigo-300",
    shadowColor: "hover:shadow-indigo-500/40",
  },
  {
    icon: <FileText className="h-8 w-8 text-destructive" />,
    title: "Content Marketing",
    description:
      "Attract and retain customers with high-quality content that establishes you as an industry leader.",
    gradient: "from-destructive to-red-300",
    shadowColor: "hover:shadow-destructive/40",
  },
  {
    icon: <Palette className="h-8 w-8 text-purple-500" />,
    title: "Branding & Creative Services",
    description:
      "Craft a memorable brand identity, from logo design to your brand's voice, that makes you stand out from the competition.",
    gradient: "from-purple-500 to-purple-300",
    shadowColor: "hover:shadow-purple-500/40",
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-warning" />,
    title: "Analytics & Reporting",
    description:
      "Make data-driven decisions. We provide detailed analytics and transparent reporting to track progress and refine strategies.",
    gradient: "from-warning to-orange-300",
    shadowColor: "hover:shadow-warning/40",
  },
];

const PowerSection = () => {
  return (
    <section className="container py-10 sm:py-10">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Our Core Services
        </h2>
        <p className="mt-4 text-lg text-muted-foreground md:text-xl">
          We provide a comprehensive suite of digital marketing services to help
          your business grow.
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-5xl">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div key={service.title} className="group relative">
              <div
                className={`absolute -inset-0.5 rounded-xl bg-gradient-to-r ${service.gradient} opacity-0 blur transition-all duration-300 group-hover:opacity-75`}
              />
              <Card className={cn(
                "relative flex h-full flex-col text-center transition-all duration-300 group-hover:-translate-y-2 shadow-lg",
                service.shadowColor
              )}>
                <CardHeader className="pt-8 pb-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                    {service.icon}
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <CardTitle className="mb-3 text-xl font-bold">
                    {service.title}
                  </CardTitle>
                  <p className="flex-1 text-md text-muted-foreground">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PowerSection;