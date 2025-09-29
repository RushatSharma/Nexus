import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";
import React, { useState } from "react";
import { AuroraTextEffect } from "@/components/AuroraTextEffect";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Link } from "react-router-dom";

// --- FULLY UPDATED Project Data ---
const projects = [
  {
    id: 1,
    slug: "urbanbloom-digital-overhaul",
    category: "E-Commerce Growth",
    client: "UrbanBloom",
    title: "Complete Digital Overhaul",
    description:
      "We took UrbanBloom from a local favorite to a national brand with a full-funnel marketing strategy that included a stunning new website, a targeted SEO and PPC campaign, and a vibrant social media presence. The result was a 250% increase in online sales within the first six months.",
    imageUrl:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
    services: ["SEO", "PPC", "Social Media"],
    details: {
      challenge: "UrbanBloom, a boutique fashion retailer, faced stiff competition from larger e-commerce giants. Their online presence was minimal, resulting in low brand visibility, stagnant website traffic, and a high cost per acquisition for new customers.",
      solution: [
        {
          title: "Strategic SEO Overhaul",
          description: "We conducted a comprehensive SEO audit and implemented a strategy focused on long-tail keywords relevant to their niche. This included on-page optimizations, technical SEO improvements to enhance site speed and mobile-friendliness, and a content strategy to build authority.",
        },
        {
          title: "Targeted PPC Campaigns",
          description: "Our team launched highly-targeted Google Ads and social media ad campaigns, focusing on specific demographics and interests. We utilized A/B testing for ad copy and visuals to maximize click-through rates and conversions while optimizing ad spend for a higher ROAS.",
        },
        {
          title: "Vibrant Social Media Presence",
          description: "We developed a content calendar for Instagram and Pinterest, showcasing UrbanBloom's unique style with high-quality visuals and engaging stories. An influencer collaboration campaign was also launched to broaden their reach and build social proof.",
        }
      ],
      results: {
        increaseInSales: "250%",
        increaseInTraffic: "300%",
        roas: "5X",
        quote: "Nexus didn't just market our products; they understood our brand's soul. Their comprehensive strategy was the catalyst for our unprecedented growth."
      },
      gallery: [
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2070&auto=format&fit=crop"
      ]
    }
  },
  {
    id: 2,
    slug: "innovate-ai-brand-launch",
    category: "SaaS Branding",
    client: "Innovate AI",
    title: "Brand Identity & Launch",
    description:
      "Crafting a powerful brand identity that positioned Innovate AI as a leader in the tech space from day one. We developed their logo, brand guidelines, and a comprehensive content marketing strategy to build authority and drive early adoption.",
    imageUrl:
      "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop",
    services: ["Branding", "Content Marketing"],
    details: {
      challenge: "As a newcomer in the competitive AI SaaS market, Innovate AI needed to quickly establish credibility and create a brand that resonated with tech executives. They lacked a clear brand identity and a strategy to generate initial user interest.",
      solution: [
        {
          title: "Brand Identity Development",
          description: "We designed a modern logo and a comprehensive set of brand guidelines, including typography, color palette, and voice. This created a consistent and professional image across all marketing channels.",
        },
        {
          title: "Authority-Building Content",
          description: "A content strategy was developed focusing on thought leadership. We produced in-depth whitepapers, blog posts on industry trends, and case studies to showcase their expertise and build trust with potential customers.",
        },
        {
          title: "Targeted Launch Campaign",
          description: "A multi-channel launch campaign was executed, including PR outreach to tech publications, a targeted LinkedIn ad campaign, and a webinar featuring industry experts to drive initial sign-ups.",
        }
      ],
      results: {
        increaseInSales: "500+", // Representing sign-ups
        increaseInTraffic: "10k+", // Representing website visitors
        roas: "35%", // Representing conversion rate
        quote: "Nexus gave our vision an identity. Their branding and content strategy were pivotal in our successful launch, helping us stand out in a crowded market."
      },
      gallery: [
        "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1587440871875-191322ee64b0?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=1974&auto=format&fit=crop"
      ]
    }
  },
  {
    id: 3,
    slug: "healthful-living-content-strategy",
    category: "Content Strategy",
    client: "Healthful Living",
    title: "Authority-Building Content",
    description:
      "Developed a content ecosystem that drove organic traffic by 300% and established them as a trusted health resource. This included in-depth articles, engaging infographics, and a series of successful email marketing campaigns.",
    imageUrl:
      "https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=1932&auto=format&fit=crop",
    services: ["Content Marketing", "SEO"],
    details: {
        challenge: "Healthful Living's website had valuable content but struggled to rank on search engines, resulting in low organic traffic. They needed a strategy to become a go-to source for reliable health and wellness information.",
        solution: [
            {
                title: "Keyword & Topic Clustering",
                description: "We performed extensive keyword research to identify high-intent, low-competition topics. We then organized these into content clusters to build topical authority and improve search engine rankings.",
            },
            {
                title: "High-Quality Content Production",
                description: "Our team of expert writers and designers created a variety of content formats, including long-form blog posts, shareable infographics, and downloadable guides, all optimized for SEO and user engagement.",
            },
            {
                title: "Email Nurture Sequences",
                description: "We developed email nurture sequences to capture leads from the website and provide ongoing value to subscribers, converting readers into a loyal community.",
            }
        ],
        results: {
            increaseInSales: "40%", // Representing lead conversion increase
            increaseInTraffic: "300%",
            roas: "N/A",
            quote: "The content strategy from Nexus transformed our website from a simple blog into an authoritative health resource. The growth in our organic traffic has been phenomenal."
        },
        gallery: [
            "https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=1932&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1543362906-acfc16c67564?q=80&w=1965&auto=format&fit=crop"
        ]
    }
  },
  {
    id: 4,
    slug: "nextgen-ppc-campaign",
    category: "PPC Campaign",
    client: "NextGen Real Estate",
    title: "Lead Generation Machine",
    description:
      "A highly targeted PPC campaign that generated a 5X return on ad spend and a steady stream of qualified leads. We optimized their campaigns across Google Ads and social media to maximize their marketing budget and impact.",
    imageUrl:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
    services: ["PPC Advertising"],
    details: {
        challenge: "NextGen Real Estate was spending a significant amount on advertising but wasn't seeing a proportional return in qualified leads. Their campaigns lacked targeting and their landing pages weren't converting effectively.",
        solution: [
            {
                title: "Audience Segmentation & Targeting",
                description: "We identified and segmented key customer personas, creating tailored ad campaigns on Google Search and Facebook for each group, from first-time homebuyers to luxury property investors.",
            },
            {
                title: "Landing Page Optimization",
                description: "We designed and A/B tested high-converting landing pages for each campaign, ensuring a seamless user experience and clear calls-to-action to capture lead information effectively.",
            },
            {
                title: "Budget & Bid Management",
                description: "Continuous monitoring and adjustment of bidding strategies and budget allocation were implemented to ensure ad spend was concentrated on the best-performing campaigns, maximizing ROAS.",
            }
        ],
        results: {
            increaseInSales: "75%", // Increase in qualified leads
            increaseInTraffic: "N/A",
            roas: "5X",
            quote: "Nexus turned our ad spend into a predictable lead generation engine. The quality of leads we receive now is far superior, and our agents are busier than ever."
        },
        gallery: [
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1992&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?q=80&w=2070&auto=format&fit=crop"
        ]
    }
  },
  {
    id: 5,
    slug: "fittrack-app-marketing",
    category: "Mobile App Marketing",
    client: "Fit-Track",
    title: "User Acquisition Campaign",
    description: "Launched a multi-channel user acquisition campaign for the Fit-Track mobile app, resulting in over 1 million downloads in the first three months and a 40% reduction in cost per install.",
    imageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=2070&auto=format&fit=crop",
    services: ["App Store Optimization", "Mobile Ads"],
    details: {
      challenge: "Fit-Track, a new fitness app, needed to achieve rapid user growth in a saturated market while maintaining a low cost-per-install (CPI) to satisfy investors.",
      solution: [
          {
              title: "App Store Optimization (ASO)",
              description: "We optimized the app's title, description, keywords, and screenshots on both the Apple App Store and Google Play Store to improve organic visibility and conversion rates.",
          },
          {
              title: "Social Media Video Ads",
              description: "Engaging short-form video ads were created and promoted on TikTok and Instagram Reels, targeting fitness enthusiasts and showcasing the app's key features in a dynamic way.",
          },
          {
              title: "Influencer Partnerships",
              description: "We collaborated with fitness influencers to review and promote the app, leveraging their credibility to drive authentic downloads and build a strong user community from day one.",
          }
      ],
      results: {
          increaseInSales: "1M+", // Downloads
          increaseInTraffic: "40%", // Reduction in CPI
          roas: "N/A",
          quote: "The Nexus team's approach to app marketing was brilliant. They didn't just drive downloads; they built a community around our product. Hitting 1 million users was a dream come true."
      },
      gallery: [
          "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=2070&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=2071&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop"
      ]
    }
  },
  {
    id: 6,
    slug: "quantum-analytics-b2b-leads",
    category: "B2B Lead Generation",
    client: "Quantum Analytics",
    title: "LinkedIn Outreach Program",
    description: "Developed and executed a highly targeted LinkedIn outreach program that generated a 300% increase in qualified leads for Quantum Analytics' enterprise software solution.",
    imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop",
    services: ["Lead Generation", "B2B Marketing"],
    details: {
      challenge: "Quantum Analytics struggled to connect with C-level executives and decision-makers in their target industries. Traditional marketing methods were yielding low-quality leads and a high sales cycle time.",
      solution: [
          {
              title: "Ideal Customer Profile (ICP) Definition",
              description: "We worked closely with their sales team to refine their ICP. Using LinkedIn Sales Navigator, we built highly targeted lead lists based on industry, company size, and job title.",
          },
          {
              title: "Personalized Outreach Sequences",
              description: "Instead of generic messages, we crafted multi-touch outreach sequences with personalized connection requests and InMails that referenced the prospect's work or company news, leading to higher response rates.",
          },
          {
              title: "Content-Driven Approach",
              description: "The outreach was supported by sharing valuable content, such as a custom-tailored industry report, which positioned Quantum Analytics as a helpful expert rather than just a vendor.",
          }
      ],
      results: {
          increaseInSales: "300%", // Increase in qualified leads
          increaseInTraffic: "N/A",
          roas: "45%", // Meeting to lead conversion rate
          quote: "Nexus's LinkedIn strategy was a game-changer. We are now having meaningful conversations with the exact decision-makers we wanted to reach."
      },
      gallery: [
          "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=1974&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2070&auto=format&fit=crop"
      ]
    }
  },
  {
    id: 7,
    slug: "wanderlust-viral-video",
    category: "Video Marketing",
    client: "Wanderlust Travels",
    title: "Viral Video Campaign",
    description: "Created a viral video campaign that garnered over 10 million views across social media platforms, significantly boosting brand awareness and leading to a record-breaking number of travel bookings.",
    imageUrl: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1968&auto=format&fit=crop", // NEW IMAGE
    services: ["Video Production", "Social Media"],
    details: {
      challenge: "Wanderlust Travels wanted to break through the noise of the travel industry and inspire a younger demographic. They needed a campaign that was authentic, shareable, and emotionally resonant.",
      solution: [
        {
          title: "Concept & Storyboarding",
          description: "We developed a 'Day in the Life of a Traveler' concept, using fast-paced, user-generated-style content to create an authentic and relatable feel. The video followed a narrative of discovery and adventure.",
        },
        {
          title: "Multi-Platform Optimization",
          description: "The video was edited into multiple formats, optimized for TikTok (vertical, short-form), Instagram Reels, and a longer-form version for YouTube to maximize reach and engagement on each platform.",
        },
        {
          title: "Seeding & Promotion",
          description: "We partnered with travel influencers to launch the campaign, creating an initial wave of shares. A targeted ad spend was used to amplify the video's reach to lookalike audiences.",
        }
      ],
      results: {
        increaseInSales: "40%", // Increase in bookings
        increaseInTraffic: "10M+", // Views
        roas: "N/A",
        quote: "The video perfectly captured the spirit of adventure we sell. Its viral success put our brand in front of millions and led to our best booking season ever."
      },
      gallery: [
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop"
      ]
    }
  },
  {
    id: 8,
    slug: "artisan-bakery-email-marketing",
    category: "Email Marketing",
    client: "The Artisan Bakery",
    title: "Customer Retention Strategy",
    description: "Designed and implemented an automated email marketing strategy that increased customer retention by 25% and drove a 15% increase in repeat purchases through personalized offers and engaging content.",
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=2070&auto=format&fit=crop",
    services: ["Email Automation", "CRM"],
    details: {
      challenge: "The Artisan Bakery had a loyal customer base but struggled with encouraging repeat business. They needed an effective way to stay in touch with customers and entice them back without being spammy.",
      solution: [
        {
          title: "Welcome Series Automation",
          description: "We created an automated welcome email series for new customers that introduced them to the brand story, highlighted popular products, and offered a small discount on their next purchase.",
        },
        {
          title: "Customer Segmentation",
          description: "Using their sales data, we segmented customers based on their purchasing habits (e.g., 'bread lovers', 'pastry fans'). This allowed us to send highly relevant and personalized email campaigns with targeted offers.",
        },
        {
          title: "Re-engagement Campaign",
          description: "A 'we miss you' campaign was set up to automatically target customers who hadn't made a purchase in 60 days, offering them a special incentive to return and reminding them of what they love about the bakery.",
        }
      ],
      results: {
        increaseInSales: "15%", // Increase in repeat purchases
        increaseInTraffic: "25%", // Increase in customer retention
        roas: "N/A",
        quote: "Nexus helped us build a real relationship with our customers through email. Our repeat business has never been stronger, and our customers love the personalized content."
      },
      gallery: [
        "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?q=80&w=1974&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1974&auto=format&fit=crop"
      ]
    }
  }
];

