import React, { useState, useEffect, useRef } from "react";
// 1. Import useParams
import { useParams, useNavigate, Link } from "react-router-dom";
import { Save, Upload, X, Trash2, ArrowLeft, PlusCircle } from "lucide-react"; // <-- Add PlusCircle here // Changed icon
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from 'sonner';
import { databases, storage, ID } from '@/appwriteClient'; // Keep Appwrite imports
import { AppwriteException, Models } from 'appwrite'; // Keep Appwrite imports
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

// --- Environment Variables (Keep as before) ---
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PROJECTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PROJECTS_COLLECTION_ID;
const STORAGE_BUCKET_ID = import.meta.env.VITE_APPWRITE_PROJECT_IMAGES_BUCKET_ID;
// --- ---

// --- Interfaces (Keep as before) ---
interface Metric { id: number | string; label: string; value: string; } // Allow string ID for initial load
interface ProjectDetails {
    challenge: string;
    solutionSteps: string;
    results: { metrics: Metric[]; quote: string; };
    gallery: string[]; // URLs
}
interface Project extends Models.Document { // For fetched data
    title: string; client: string; description?: string | null; category: string; services: string[]; imageUrl: string; slug: string; details: string;
}
// --- ---

// 2. Renamed Component
const EditProjectPage = () => {
    // 3. Get projectId from URL
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();

    // --- Keep existing form state, but initialize empty ---
    const [title, setTitle] = useState("");
    const [client, setClient] = useState("");
    const [description, setDescription] = useState("");
    const [challenge, setChallenge] = useState("");
    const [category, setCategory] = useState("");
    const [services, setServices] = useState(""); // Comma-separated string for input
    const [solutionSteps, setSolutionSteps] = useState("");
    const [metrics, setMetrics] = useState<Metric[]>([]); // Initialize empty
    const nextMetricId = useRef(0); // Initialize at 0, will update based on fetched data
    const [clientQuote, setClientQuote] = useState("");

    // --- State for Images ---
    // Main Image
    const [currentMainImageUrl, setCurrentMainImageUrl] = useState<string | null>(null); // From DB
    const [newMainImageFile, setNewMainImageFile] = useState<File | null>(null); // New upload
    const [mainImagePreviewUrl, setMainImagePreviewUrl] = useState<string | null>(null); // For new upload preview

    // Gallery Images
    const [currentGalleryUrls, setCurrentGalleryUrls] = useState<string[]>([]); // From DB
    const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]); // New uploads
    const [galleryPreviewUrls, setGalleryPreviewUrls] = useState<string[]>([]); // For new upload previews

    // --- General State ---
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFetching, setIsFetching] = useState(true); // State for initial data load
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [configError, setConfigError] = useState<string | null>(null); // Keep config check

    // Moved generateSlug function inside
    const generateSlug = (text: string): string => { /* ... keep function ... */
        return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    };

    // --- useEffect for configError check (Keep as before) ---
     useEffect(() => { /* ... keep config check ... */
         if (!DATABASE_ID || !PROJECTS_COLLECTION_ID || !STORAGE_BUCKET_ID) {
            setConfigError("Configuration error...");
         }
     }, []);

    // --- 4. useEffect to Fetch Project Data ---
    useEffect(() => {
        if (!projectId) {
            setFetchError("Project ID is missing from URL.");
            setIsFetching(false);
            return;
        }
        console.log("Fetching project with ID:", projectId);
        setIsFetching(true);
        setFetchError(null);

        const fetchProjectData = async () => {
            try {
                const document = await databases.getDocument<Project>( // Specify type here
                    DATABASE_ID,
                    PROJECTS_COLLECTION_ID,
                    projectId
                );
                console.log("Fetched project data:", document);

                // --- Populate State ---
                setTitle(document.title || "");
                setClient(document.client || "");
                setDescription(document.description || "");
                setCategory(document.category || "");
                setServices(document.services?.join(', ') || ""); // Join array for input field
                setCurrentMainImageUrl(document.imageUrl || null); // Store existing main image URL

                // Parse details JSON
                let details: ProjectDetails | null = null;
                if (document.details && typeof document.details === 'string') {
                    try {
                        details = JSON.parse(document.details);
                    } catch (e) {
                        console.error("Failed to parse project details JSON:", e);
                        toast.error("Error parsing project details.");
                        // Set defaults or handle error state
                         details = { challenge: "", solutionSteps: "", results: { metrics: [], quote: "" }, gallery: [] };
                    }
                } else {
                     details = { challenge: "", solutionSteps: "", results: { metrics: [], quote: "" }, gallery: [] };
                }

                setChallenge(details.challenge || "");
                setSolutionSteps(details.solutionSteps || "");
                setClientQuote(details.results?.quote || "");
                setCurrentGalleryUrls(details.gallery || []); // Store existing gallery URLs

                // Populate metrics, ensuring unique IDs
                const fetchedMetrics = details.results?.metrics || [];
                let maxId = 0;
                const initialMetrics = fetchedMetrics.map((m, index) => {
                    const id = Date.now() + index; // Generate a temporary unique ID
                    if (id > maxId) maxId = id;
                    return { ...m, id };
                });
                 // Ensure at least one metric row exists
                if (initialMetrics.length === 0) {
                     initialMetrics.push({ id: Date.now(), label: "", value: ""});
                     maxId = Date.now();
                }
                setMetrics(initialMetrics);
                nextMetricId.current = maxId + 1; // Set ref for next added metric

            } catch (error: any) {
                console.error("Error fetching project:", error);
                let msg = `Failed to load project: ${error.message || 'Unknown error'}`;
                if (error instanceof AppwriteException && error.code === 404) {
                    msg = "Project not found.";
                }
                setFetchError(msg);
                toast.error(msg);
            } finally {
                setIsFetching(false);
            }
        };

        fetchProjectData();

    }, [projectId]); // Re-run if projectId changes


    // --- Image Handlers (Need modification for Edit mode) ---
    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setNewMainImageFile(file); // Store the new file
            // Revoke previous preview URL if exists
            if (mainImagePreviewUrl) URL.revokeObjectURL(mainImagePreviewUrl);
            setMainImagePreviewUrl(URL.createObjectURL(file)); // Show preview of NEW file
        } else {
            setNewMainImageFile(null);
             if (mainImagePreviewUrl) URL.revokeObjectURL(mainImagePreviewUrl);
            setMainImagePreviewUrl(null);
        }
    };
     const removeMainImage = () => {
        // If removing a NEWLY uploaded preview
        if (mainImagePreviewUrl) URL.revokeObjectURL(mainImagePreviewUrl);
        setNewMainImageFile(null);
        setMainImagePreviewUrl(null);
        // If removing the CURRENT image (from DB)
        setCurrentMainImageUrl(null); // Mark for deletion on submit
         // Clear file input visually
         const fileInput = document.getElementById('main-image-upload') as HTMLInputElement;
         if (fileInput) fileInput.value = '';
    };

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
         // --- Logic to add NEW files ---
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setNewGalleryFiles(prev => [...prev, ...filesArray]);

            const newPreviewUrls = filesArray.map(file => URL.createObjectURL(file));
            setGalleryPreviewUrls(prev => [...prev, ...newPreviewUrls]);
        }
    };
    const removeNewGalleryImage = (indexToRemove: number) => {
        // --- Logic to remove NEWLY added files/previews ---
        if (galleryPreviewUrls[indexToRemove]) {
            URL.revokeObjectURL(galleryPreviewUrls[indexToRemove]);
        }
        setNewGalleryFiles(prev => prev.filter((_, index) => index !== indexToRemove));
        setGalleryPreviewUrls(prev => prev.filter((_, index) => index !== indexToRemove));
    };
     const removeCurrentGalleryImage = (indexToRemove: number) => {
        // --- Logic to mark EXISTING gallery images for deletion ---
        setCurrentGalleryUrls(prev => prev.filter((_, index) => index !== indexToRemove));
    };


    // --- Metric Handlers (Keep as before) ---
    const handleMetricChange = (id: number | string, field: 'label' | 'value', newValue: string) => { /* ... */
        setMetrics(prevMetrics => prevMetrics.map(metric => metric.id === id ? { ...metric, [field]: newValue } : metric));
    };
    const addMetric = () => { /* ... */
        if (metrics.length < 3) { setMetrics(prev => [...prev, { id: nextMetricId.current++, label: "", value: "" }]); } else { toast.info("Max 3 metrics."); }
    };
    const removeMetric = (idToRemove: number | string) => { /* ... */
        if (metrics.length > 1) { setMetrics(prev => prev.filter(metric => metric.id !== idToRemove)); } else { toast.info("Min 1 metric."); }
    };
    // --- ---

     // --- Cleanup object URLs on unmount (Keep as before) ---
    useEffect(() => { /* ... */
        return () => {
             if (mainImagePreviewUrl) URL.revokeObjectURL(mainImagePreviewUrl);
             galleryPreviewUrls.forEach(url => URL.revokeObjectURL(url));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mainImagePreviewUrl, galleryPreviewUrls]);


    // --- 5. Modify handleSubmit for Update ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectId) {
            toast.error("Cannot update project: Missing Project ID.");
            return;
        }
        if (configError) { toast.error(configError); return; }
        // Add basic validation if needed
        if (!title || !client || !category || !services) {
            toast.error("Please fill out Title, Client, Category, and Services.");
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading("Updating project...");
        let finalMainImageUrl = currentMainImageUrl; // Start with existing
        const finalGalleryUrls = [...currentGalleryUrls]; // Start with existing kept URLs
        const filesToDelete: string[] = []; // Track Appwrite file IDs to delete

        try {
            // --- Image Handling ---
            // A. Main Image: Delete old if replaced or removed
            const oldMainFileId = currentMainImageUrl ? extractFileIdFromUrl(currentMainImageUrl) : null;
            if (oldMainFileId && (!finalMainImageUrl || newMainImageFile)) {
                 filesToDelete.push(oldMainFileId);
                 console.log("DEBUG: Marked old main image for deletion:", oldMainFileId);
            }
            // B. Main Image: Upload new if added
            if (newMainImageFile) {
                 console.log(`DEBUG: Uploading NEW main file...`);
                 const mainFileResponse = await storage.createFile(STORAGE_BUCKET_ID, ID.unique(), newMainImageFile);
                 const newUrlObj = storage.getFileView(STORAGE_BUCKET_ID, mainFileResponse.$id);
                 if (!newUrlObj) throw new Error("Could not get view URL for NEW main image.");
                 finalMainImageUrl = newUrlObj.toString(); // Update the URL to save
                 console.log("DEBUG: NEW main image URL:", finalMainImageUrl);
            } else if (!currentMainImageUrl && !newMainImageFile) {
                // If the image was removed and no new one added, set URL to null or handle as error if required
                 finalMainImageUrl = null; // Allow removing image if schema permits (or throw error if required)
                 console.log("DEBUG: Main image removed.");
            }

             // C. Gallery Images: Identify deleted existing URLs
            const initialGalleryUrls = (JSON.parse((await databases.getDocument<Project>(DATABASE_ID, PROJECTS_COLLECTION_ID, projectId)).details || '{}') as ProjectDetails)?.gallery || [];
            initialGalleryUrls.forEach(url => {
                 if (!currentGalleryUrls.includes(url)) { // If it's NOT in the current state array, it was removed
                     const fileId = extractFileIdFromUrl(url);
                     if (fileId) filesToDelete.push(fileId);
                 }
            });
             console.log("DEBUG: Marked existing gallery images for deletion:", filesToDelete);


             // D. Gallery Images: Upload new files
             console.log(`DEBUG: Uploading ${newGalleryFiles.length} NEW gallery files...`);
             for (const file of newGalleryFiles) {
                 const galleryFileResponse = await storage.createFile(STORAGE_BUCKET_ID, ID.unique(), file);
                 const newUrlObj = storage.getFileView(STORAGE_BUCKET_ID, galleryFileResponse.$id);
                 if (!newUrlObj) throw new Error(`Could not get view URL for NEW gallery image "${file.name}".`);
                 finalGalleryUrls.push(newUrlObj.toString()); // Add NEW URL to the final list
             }
             console.log("DEBUG: Final gallery URLs to save:", finalGalleryUrls);

            // --- Prepare Data ---
             // Filter metrics (remove ID before saving if it was temporary)
             const validMetrics = metrics
                 .filter(m => m.label.trim() !== '' && m.value.trim() !== '')
                 .map(({ id, ...rest }) => rest); // Remove temporary ID field

             const projectDetails: Omit<ProjectDetails, 'gallery'> & { gallery: string[] } = {
                challenge: challenge || '',
                solutionSteps: solutionSteps || '',
                results: { metrics: validMetrics, quote: clientQuote || '' },
                gallery: finalGalleryUrls, // Use the final list of URLs
             };

            const servicesArray = services.split(',').map(s => s.trim()).filter(s => s !== '');
            const updatedData = {
                title, client, description: description || null, category, services: servicesArray,
                imageUrl: finalMainImageUrl, // Final main image URL (could be null if removed)
                slug: generateSlug(title), // Consider if slug should change on title edit?
                details: JSON.stringify(projectDetails),
            };
            console.log("DEBUG: Final updatedData for database:", updatedData);

            // --- Update Document ---
            await databases.updateDocument(
                DATABASE_ID,
                PROJECTS_COLLECTION_ID,
                projectId,
                updatedData
            );
            console.log("DEBUG: Project document updated successfully.");

            // --- Perform Deletions (after successful update) ---
             console.log("DEBUG: Deleting marked files from storage:", filesToDelete);
             for (const fileId of filesToDelete) {
                 try {
                     await storage.deleteFile(STORAGE_BUCKET_ID, fileId);
                     console.log(`DEBUG: Deleted file ${fileId}`);
                 } catch (delError: any) {
                      // Log error but don't fail the whole process
                     console.error(`Failed to delete file ${fileId}:`, delError);
                     toast.warning(`Failed to delete an old image file (${fileId.substring(0,6)}...). Manual cleanup might be needed.`);
                 }
             }

            toast.success("Project updated successfully!", { id: toastId });
            navigate('/admin'); // Redirect on success

        } catch (error: any) {
             console.error("Error updating project:", error);
             let errorMsg = `Failed to update project: ${error.message || 'Please try again.'}`;
              if (error instanceof AppwriteException) { /* ... keep specific checks ... */ }
             toast.error(errorMsg, { id: toastId });
             // Note: Orphaned *new* files aren't automatically cleaned up here on DB error, could be added
        } finally {
            setIsSubmitting(false);
        }
    };
     // Helper to get Appwrite file ID from URL (basic version)
     const extractFileIdFromUrl = (url: string | null): string | null => {
        if (!url) return null;
        try {
            const urlParts = url.split('/files/');
            if (urlParts.length > 1) {
                return urlParts[1].split('/')[0];
            }
        } catch (e) { console.error("Error extracting file ID:", e); }
        return null;
     };


    // --- Loading / Error / Form Rendering ---
    if (isFetching) {
        return ( /* ... Basic Loading Spinner or Skeleton ... */
             <div className="flex justify-center items-center min-h-screen">Loading project data...</div>
        );
    }
    if (fetchError) {
         return ( /* ... Error Message ... */
             <div className="flex flex-col items-center justify-center min-h-screen">
                 <p className="text-destructive mb-4">{fetchError}</p>
                 <Link to="/admin"><Button variant="outline">Back to Admin</Button></Link>
             </div>
        );
    }

    // --- JSX (Mostly same as AddProjectPage, but uses state populated by fetch) ---
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

                {/* 6. Update Title/Description */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Edit Project Details</CardTitle>
                                <CardDescription>Update the information for this case study.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Title, Client, Desc, Challenge, Solution (Uses state values) */}
                                {/* ... (Inputs using state: title, client, description, challenge, solutionSteps) ... */}
                                <div className="space-y-2">
                                    <Label htmlFor="title">Project Title</Label>
                                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="client">Client Name</Label>
                                    <Input id="client" value={client} onChange={(e) => setClient(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Short Description</Label>
                                    <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="challenge">The Challenge</Label>
                                    <Textarea id="challenge" value={challenge} onChange={(e) => setChallenge(e.target.value)} rows={5} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="solutionSteps">Our Solution Steps</Label>
                                    <Textarea id="solutionSteps" value={solutionSteps} onChange={(e) => setSolutionSteps(e.target.value)} rows={7} />
                                    <p className="text-xs text-muted-foreground">Use format "Title: Description" per line.</p>
                                </div>


                                {/* Dynamic Metrics (Uses state values) */}
                                <div className="space-y-4 pt-4 border-t border-border mt-6">
                                    {/* ... (Keep dynamic metrics JSX) ... */}
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
                                                     <Input id={`metric-label-${metric.id}`} placeholder="e.g., Increase in Leads" value={metric.label} onChange={(e) => handleMetricChange(metric.id, 'label', e.target.value)} required />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label htmlFor={`metric-value-${metric.id}`} className="text-xs">Value {index + 1}</Label>
                                                    <Input id={`metric-value-${metric.id}`} placeholder="e.g., 300%" value={metric.value} onChange={(e) => handleMetricChange(metric.id, 'value', e.target.value)} required />
                                                </div>
                                            </div>
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeMetric(metric.id)} disabled={metrics.length <= 1} className="mb-1 text-muted-foreground hover:text-destructive disabled:text-muted-foreground/50 h-9 w-9" aria-label={`Remove Metric ${index + 1}`} > <Trash2 className="h-4 w-4" /> </Button>
                                        </div>
                                    ))}
                                </div>

                                {/* Client Feedback (Uses state value) */}
                                <div className="space-y-2 pt-4 border-t border-border mt-6">
                                     <Label htmlFor="clientQuote">Client Feedback / Quote</Label>
                                     <Textarea id="clientQuote" value={clientQuote} onChange={(e) => setClientQuote(e.target.value)} rows={4} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column (Metadata, Images, Submit) */}
                    <div className="space-y-6">
                        {/* Project Metadata (Uses state values) */}
                        <Card>
                             <CardHeader> <CardTitle>Project Metadata</CardTitle> </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select onValueChange={setCategory} value={category} required>
                                        <SelectTrigger id="category" className="w-full">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {/* --- ADD THESE OPTIONS BACK --- */}
                                            <SelectItem value="E-Commerce Growth">E-Commerce Growth</SelectItem>
                                            <SelectItem value="SaaS Branding">SaaS Branding</SelectItem>
                                            <SelectItem value="Content Strategy">Content Strategy</SelectItem>
                                            <SelectItem value="PPC Campaign">PPC Campaign</SelectItem>
                                            <SelectItem value="Mobile App Marketing">Mobile App Marketing</SelectItem>
                                            <SelectItem value="B2B Lead Generation">B2B Lead Generation</SelectItem>
                                            <SelectItem value="Video Marketing">Video Marketing</SelectItem>
                                            <SelectItem value="Email Marketing">Email Marketing</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                            {/* --- END ADDED OPTIONS --- */}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="services">Services Provided</Label>
                                    <Input id="services" value={services} onChange={(e) => setServices(e.target.value)} required />
                                    <p className="text-xs text-muted-foreground">Separate with comma.</p>
                                </div>

                                {/* Main Image Upload/Display */}
                                <div className="grid w-full items-center gap-1.5 pt-4 border-t">
                                     <Label htmlFor="main-image-upload" className="mt-2">Project Main Image</Label>
                                      {/* Show existing or new preview */}
                                      {(currentMainImageUrl || mainImagePreviewUrl) && (
                                         <div className="relative group mb-2">
                                             <img
                                                 src={mainImagePreviewUrl || currentMainImageUrl || undefined} // Prioritize new preview
                                                 alt="Main project visual"
                                                 className="w-full h-32 object-contain rounded-md border bg-secondary"
                                             />
                                             <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10" onClick={removeMainImage} aria-label="Remove Main Image" > <X className="h-3 w-3" /> </Button>
                                         </div>
                                       )}
                                       {/* Show upload input ONLY if no image is currently set */}
                                       {!(currentMainImageUrl || mainImagePreviewUrl) && (
                                         <Input id="main-image-upload" type="file" onChange={handleMainImageChange} accept="image/*" className="text-sm file:mr-2 file:rounded-full file:border-0 file:bg-primary/10 file:px-3 file:py-1 file:text-primary file:text-sm hover:file:bg-primary/20"/>
                                        )}
                                        {/* Required validation is tricky with edit, rely on submit check */}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Gallery Upload/Display */}
                        <Card>
                             <CardHeader> <CardTitle>Project Gallery</CardTitle> <CardDescription>Manage gallery images.</CardDescription> </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Display Existing Gallery Images with Remove Button */}
                                {currentGalleryUrls.length > 0 && (
                                    <div>
                                         <Label className="text-sm font-medium">Current Images</Label>
                                         <div className="grid grid-cols-3 gap-2 mt-2">
                                            {currentGalleryUrls.map((url, index) => (
                                                <div key={url} className="relative group aspect-square">
                                                    <img src={url} alt={`Current Gallery ${index + 1}`} className="w-full h-full object-cover rounded-md border" />
                                                    <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10" onClick={() => removeCurrentGalleryImage(index)} aria-label={`Remove current image ${index + 1}`} > <X className="h-3 w-3" /> </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {/* Input for Adding New Gallery Images */}
                                <div className="grid w-full items-center gap-1.5 pt-4 border-t">
                                    <Label htmlFor="gallery-upload" className="mt-2">Add New Gallery Images</Label>
                                    <Input id="gallery-upload" type="file" multiple onChange={handleGalleryChange} accept="image/*" className="text-sm file:mr-2 file:rounded-full file:border-0 file:bg-primary/10 file:px-3 file:py-1 file:text-primary file:text-sm hover:file:bg-primary/20"/>
                                </div>
                                {/* Display New Gallery Image Previews with Remove Button */}
                                {galleryPreviewUrls.length > 0 && (
                                    <div>
                                         <Label className="text-sm font-medium">New Images (to be uploaded)</Label>
                                         <div className="grid grid-cols-3 gap-2 mt-2">
                                            {galleryPreviewUrls.map((url, index) => (
                                                <div key={index} className="relative group aspect-square">
                                                    <img src={url} alt={`New Gallery Preview ${index + 1}`} className="w-full h-full object-cover rounded-md border" />
                                                    <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10" onClick={() => removeNewGalleryImage(index)} aria-label={`Remove new image ${index + 1}`} > <X className="h-3 w-3" /> </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* 7. Update Button Text */}
                        <Button type="submit" size="lg" className="w-full btn-primary" disabled={isSubmitting || !!configError || isFetching}>
                           <Save className="h-4 w-4 mr-2" /> {isSubmitting ? "Updating..." : "Update Project"}
                        </Button>
                    </div>
                </form>
            </main>
            <Footer />
        </div>
    );
};

export default EditProjectPage;