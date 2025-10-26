import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotFound from "./NotFound";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart, CheckCircle, Target } from "lucide-react";
// 1. Add Carousel Imports
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { databases } from '@/appwriteClient'; // Only import what your file actually exports
import { Query, Models, AppwriteException } from 'appwrite';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from 'sonner';
import { cn } from "@/lib/utils"; // Import cn utility

// --- Environment Variables & Interfaces (Keep as before) ---
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PROJECTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PROJECTS_COLLECTION_ID;

interface Metric { id: number; label: string; value: string; } // Added metric type

interface ProjectDetails {
    challenge: string;
    // Assuming solutionSteps is stored as string and needs parsing
    solutionSteps: string; // Keep as string matching AddProjectPage state
    results: {
        metrics: Metric[]; // Array of metric objects
        quote: string;
    };
    gallery: string[]; // Array of image URLs
}

interface Project extends Models.Document {
    title: string;
    client: string;
    imageUrl: string;
    slug: string;
    details: string; // Stored as JSON string
    parsedDetails?: ProjectDetails;
}

// Helper to parse solution steps string
const parseSolutionSteps = (stepsString: string | undefined): { title: string; description: string }[] => {
    if (!stepsString) return [];
    return stepsString.split('\n')
        .map(line => line.trim())
        .filter(line => line.includes(':'))
        .map(line => {
            const parts = line.split(':');
            const title = parts[0]?.trim() || 'Step';
            const description = parts.slice(1).join(':').trim() || '';
            return { title, description };
        });
};


