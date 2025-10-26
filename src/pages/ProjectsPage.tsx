import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";
import React, { useState, useEffect } from "react"; // Import hooks
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
// 1. Import Appwrite client, Query, Models, Exception
import { databases } from '@/appwriteClient'; // Only import what your file actually exports
import { Query, Models, AppwriteException } from 'appwrite'; // Import Query, Models, AppwriteException from the SDK
import { Skeleton } from "@/components/ui/skeleton"; // For loading state
import { toast } from 'sonner';

// --- Get Appwrite IDs from .env ---
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PROJECTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PROJECTS_COLLECTION_ID;
// --- ---

// Define the structure for the 'details' JSONB field (as defined in AddProjectPage)
interface ProjectDetails {
    challenge: string;
    solution: { title: string; description: string }[];
    results: {
        increaseInSales: string;
        increaseInTraffic: string;
        roas: string;
        quote: string;
    };
    gallery: string[];
}

// Interface for project data fetched from Appwrite
// Extend Models.Document for Appwrite metadata like $id
interface Project extends Models.Document {
    title: string;
    client: string;
    description?: string | null;
    category: string;
    services: string[]; // Appwrite stores this as an array
    imageUrl: string; // The URL stored during creation
    slug: string;
    details: string; // Stored as a JSON string in Appwrite
    // Parsed details object added after fetching
    parsedDetails?: ProjectDetails;
}


// --- ProjectSection Component (No changes needed) ---
const ProjectSection = ({ project, imagePosition }: { project: Project, imagePosition: 'left' | 'right' }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Image Column */}
        <div className={`lg:order-${imagePosition === 'left' ? 1 : 2}`}>
            <div className="rounded-2xl overflow-hidden shadow-lg max-h-[380px]">
                {/* Use imageUrl from fetched project data */}
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
                    {/* Use services array from fetched project data */}
                    {project.services.map((service) => (
                        <span
                            key={service}
                            className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-foreground"
                        >
                            {service}
                        </span>
                    ))}
                </div>
                {/* Use slug from fetched project data */}
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
    // 2. Add State for projects, loading, error, pagination
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 4; // Keep pagination logic for now
    const [totalProjects, setTotalProjects] = useState(0); // Track total for pagination

    // Calculate total pages based on fetched total
    const totalPages = Math.ceil(totalProjects / projectsPerPage);

    // 3. Implement useEffect to fetch projects
    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            setError(null);

            if (!DATABASE_ID || !PROJECTS_COLLECTION_ID) {
                 console.error("Appwrite DB/Collection IDs missing for Projects!");
                 setError("Configuration error: Cannot load projects.");
                 setLoading(false);
                 return;
            }

            // Calculate offset for Appwrite pagination
            const offset = (currentPage - 1) * projectsPerPage;

            try {
                console.log(`Fetching projects: Limit=${projectsPerPage}, Offset=${offset}`);
                const response = await databases.listDocuments(
                    DATABASE_ID,
                    PROJECTS_COLLECTION_ID,
                    [
                        Query.limit(projectsPerPage),
                        Query.offset(offset),
                        Query.orderDesc('$createdAt') // Order newest first
                    ]
                );
                console.log("Appwrite fetch response:", response);

                // Attempt to parse 'details' JSON string for each project
                const parsedProjects = response.documents.map(doc => {
                    let parsedDetails: ProjectDetails | undefined = undefined;
                    try {
                        if (doc.details && typeof doc.details === 'string') {
                            parsedDetails = JSON.parse(doc.details);
                        } else if (doc.details) { // If it's somehow already an object
                             parsedDetails = doc.details as ProjectDetails;
                        }
                    } catch (e) {
                        console.error(`Failed to parse details JSON for project ${doc.$id}:`, doc.details, e);
                        // Assign default structure or leave undefined based on requirements
                        parsedDetails = { challenge: "Error loading details.", solution: [], results: {increaseInSales: "", increaseInTraffic: "", roas: "", quote:""}, gallery:[] };
                    }
                    return { ...doc, parsedDetails } as Project;
                });

                setProjects(parsedProjects);
                setTotalProjects(response.total); // Update total count from response

            } catch (err: any) {
                console.error("Error fetching projects:", err);
                let errorMsg = `Failed to fetch projects: ${err.message || 'Unknown error'}`;
                 if (err instanceof AppwriteException) {
                     if (err.code === 401 || err.code === 403) {
                         errorMsg = "Permission denied. Ensure 'any' or 'users' have read access to the projects collection.";
                     } else if (err.code === 404) {
                         errorMsg = "Database or Projects Collection ID might be incorrect.";
                     }
                 }
                setError(errorMsg);
                toast.error(errorMsg);
                setProjects([]);
                setTotalProjects(0);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
        // Re-fetch when currentPage changes
    }, [currentPage]);

    // handlePageChange remains the same
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // 4. Update Rendering Logic
    return (
        <div className="bg-background">
            <Header />
            <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
                {/* Page Header (No change) */}
                <div className="text-center mb-8">
                    {/* ... keep AuroraTextEffect and description ... */}
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
                    {loading ? (
                        // Loading State
                        <>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                                <Skeleton className="rounded-2xl w-full h-[380px]" />
                                <div className="space-y-4">
                                    <Skeleton className="h-6 w-1/4" />
                                    <Skeleton className="h-10 w-3/4" />
                                    <Skeleton className="h-20 w-full" />
                                    <div className="flex gap-2"> <Skeleton className="h-8 w-20 rounded-full" /><Skeleton className="h-8 w-20 rounded-full" /></div>
                                    <Skeleton className="h-12 w-48 rounded-full" />
                                </div>
                            </div>
                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                                <Skeleton className="rounded-2xl w-full h-[380px] lg:order-2" />
                                <div className="space-y-4 lg:order-1">
                                    <Skeleton className="h-6 w-1/4" />
                                    <Skeleton className="h-10 w-3/4" />
                                    <Skeleton className="h-20 w-full" />
                                    <div className="flex gap-2"> <Skeleton className="h-8 w-20 rounded-full" /><Skeleton className="h-8 w-20 rounded-full" /></div>
                                    <Skeleton className="h-12 w-48 rounded-full" />
                                </div>
                            </div>
                        </>
                    ) : error ? (
                        // Error State
                        <div className="text-center py-12 text-destructive">
                            <p>Error loading projects: {error}</p>
                        </div>
                    ) : projects.length === 0 ? (
                         // No Projects State
                        <div className="text-center py-12 text-muted-foreground">
                            <p>No projects found.</p>
                        </div>
                    ) : (
                        // Display Projects
                        projects.map((project, index) => (
                            // Use Appwrite document ID $id as key
                            <ProjectSection key={project.$id} project={project} imagePosition={index % 2 === 0 ? 'left' : 'right'} />
                        ))
                    )}
                </div>

                {/* Pagination (Only show if not loading, no error, and more than one page) */}
                {!loading && !error && totalPages > 1 && (
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
                                        // Disable if on first page
                                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
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
                                        // Disable if on last page
                                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default ProjectsPage;