// Export projects data so it can be used in other components
export const getProjects = () => projects;

const ProjectSection = ({ project, imagePosition }: { project: (typeof projects)[0], imagePosition: 'left' | 'right' }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Image Column */}
        <div className={`lg:order-${imagePosition === 'left' ? 1 : 2}`}>
            <div className="rounded-2xl overflow-hidden shadow-lg max-h-[380px]">
                <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
            </div>
        </div>
        {/* Text Column */}
        <div className={`lg:order-${imagePosition === 'left' ? 2 : 1} flex flex-col justify-center`}>
             <div className="lg:py-4">
                <h3 className="text-lg font-semibold text-primary">{project.client}</h3>
                <h2 className="mt-2 text-3xl lg:text-4xl font-bold text-foreground">{project.title}</h2>
                <p className="mt-4 text-lg text-muted-foreground">{project.description}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                    {project.services.map((service) => (
                        <span
                            key={service}
                            className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-foreground"
                        >
                            {service}
                        </span>
                    ))}
                </div>
                {/* UPDATED: Button is now a Link */}
                <Link to={`/projects/${project.slug}`}>
                    <Button className="mt-8 btn-primary">
                        View Case Study <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
            </div>
        </div>
    </div>
);

const ProjectsPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 4;
    const totalPages = Math.ceil(projects.length / projectsPerPage);

    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="bg-background">
            <Header />
            <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="text-center mb-8">
                    <AuroraTextEffect
                        text="Transforming Ideas into Impactful Digital Experiences"
                        fontSize="clamp(2rem, 5vw, 3rem)"
                        className="flex justify-center items-center p-0 m-0 text-center"
                        textClassName="tracking-tight font-extrabold text-foreground text-center"
                    />
                    <p className="mx-auto mt-4 max-w-4xl text-lg text-muted-foreground text-center">
                        From startups to industry leaders, we partner with ambitious brands to
                        craft digital solutions that not only look stunning but deliver measurable results. 
                        Dive into a showcase of projects that inspire, engage, and drive business growth.
                    </p>
                </div>

                {/* Featured Projects Sections */}
                <div className="mt-8 space-y-20">
                    {currentProjects.map((project, index) => (
                        <ProjectSection key={project.id} project={project} imagePosition={index % 2 === 0 ? 'left' : 'right'} />
                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-20">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage > 1) handlePageChange(currentPage - 1);
                                    }}
                                />
                            </PaginationItem>
                            {[...Array(totalPages)].map((_, i) => (
                                <PaginationItem key={i}>
                                    <PaginationLink
                                        href="#"
                                        isActive={currentPage === i + 1}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handlePageChange(i + 1);
                                        }}
                                    >
                                        {i + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage < totalPages) handlePageChange(currentPage + 1);
                                    }}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ProjectsPage;