const CaseStudyPage = () => {
    const { projectSlug } = useParams<{ projectSlug: string }>();
    const [project, setProject] = useState<Project | null | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- Fetch Project useEffect (Keep as before) ---
    useEffect(() => {
        // ... (keep existing fetch logic) ...
        if (!projectSlug) { /* ... */ return; }
        const fetchProject = async () => {
             setLoading(true); setError(null);
             if (!DATABASE_ID || !PROJECTS_COLLECTION_ID) { /* ... */ return; }
             try {
                const response = await databases.listDocuments(
                    DATABASE_ID, PROJECTS_COLLECTION_ID,
                    [Query.equal('slug', projectSlug), Query.limit(1)]
                );
                if (response.documents.length > 0) {
                    const doc = response.documents[0];
                    let parsedDetails: ProjectDetails | undefined = undefined;
                    try {
                        if (doc.details && typeof doc.details === 'string') {
                            parsedDetails = JSON.parse(doc.details);
                        } else { throw new Error("Details missing/invalid."); }
                    } catch (e) {
                         console.error(`Parse error for ${doc.$id}:`, e);
                         setError("Error loading project details format.");
                         parsedDetails = { challenge: "Error loading details.", solutionSteps: "", results: {metrics:[], quote:""}, gallery:[] };
                    }
                    setProject({ ...doc, parsedDetails } as Project);
                } else { setProject(null); }
            } catch (err: any) {
                 console.error("Fetch error:", err); setError(`Failed to fetch project: ${err.message || 'Unknown'}`); setProject(null);
            } finally { setLoading(false); }
        };
        fetchProject();
    }, [projectSlug]);


    // --- Loading State (Keep as before) ---
    if (loading) {
         return ( /* ... keep skeleton JSX ... */
             <div className="bg-background">
                <Header />
                 <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-12">
                     <section className="text-center">
                         <Skeleton className="h-6 w-1/4 mx-auto mb-2" />
                         <Skeleton className="h-12 w-3/4 mx-auto" />
                     </section>
                     <section>
                         <Skeleton className="rounded-2xl w-full h-[300px] md:h-[500px]" />
                         <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                             <Skeleton className="h-24 rounded-xl" />
                             <Skeleton className="h-24 rounded-xl" />
                             <Skeleton className="h-24 rounded-xl" />
                         </div>
                     </section>
                     <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                          <Skeleton className="h-48 rounded-xl" />
                          <Skeleton className="h-48 rounded-xl" />
                     </section>
                 </main>
                <Footer />
            </div>
        );
    }

    // --- Error State (Keep as before) ---
    if (error) {
        return ( /* ... keep error JSX ... */
             <div className="bg-background">
                 <Header />
                 <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 text-center">
                    <p className="text-destructive">Error loading project: {error}</p>
                    <Link to="/projects"><Button variant="link">Back to Projects</Button></Link>
                 </main>
                 <Footer />
             </div>
        );
    }

    // --- Not Found State (Keep as before) ---
    if (project === null) {
        return <NotFound />;
    }

    const { client, title, imageUrl, parsedDetails } = project;
    if (!parsedDetails) return <NotFound />; // Fallback

    // Parse solution steps here for rendering
    const solutionStepsArray = parseSolutionSteps(parsedDetails.solutionSteps);

    return (
        <div className="bg-background">
            <Header />
            <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <section className="text-center mb-16">
                    <p className="text-lg font-semibold text-primary">{client}</p>
                    <h1 className="mt-2 text-4xl lg:text-6xl font-extrabold text-foreground tracking-tight">
                        {title}
                    </h1>
                </section>

                {/* Main Image & Overview */}
                <section className="mb-16">
                    {/* 2. Changed object-cover to object-contain, added bg */}
                    <div className="rounded-2xl shadow-lg w-full max-h-[500px] flex justify-center items-center bg-muted/50 overflow-hidden">
                        <img src={imageUrl} alt={title} className="w-full h-full object-contain" />
                    </div>

                    {/* Display metrics from parsedDetails.results.metrics */}
                    {parsedDetails.results?.metrics && parsedDetails.results.metrics.length > 0 && (
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                             {parsedDetails.results.metrics.map((metric) => (
                                <div key={metric.id || metric.label} className="bg-muted p-6 rounded-xl">
                                    <h3 className="text-4xl font-bold text-primary">{metric.value || 'N/A'}</h3>
                                    <p className="mt-2 text-muted-foreground">{metric.label || 'Metric'}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Challenge & Solution */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    <div>
                        <h2 className="text-3xl font-bold text-foreground mb-4">The Challenge</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">{parsedDetails.challenge || 'Not specified.'}</p>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-foreground mb-4">Our Solution</h2>
                        {/* Display parsed solution steps */}
                        {solutionStepsArray.length > 0 ? (
                            <div className="space-y-6">
                                {solutionStepsArray.map((item, index) => (
                                    <div key={index} className="flex items-start space-x-4">
                                        <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-full">
                                            {index === 0 && <BarChart className="w-6 h-6" />}
                                            {index === 1 && <Target className="w-6 h-6" />}
                                            {index >= 2 && <CheckCircle className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-foreground">{item.title}</h4>
                                            <p className="text-muted-foreground">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground">Solution details not available.</p>
                        )}
                    </div>
                </section>

                {/* 3. Implement Gallery Carousel */}
                {parsedDetails.gallery && parsedDetails.gallery.length > 0 && (
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold text-foreground text-center mb-8">Project Gallery</h2>
                        <Carousel
                            opts={{
                                align: "start",
                                loop: parsedDetails.gallery.length > 1, // Loop only if more than 1 image
                            }}
                            className="w-full max-w-4xl mx-auto" // Adjust max-width as needed
                        >
                            <CarouselContent>
                                {parsedDetails.gallery.map((imgSrc, index) => (
                                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3"> {/* Show 1, 2 or 3 items */}
                                        <div className="p-1">
                                             {/* Changed object-cover to object-contain, added bg */}
                                            <div className="aspect-video flex justify-center items-center bg-muted/50 rounded-lg overflow-hidden border">
                                                <img
                                                    src={imgSrc}
                                                    alt={`${title} gallery image ${index + 1}`}
                                                    className="object-contain h-full w-full"
                                                 />
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                             {/* Only show Previous/Next if more items than fit on screen (e.g., > 3 for lg) */}
                            {parsedDetails.gallery.length > 3 && (
                                <>
                                    <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2 hidden lg:inline-flex" />
                                    <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2 hidden lg:inline-flex" />
                                </>
                             )}
                        </Carousel>
                    </section>
                )}

                {/* Quote (using parsedDetails) */}
                {parsedDetails.results?.quote && (
                    <section className="bg-muted rounded-2xl p-8 lg:p-12 text-center mb-16">
                        {/* ... keep existing quote JSX ... */}
                         <blockquote className="max-w-3xl mx-auto">
                            <p className="text-2xl font-medium text-foreground">"{parsedDetails.results.quote}"</p>
                            <footer className="mt-6 text-lg font-semibold text-primary">- {client}</footer>
                        </blockquote>
                    </section>
                )}

                {/* CTA (Keep as before) */}
                <section className="text-center">
                    {/* ... keep existing CTA JSX ... */}
                    <h2 className="text-3xl font-bold text-foreground">Have a similar project?</h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Let's talk about how we can help you achieve your business goals.
                    </p>
                    <Link to="/contact">
                        <Button size="lg" className="mt-8 btn-primary">
                            Get in Touch <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default CaseStudyPage;