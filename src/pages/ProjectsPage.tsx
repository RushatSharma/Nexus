import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";
import React from "react";
import { AuroraTextEffect } from "@/components/AuroraTextEffect"; // import AuroraTextEffect

// --- Project Data ---
const projects = [
  {
    id: 1,
    category: "E-Commerce Growth",
    client: "UrbanBloom",
    title: "Complete Digital Overhaul",
    description:
      "We took UrbanBloom from a local favorite to a national brand with a full-funnel marketing strategy.",
    imageUrl:
      "https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    services: ["SEO", "PPC", "Social Media"],
    layout: "col-span-12 lg:col-span-8",
  },
  {
    id: 2,
    category: "SaaS Branding",
    client: "Innovate AI",
    title: "Brand Identity & Launch",
    description:
      "Crafting a powerful brand identity that positioned Innovate AI as a leader in the tech space from day one.",
    imageUrl:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    services: ["Branding", "Content Marketing"],
    layout: "col-span-12 lg:col-span-4",
  },
  {
    id: 3,
    category: "Content Strategy",
    client: "Healthful Living",
    title: "Authority-Building Content",
    description:
      "Developed a content ecosystem that drove organic traffic by 300% and established them as a trusted health resource.",
    imageUrl:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    services: ["Content Marketing", "SEO"],
    layout: "col-span-12 lg:col-span-5",
  },
  {
    id: 4,
    category: "PPC Campaign",
    client: "NextGen Real Estate",
    title: "Lead Generation Machine",
    description:
      "A highly targeted PPC campaign that generated a 5X return on ad spend and a steady stream of qualified leads.",
    imageUrl:
      "https://images.unsplash.com/photo-1560518883-ce09059ee41F?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    services: ["PPC Advertising"],
    layout: "col-span-12 lg:col-span-7",
  },
];

const ProjectCard = ({ project }: { project: (typeof projects)[0] }) => (
  <div
    className={`${project.layout} group relative h-[500px] w-full overflow-hidden rounded-xl`}
  >
    <div
      className="absolute inset-0 h-full w-full transform bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110"
      style={{ backgroundImage: `url(${project.imageUrl})` }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
    <div className="relative flex h-full flex-col justify-end p-6 md:p-8">
      <h3 className="text-lg font-semibold text-primary">{project.client}</h3>
      <h2 className="mt-2 text-3xl font-bold text-white transition-colors duration-300 group-hover:text-primary-light md:text-4xl">
        {project.title}
      </h2>
      <p className="mt-4 max-w-lg text-gray-300">{project.description}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        {project.services.map((service) => (
          <span
            key={service}
            className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm"
          >
            {service}
          </span>
        ))}
      </div>
      <a
        href="#"
        className="mt-8 flex items-center text-lg font-semibold text-white transition-transform duration-300 group-hover:translate-x-2"
      >
        View Project <ArrowRight className="ml-2 h-5 w-5" />
      </a>
    </div>
  </div>
);

const ProjectsPage = () => {
  return (
    <div className="bg-background">
      <Header /> {/* ✅ Show only Home link */}
      <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center">
          <AuroraTextEffect
            text="Transforming Ideas into Impactful Digital Experiences"
            fontSize="clamp(2rem, 5vw, 3rem)" // reduced size
            className="flex justify-center items-center p-0 m-0 text-center" // center-aligned
            textClassName="tracking-tight font-extrabold text-foreground text-center"
          />
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-center">
            From startups to industry leaders, we partner with ambitious brands to
            craft digital solutions that not only look stunning but deliver measurable results. 
            Dive into a showcase of projects that inspire, engage, and drive business growth.
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="mt-20 grid grid-cols-12 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectsPage;