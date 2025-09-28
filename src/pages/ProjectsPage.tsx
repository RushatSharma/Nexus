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

// --- Project Data ---
const projects = [
  {
    id: 1,
    category: "E-Commerce Growth",
    client: "UrbanBloom",
    title: "Complete Digital Overhaul",
    description:
      "We took UrbanBloom from a local favorite to a national brand with a full-funnel marketing strategy that included a stunning new website, a targeted SEO and PPC campaign, and a vibrant social media presence. The result was a 250% increase in online sales within the first six months.",
    imageUrl:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
    services: ["SEO", "PPC", "Social Media"],
  },
  {
    id: 2,
    category: "SaaS Branding",
    client: "Innovate AI",
    title: "Brand Identity & Launch",
    description:
      "Crafting a powerful brand identity that positioned Innovate AI as a leader in the tech space from day one. We developed their logo, brand guidelines, and a comprehensive content marketing strategy to build authority and drive early adoption.",
    imageUrl:
      "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop",
    services: ["Branding", "Content Marketing"],
  },
  {
    id: 3,
    category: "Content Strategy",
    client: "Healthful Living",
    title: "Authority-Building Content",
    description:
      "Developed a content ecosystem that drove organic traffic by 300% and established them as a trusted health resource. This included in-depth articles, engaging infographics, and a series of successful email marketing campaigns.",
    imageUrl:
      "https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=1932&auto=format&fit=crop",
    services: ["Content Marketing", "SEO"],
  },
  {
    id: 4,
    category: "PPC Campaign",
    client: "NextGen Real Estate",
    title: "Lead Generation Machine",
    description:
      "A highly targeted PPC campaign that generated a 5X return on ad spend and a steady stream of qualified leads. We optimized their campaigns across Google Ads and social media to maximize their marketing budget and impact.",
    imageUrl:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
    services: ["PPC Advertising"],
  },
  {
    id: 5,
    category: "Mobile App Marketing",
    client: "Fit-Track",
    title: "User Acquisition Campaign",
    description: "Launched a multi-channel user acquisition campaign for the Fit-Track mobile app, resulting in over 1 million downloads in the first three months and a 40% reduction in cost per install.",
    imageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=2070&auto=format&fit=crop",
    services: ["App Store Optimization", "Mobile Ads"]
  },
  {
    id: 6,
    category: "B2B Lead Generation",
    client: "Quantum Analytics",
    title: "LinkedIn Outreach Program",
    description: "Developed and executed a highly targeted LinkedIn outreach program that generated a 300% increase in qualified leads for Quantum Analytics' enterprise software solution.",
    imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop",
    services: ["Lead Generation", "B2B Marketing"]
  },
  {
    id: 7,
    category: "Video Marketing",
    client: "Wanderlust Travels",
    title: "Viral Video Campaign",
    description: "Created a viral video campaign that garnered over 10 million views across social media platforms, significantly boosting brand awareness and leading to a record-breaking number of travel bookings.",
    imageUrl: "https://images.unsplash.com/photo-1517586979036-b7d1e89874ce?q=80&w=2070&auto=format&fit=crop",
    services: ["Video Production", "Social Media"]
  },
  {
    id: 8,
    category: "Email Marketing",
    client: "The Artisan Bakery",
    title: "Customer Retention Strategy",
    description: "Designed and implemented an automated email marketing strategy that increased customer retention by 25% and drove a 15% increase in repeat purchases through personalized offers and engaging content.",
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=2070&auto=format&fit=crop",
    services: ["Email Automation", "CRM"]
  }
];

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
                <Button className="mt-8 btn-primary">
                    View Case Study <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
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