import React, { useState, useEffect, useRef } from "react"; // Added React and useRef imports
import { useNavigate, Link } from "react-router-dom";
import { PlusCircle, Upload, X, Trash2, ArrowLeft } from "lucide-react"; // Added Trash2, ArrowLeft
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from 'sonner';
// Removed generateSlug import, function moved inside component
import { databases, storage, ID } from '@/appwriteClient'; // Keep Appwrite imports
import { AppwriteException, Models } from 'appwrite'; // Keep Appwrite imports
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Keep Select imports

// --- Environment Variables (Keep as before) ---
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PROJECTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PROJECTS_COLLECTION_ID;
const STORAGE_BUCKET_ID = import.meta.env.VITE_APPWRITE_PROJECT_IMAGES_BUCKET_ID;
// --- ---

// --- NEW: Metric type ---
interface Metric {
    id: number; // For stable key during mapping
    label: string;
    value: string;
}
// --- ---

// --- Update ProjectDetails Interface ---
interface ProjectDetails {
    challenge: string;
    solutionSteps: string; // Raw text input, will parse later when displaying
    results: {
        metrics: Metric[]; // Array for dynamic metrics
        quote: string;
    };
    gallery: string[]; // Array of Appwrite File IDs or URLs
}
// --- ---

const AddProjectPage = () => {
    const navigate = useNavigate();
    // --- Keep existing state ---
    const [title, setTitle] = useState("");
    const [client, setClient] = useState("");
    const [description, setDescription] = useState("");
    const [challenge, setChallenge] = useState("");
    const [category, setCategory] = useState("");
    const [services, setServices] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [solutionSteps, setSolutionSteps] = useState("");
    const [clientQuote, setClientQuote] = useState("");
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
    const [galleryPreviewUrls, setGalleryPreviewUrls] = useState<string[]>([]);
    const [configError, setConfigError] = useState<string | null>(null);

    // --- NEW STATE for dynamic metrics ---
    const [metrics, setMetrics] = useState<Metric[]>([
        { id: 1, label: "Increase in Sales/Downloads", value: "" }, // Start with one default
    ]);
    const nextMetricId = useRef(2); // For generating unique IDs for new metrics
    // --- ---

    // Moved generateSlug function inside
    const generateSlug = (text: string): string => {
       return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    // --- Keep useEffect for configError check ---
    useEffect(() => {
        if (!DATABASE_ID || !PROJECTS_COLLECTION_ID || !STORAGE_BUCKET_ID) {
            console.error("Appwrite DB/Collection/Bucket IDs missing in .env for Add Project!");
            setConfigError("Configuration error: Cannot connect to storage or database. Please contact support.");
        }
    }, []);

    // --- Keep image handlers ---
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl); // Clean up previous
            setImagePreviewUrl(URL.createObjectURL(file));
        } else {
            setImageFile(null);
             if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
            setImagePreviewUrl(null);
        }
    };

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setGalleryFiles(prev => [...prev, ...filesArray]);

            const newPreviewUrls = filesArray.map(file => URL.createObjectURL(file));
            setGalleryPreviewUrls(prev => [...prev, ...newPreviewUrls]);
        }
    };

    const removeGalleryImage = (indexToRemove: number) => {
        if (galleryPreviewUrls[indexToRemove]) {
            URL.revokeObjectURL(galleryPreviewUrls[indexToRemove]);
        }
        setGalleryFiles(prev => prev.filter((_, index) => index !== indexToRemove));
        setGalleryPreviewUrls(prev => prev.filter((_, index) => index !== indexToRemove));
    };

     // --- Handlers for dynamic metrics ---
    const handleMetricChange = (id: number, field: 'label' | 'value', newValue: string) => {
        setMetrics(prevMetrics =>
            prevMetrics.map(metric =>
                metric.id === id ? { ...metric, [field]: newValue } : metric
            )
        );
    };

    const addMetric = () => {
        if (metrics.length < 3) {
            setMetrics(prevMetrics => [
                ...prevMetrics,
                { id: nextMetricId.current++, label: "", value: "" }
            ]);
        } else {
            toast.info("Maximum of 3 metrics allowed.");
        }
    };

    const removeMetric = (idToRemove: number) => {
        if (metrics.length > 1) {
             setMetrics(prevMetrics => prevMetrics.filter(metric => metric.id !== idToRemove));
        } else {
             toast.info("At least one metric row is required.");
        }
    };
    // --- ---

     // --- Cleanup object URLs on unmount ---
    useEffect(() => {
        return () => {
            if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
            galleryPreviewUrls.forEach(url => URL.revokeObjectURL(url));
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imagePreviewUrl, galleryPreviewUrls]);


    // --- handleSubmit (PLACEHOLDER - We will update this fully later) ---
    // Replace the existing handleSubmit function in AddProjectPage.tsx
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // --- Input & Config Validations ---
        if (configError) {
             toast.error(configError);
             return;
        }
        // Basic required field check (Title, Client, Category, Services, Main Image)
        if (!title || !client || !category || !services || !imageFile) {
            toast.error("Please fill out Title, Client, Category, Services and upload a main image.");
            return;
        }
        // --- ---

        setIsSubmitting(true);
        const toastId = toast.loading("Saving project...");
        let uploadedMainFileId: string | null = null;
        let uploadedGalleryFileIds: string[] = []; // Track IDs for cleanup

        try {
            // --- 1. Upload MAIN project image ---
            console.log(`DEBUG: Uploading main file...`);
            const mainFileResponse = await storage.createFile(
                STORAGE_BUCKET_ID, ID.unique(), imageFile
            );
            uploadedMainFileId = mainFileResponse.$id;
            console.log("DEBUG: Main file upload successful, ID:", uploadedMainFileId);

            // Get main image URL
            const mainImageUrlObject: URL = storage.getFileView(STORAGE_BUCKET_ID, uploadedMainFileId);
            if (!mainImageUrlObject) throw new Error("Could not get view URL for main image.");
            const mainImageUrlString = mainImageUrlObject.toString();
            if (!mainImageUrlString) throw new Error("Failed to convert main image URL to string.");
            console.log("DEBUG: Main image URL:", mainImageUrlString);

            // --- 2. Upload GALLERY images ---
            const galleryImageUrls: string[] = [];
            console.log(`DEBUG: Uploading ${galleryFiles.length} gallery files...`);
            for (const file of galleryFiles) {
                const galleryFileResponse = await storage.createFile(
                    STORAGE_BUCKET_ID, ID.unique(), file
                );
                uploadedGalleryFileIds.push(galleryFileResponse.$id);
                const galleryImageUrlObject: URL = storage.getFileView(STORAGE_BUCKET_ID, galleryFileResponse.$id);
                if (!galleryImageUrlObject) throw new Error(`Could not get view URL for gallery image "${file.name}".`);
                const galleryImageUrlString = galleryImageUrlObject.toString();
                if (!galleryImageUrlString) throw new Error(`Failed to convert gallery image URL to string for "${file.name}".`);
                galleryImageUrls.push(galleryImageUrlString);
            }
            console.log("DEBUG: Gallery images processed. URLs:", galleryImageUrls);

            // --- 3. Prepare `projectDetails` object ---

            // Filter metrics to include only those with both label and value
            const validMetrics = metrics.filter(m => m.label.trim() !== '' && m.value.trim() !== '');
            console.log("DEBUG: Valid metrics being saved:", validMetrics);

            // Construct the details object
            const projectDetails: ProjectDetails = {
                challenge: challenge || '',
                solutionSteps: solutionSteps || '', // Save the raw multiline string
                results: {
                    metrics: validMetrics, // Save the filtered array of metric objects
                    quote: clientQuote || '',
                },
                gallery: galleryImageUrls, // Save the array of gallery image URLs
            };
            console.log("DEBUG: Constructed projectDetails object:", projectDetails);

            // --- 4. Prepare final `projectData` for database ---
            const servicesArray = services.split(',').map(s => s.trim()).filter(s => s !== '');

            const projectData = {
                title,
                client,
                description: description || null,
                category,
                services: servicesArray,
                imageUrl: mainImageUrlString, // Main image URL is top-level
                slug: generateSlug(title),
                details: JSON.stringify(projectDetails), // Stringify the detailed object
            };
            console.log("DEBUG: Final projectData for database:", projectData);

            // --- 5. Insert document into Appwrite 'projects' table ---
            await databases.createDocument(
                DATABASE_ID,
                PROJECTS_COLLECTION_ID,
                ID.unique(),
                projectData
            );
            console.log("DEBUG: Project document created successfully.");

            toast.success("Project created successfully!", { id: toastId });
            navigate('/admin'); // Redirect on success

        } catch (error: any) {
             // --- Keep existing catch block ---
             console.error("Error creating project:", error);
             let errorMsg = `Failed to create project: ${error.message || 'Please try again.'}`;
             // ... (Keep AppwriteException parsing if desired) ...
              if (error instanceof AppwriteException) {
                 if (error.code === 401 || error.code === 403) {
                     errorMsg = "Permission denied. Check permissions for Storage Bucket or Projects Collection.";
                 } else if (error.code === 404) {
                      errorMsg = "Database/Collection/Bucket ID might be incorrect.";
                 } else if (error.message.includes('Invalid document structure') || error.code === 400 ) {
                     errorMsg = "Data format error. Check Appwrite attributes (e.g., 'services' array, 'details' string, required fields)."; // Updated message
                 } else if (error.message.includes('file_size')) {
                     errorMsg = "An image file size exceeds the limit set in the Appwrite bucket.";
                 }
             }

             // --- Cleanup Logic (Keep as before) ---
             const cleanupFiles = async () => {
                 if (uploadedMainFileId) {
                     console.warn("Attempting to delete orphaned main file:", uploadedMainFileId);
                     try { await storage.deleteFile(STORAGE_BUCKET_ID, uploadedMainFileId); }
                     catch (e) { console.error("Failed to delete orphaned main file:", e); }
                 }
                 for (const fileId of uploadedGalleryFileIds) {
                     console.warn("Attempting to delete orphaned gallery file:", fileId);
                     try { await storage.deleteFile(STORAGE_BUCKET_ID, fileId); }
                     catch (e) { console.error("Failed to delete orphaned gallery file:", e); }
                 }
             };
             if (uploadedMainFileId || uploadedGalleryFileIds.length > 0) {
                 cleanupFiles();
                 errorMsg += " (Cleanup attempted)";
             }
             // --- End Cleanup ---

             toast.error(errorMsg, { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };
    // --- ---


    // --- JSX Structure Updated ---
    return (
        <div className="flex flex-col min-h-screen bg-muted/40">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Back Link */}
                <div className="mb-4">
                    <Link to="/admin" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Dashboard
                    </Link>
                </div>

                {configError && (
                     <div className="mb-4 p-4 text-sm text-destructive-foreground bg-destructive rounded-md">
                        {configError}
                     </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* --- Left Column (Main Details + New Fields) --- */}
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Project Details</CardTitle>
                                <CardDescription>Core information, solution, results, and feedback.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Title, Client, Description, Challenge */}
                                <div className="space-y-2">
                                    <Label htmlFor="title">Project Title</Label>
                                    <Input id="title" placeholder="e.g. Complete Digital Overhaul" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="client">Client Name</Label>
                                    <Input id="client" placeholder="e.g. UrbanBloom" value={client} onChange={(e) => setClient(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Short Description</Label>
                                    <Textarea id="description" placeholder="Brief summary for project list page." value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="challenge">The Challenge</Label>
                                    <Textarea id="challenge" placeholder="Describe the client's problem." value={challenge} onChange={(e) => setChallenge(e.target.value)} rows={5} />
                                </div>
                                {/* Solution Steps */}
                                <div className="space-y-2">
                                    <Label htmlFor="solutionSteps">Our Solution Steps</Label>
                                    <Textarea
                                        id="solutionSteps"
                                        placeholder={"Describe steps, one per line (e.g., Title: Description)\nPhase 1: Research: Details...\nPhase 2: Strategy: Details..."}
                                        value={solutionSteps}
                                        onChange={(e) => setSolutionSteps(e.target.value)}
                                        rows={7}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Use format "Title: Description" per line.
                                    </p>
                                </div>

                                {/* Dynamic Metrics Section */}
                                <div className="space-y-4 pt-4 border-t border-border mt-6">
                                    <div className="flex justify-between items-center">
                                         <h3 className="text-lg font-semibold">Key Results / Metrics (Max 3)</h3>
                                         <Button type="button" size="sm" variant="outline" onClick={addMetric} disabled={metrics.length >= 3}>
                                            <PlusCircle className="h-4 w-4 mr-2"/> Add Metric
                                         </Button>
                                    </div>
                                    {metrics.map((metric, index) => (
                                        <div key={metric.id} className="flex items-end gap-2">
                                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                <div className="space-y-1">
                                                     <Label htmlFor={`metric-label-${metric.id}`} className="text-xs">Metric Label {index + 1}</Label>
                                                     <Input
                                                        id={`metric-label-${metric.id}`}
                                                        placeholder={index === 0 ? "e.g., Increase in Leads" : "Custom Metric Label"}
                                                        value={metric.label}
                                                        onChange={(e) => handleMetricChange(metric.id, 'label', e.target.value)}
                                                        required // Make labels required if they have a value
                                                     />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label htmlFor={`metric-value-${metric.id}`} className="text-xs">Value {index + 1}</Label>
                                                    <Input
                                                        id={`metric-value-${metric.id}`}
                                                        placeholder="e.g., 300% or 5X ROAS"
                                                        value={metric.value}
                                                        onChange={(e) => handleMetricChange(metric.id, 'value', e.target.value)}
                                                        required // Make values required if they have a label
                                                    />
                                                </div>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeMetric(metric.id)}
                                                disabled={metrics.length <= 1}
                                                className="mb-1 text-muted-foreground hover:text-destructive disabled:text-muted-foreground/50 h-9 w-9" // Match input height
                                                aria-label={`Remove Metric ${index + 1}`}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                {/* Client Feedback */}
                                <div className="space-y-2 pt-4 border-t border-border mt-6">
                                    <Label htmlFor="clientQuote">Client Feedback / Quote</Label>
                                    <Textarea
                                        id="clientQuote"
                                        placeholder="Enter client testimonial here."
                                        value={clientQuote}
                                        onChange={(e) => setClientQuote(e.target.value)}
                                        rows={4}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* --- Right Column (Metadata, Images, Submit) --- */}
                    <div className="space-y-6">
                        {/* Project Metadata Card */}
                        <Card>
                             <CardHeader>
                                <CardTitle>Project Metadata</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                 {/* Category Select */}
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select onValueChange={setCategory} value={category} required>
                                        <SelectTrigger id="category" className="w-full">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {/* Keep options */}
                                            <SelectItem value="E-Commerce Growth">E-Commerce Growth</SelectItem>
                                            <SelectItem value="SaaS Branding">SaaS Branding</SelectItem>
                                            <SelectItem value="Content Strategy">Content Strategy</SelectItem>
                                            <SelectItem value="PPC Campaign">PPC Campaign</SelectItem>
                                            <SelectItem value="Mobile App Marketing">Mobile App Marketing</SelectItem>
                                            <SelectItem value="B2B Lead Generation">B2B Lead Generation</SelectItem>
                                            <SelectItem value="Video Marketing">Video Marketing</SelectItem>
                                            <SelectItem value="Email Marketing">Email Marketing</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {/* Services Input */}
                                <div className="space-y-2">
                                    <Label htmlFor="services">Services Provided</Label>
                                    <Input
                                        id="services"
                                        placeholder="SEO, PPC, Branding"
                                        value={services}
                                        onChange={(e) => setServices(e.target.value)}
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Separate services with a comma.
                                    </p>
                                </div>
                                {/* Main Image Upload */}
                                <div className="grid w-full items-center gap-1.5 pt-4 border-t">
                                     <Label htmlFor="main-image-upload" className="mt-2">Project Main Image</Label>
                                     {/* ... (Keep existing Label/Input/Button for main image) ... */}
                                      <div className="flex items-center justify-center w-full">
                                        <label
                                            htmlFor="main-image-upload"
                                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-secondary hover:bg-secondary/80"
                                        >
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                                {imagePreviewUrl ? (
                                                    <img src={imagePreviewUrl} alt="Main Image Preview" className="w-auto h-24 object-contain rounded-md p-1" /> // Adjusted height/padding
                                                ) : (
                                                    <>
                                                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                                        <p className="mb-1 text-sm text-muted-foreground">
                                                            <span className="font-semibold">Click or drag</span> main image
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">PNG, JPG, WEBP (Required)</p>
                                                    </>
                                                )}
                                            </div>
                                            <Input id="main-image-upload" type="file" className="hidden" onChange={handleImageChange} accept="image/*" required={!imageFile} />
                                        </label>
                                    </div>
                                    {imagePreviewUrl && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="mt-2 w-full" // Make button full width
                                            onClick={() => { if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl); setImageFile(null); setImagePreviewUrl(null); }}
                                        >
                                            <X className="h-4 w-4 mr-2" /> Remove Main Image
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* --- MOVED: Project Gallery Card --- */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Project Gallery</CardTitle>
                                <CardDescription>Upload additional images.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid w-full items-center gap-1.5">
                                    <Label htmlFor="gallery-upload">Add Gallery Images</Label>
                                    <Input id="gallery-upload" type="file" multiple onChange={handleGalleryChange} accept="image/*" className="text-sm file:mr-2 file:rounded-full file:border-0 file:bg-primary/10 file:px-3 file:py-1 file:text-primary file:text-sm hover:file:bg-primary/20"/>
                                </div>
                                {galleryPreviewUrls.length > 0 && (
                                    <div className="grid grid-cols-3 gap-2 mt-4">
                                        {galleryPreviewUrls.map((url, index) => (
                                            <div key={index} className="relative group aspect-square">
                                                <img src={url} alt={`Gallery Preview ${index+1}`} className="w-full h-full object-cover rounded-md border" />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                    onClick={() => removeGalleryImage(index)}
                                                    aria-label={`Remove gallery image ${index + 1}`}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                         {/* --- END MOVED: Project Gallery Card --- */}

                        {/* Save Button */}
                        <Button type="submit" size="lg" className="w-full btn-primary" disabled={isSubmitting || !!configError}>
                            {isSubmitting ? "Saving..." : "Save Project"}
                        </Button>
                    </div>
                </form>
            </main>
            <Footer />
        </div>
    );
};

export default AddProjectPage;