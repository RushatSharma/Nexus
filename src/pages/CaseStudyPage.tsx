import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProjects } from "./ProjectsPage"; // <-- Changed: Import data from ProjectsPage
import NotFound from "./NotFound";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart, CheckCircle, Target } from "lucide-react";

// NOTE: This component no longer fetches from Firebase.
// It synchronously gets data from the projects array.

const CaseStudyPage = () => {
    const { projectSlug } = useParams();
    
    // Get the projects from the hardcoded array
    const projects = getProjects(); 
    const project = projects.find(p => p.slug === projectSlug);

    // If no project is found for the slug, or it doesn't have details, show the Not Found page.
    if (!project || !project.details) {
        return <NotFound />;
    }

    const { client, title, imageUrl, details } = project;

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
                    <img src={imageUrl} alt={title} className="rounded-2xl shadow-lg w-full max-h-[500px] object-cover" />
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="bg-muted p-6 rounded-xl">
                            <h3 className="text-4xl font-bold text-primary">{details.results.increaseInSales}</h3>
                            <p className="mt-2 text-muted-foreground">Increase in Sales/Downloads</p>
                        </div>
                        <div className="bg-muted p-6 rounded-xl">
                            <h3 className="text-4xl font-bold text-primary">{details.results.increaseInTraffic}</h3>
                            <p className="mt-2 text-muted-foreground">Increase in Traffic/Metric</p>
                        </div>
                        <div className="bg-muted p-6 rounded-xl">
                            <h3 className="text-4xl font-bold text-primary">{details.results.roas}</h3>
                            <p className="mt-2 text-muted-foreground">Return on Ad Spend</p>
                        </div>
                    </div>
                </section>

                {/* Challenge & Solution */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    <div>
                        <h2 className="text-3xl font-bold text-foreground mb-4">The Challenge</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">{details.challenge}</p>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-foreground mb-4">Our Solution</h2>
                        <div className="space-y-6">
                            {details.solution.map((item, index) => (
                                <div key={index} className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-full">
                                        {index === 0 && <BarChart className="w-6 h-6" />}
                                        {index === 1 && <Target className="w-6 h-6" />}
                                        {index === 2 && <CheckCircle className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-foreground">{item.title}</h4>
                                        <p className="text-muted-foreground">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                
                {details.gallery && details.gallery.length > 0 && (
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold text-foreground text-center mb-8">Project Gallery</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {details.gallery.map((img, index) => (
                                <img key={index} src={img} alt={`${title} gallery image ${index + 1}`} className="rounded-lg shadow-md object-cover w-full h-64" />
                            ))}
                        </div>
                    </section>
                )}

                {details.results.quote && (
                    <section className="bg-muted rounded-2xl p-8 lg:p-12 text-center mb-16">
                        <blockquote className="max-w-3xl mx-auto">
                            <p className="text-2xl font-medium text-foreground">"{details.results.quote}"</p>
                            <footer className="mt-6 text-lg font-semibold text-primary">- {client}</footer>
                        </blockquote>
                    </section>
                )}
                
                <section className="text-center">
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