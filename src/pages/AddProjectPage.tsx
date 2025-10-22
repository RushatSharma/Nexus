import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
// Removed ReactQuill imports as it wasn't being used in the form fields
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
import { supabase } from '@/supabaseClient'; // Import Supabase client
// Removed Firebase imports: import { db, storage } from '@/firebase';
// Removed Firebase imports: import { addDoc, collection } from "firebase/firestore";
// Removed Firebase imports: import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "sonner"; // Using sonner for toasts as setup in App.tsx

// Define the structure for the 'details' JSONB field
interface ProjectDetails {
    challenge: string;
    solution: { title: string; description: string }[]; // Keep as empty array for now
    results: {
        increaseInSales: string;
        increaseInTraffic: string;
        roas: string;
        quote: string;
    };
    gallery: string[]; // Keep as empty array for now
}


const AddProjectPage = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [client, setClient] = useState('');
    const [description, setDescription] = useState('');
    const [challenge, setChallenge] = useState('');
    const [category, setCategory] = useState('');
    const [services, setServices] = useState(''); // Comma-separated string input
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Define your Supabase Storage bucket name
    const STORAGE_BUCKET_NAME = 'project-images'; // MAKE SURE you create this bucket in Supabase dashboard

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            // Revoke previous object URL if exists to prevent memory leaks
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        setImageFile(null);
        setImagePreview(null);
        // Also clear the file input if needed
        const fileInput = document.getElementById('dropzone-file') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const generateSlug = (title: string): string => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with -
            .replace(/(^-|-$)+/g, ''); // Remove leading/trailing dashes
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Updated validation message
        if (!title || !client || !category || !services || !imageFile) {
            toast.error("Please fill out Title, Client, Category, Services and upload an image.");
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading("Creating new project...");

        try {
            // 1. Upload image to Supabase Storage
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Date.now()}_${generateSlug(title)}.${fileExt}`;
            const filePath = `${fileName}`; // Define path within the bucket

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from(STORAGE_BUCKET_NAME)
                .upload(filePath, imageFile);

            if (uploadError) {
                console.error("Storage Upload Error:", uploadError);
                throw new Error(`Failed to upload image: ${uploadError.message}`);
            }

            // 2. Get the public URL for the uploaded image
             const { data: urlData } = supabase.storage
                .from(STORAGE_BUCKET_NAME)
                .getPublicUrl(uploadData.path); // Use path from upload response

             if (!urlData || !urlData.publicUrl) {
                 throw new Error("Could not get public URL for the uploaded image.");
             }
             const imageUrl = urlData.publicUrl;


            // 3. Prepare data for Supabase Database insert
            // Convert comma-separated services string to a PostgreSQL text array
            const servicesArray = services.split(',').map(s => s.trim()).filter(s => s !== '');

             // Prepare the details object (using JSONB)
            const projectDetails: ProjectDetails = {
                challenge: challenge || '', // Use state value or empty string
                solution: [], // Default to empty array
                results: { // Default empty results
                    increaseInSales: "",
                    increaseInTraffic: "",
                    roas: "",
                    quote: ""
                },
                gallery: [] // Default to empty array
            };

            const projectData = {
                title,
                client,
                description: description || null, // Allow null if description is optional
                category,
                services: servicesArray, // Use the processed array
                image_url: imageUrl, // Use underscore convention
                slug: generateSlug(title),
                details: projectDetails, // Add the structured details object
                // 'created_at' uses database default
                challenge: challenge || null // Save challenge separately too if needed, or remove if only in details
            };

            // 4. Insert document into Supabase 'projects' table
            const { error: insertError } = await supabase
                .from('projects') // Your table name
                .insert(projectData);

            if (insertError) {
                console.error("Database Insert Error:", insertError);
                 // Attempt to delete the uploaded image if DB insert fails
                 await supabase.storage.from(STORAGE_BUCKET_NAME).remove([filePath]);
                throw new Error(`Failed to save project data: ${insertError.message}`);
            }

            toast.success("Project created successfully!", { id: toastId });
            navigate('/admin'); // Redirect to admin page on success

        } catch (error: any) {
            console.error("Error creating project:", error);
            toast.error(`Failed to create project: ${error.message || 'Please try again.'}`, { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Cleanup object URL on unmount
    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    // JSX structure remains largely the same
    return (
        <div className="flex flex-col min-h-screen bg-muted/40">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8 sm:px-6 lg:px-6">
                <div className="max-w-5xl mx-auto">
                    {/* Back Link */}
                    <div className="mb-8">
                        <Link to="/admin" className="flex items-center text-base text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to All Projects
                        </Link>
                    </div>

                    <form className="grid gap-8 md:grid-cols-3" onSubmit={handleSubmit}>
                        {/* Left Column: Project Details */}
                        <div className="grid gap-6 md:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-2xl">Project Details</CardTitle>
                                    <CardDescription className="text-base">Fill in the main details of the case study.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="title" className="text-base">Project Title</Label>
                                        <Input id="title" type="text" placeholder="e.g., Complete Digital Overhaul" className="text-base" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="client" className="text-base">Client Name</Label>
                                        <Input id="client" type="text" placeholder="e.g., UrbanBloom" className="text-base" value={client} onChange={(e) => setClient(e.target.value)} required />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="description" className="text-base">Short Description</Label>
                                        <Textarea id="description" placeholder="A brief summary that will appear on the projects page." className="text-base min-h-[100px]" value={description} onChange={(e) => setDescription(e.target.value)} />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="challenge" className="text-base">The Challenge</Label>
                                        <Textarea id="challenge" placeholder="Describe the client's problem or main challenge. This will also be saved in the 'details' field." className="text-base min-h-[100px]" value={challenge} onChange={(e) => setChallenge(e.target.value)} />
                                    </div>
                                    {/* Removed ReactQuill section as it wasn't connected to state */}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column: Metadata & Image */}
                        <div className="grid gap-6 md:col-span-1 content-start"> {/* Added content-start */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-2xl">Project Metadata</CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="category" className="text-base">Category</Label>
                                        <Select onValueChange={setCategory} value={category} required>
                                            <SelectTrigger id="category" aria-label="Select category" className="text-base">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
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
                                    <div className="grid gap-3">
                                        <Label htmlFor="services" className="text-base">Services Provided</Label>
                                        <Input id="services" type="text" placeholder="e.g., SEO, PPC, Branding" className="text-base" value={services} onChange={(e) => setServices(e.target.value)} required />
                                        <p className="text-sm text-muted-foreground">Separate services with a comma.</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-2xl">Project Image</CardTitle>
                                    <CardDescription className="text-base">Upload the main image for the project.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {imagePreview ? (
                                        <div className="relative group">
                                            <img src={imagePreview} alt="Project preview" className="w-full h-auto rounded-lg object-contain max-h-48" /> {/* Constrained height */}
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={handleRemoveImage}
                                                type="button" // Prevent form submission
                                            >
                                                <X className="h-4 w-4" />
                                                <span className="sr-only">Remove image</span>
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center w-full">
                                            <Label
                                                htmlFor="dropzone-file"
                                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80"
                                            >
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                                    <p className="mb-2 text-sm text-muted-foreground"> {/* Adjusted text size */}
                                                        <span className="font-semibold">Click to upload</span> or drag
                                                    </p>
                                                     <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 5MB</p> {/* Added file info */}
                                                </div>
                                                <Input id="dropzone-file" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleImageChange} />
                                            </Label>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                             <Button type="submit" size="lg" className="w-full btn-primary text-base" disabled={isSubmitting}>
                                {isSubmitting ? "Saving Project..." : "Save Project"}
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AddProjectPage;