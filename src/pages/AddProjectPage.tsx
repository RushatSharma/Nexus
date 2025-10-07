import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
// Import React Quill and its CSS
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AddProjectPage = () => {
    // State for all form fields
    const [title, setTitle] = useState('');
    const [client, setClient] = useState('');
    const [description, setDescription] = useState(''); // This will be used by the rich text editor
    const [challenge, setChallenge] = useState(''); // This will be used by the rich text editor
    const [category, setCategory] = useState('');
    const [services, setServices] = useState('');
    
    // State for image preview
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    // Handler for image selection
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };
    
    // Handler to remove the selected image
    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };
    
    // Clean up the object URL to prevent memory leaks
    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    return (
        <div className="flex flex-col min-h-screen bg-muted/40">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8 sm:px-6 lg:px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-8">
                        <Link to="/admin" className="flex items-center text-base text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to All Projects
                        </Link>
                    </div>

                    <form className="grid gap-8 md:grid-cols-3">
                        {/* Left Column: Main Details */}
                        <div className="grid gap-6 md:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-2xl">Project Details</CardTitle>
                                    <CardDescription className="text-base">Fill in the main details of the case study.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="title" className="text-base">Project Title</Label>
                                        <Input id="title" type="text" placeholder="e.g., Complete Digital Overhaul" className="text-base" value={title} onChange={(e) => setTitle(e.target.value)} />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="client" className="text-base">Client Name</Label>
                                        <Input id="client" type="text" placeholder="e.g., UrbanBloom" className="text-base" value={client} onChange={(e) => setClient(e.target.value)} />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="description" className="text-base">Short Description</Label>
                                        {/* --- RICH TEXT EDITOR FOR DESCRIPTION --- */}
                                        <div className="bg-background rounded-md">
                                            <ReactQuill 
                                                theme="snow" 
                                                value={description} 
                                                onChange={setDescription} 
                                                placeholder="A brief summary that will appear on the projects page."
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="challenge" className="text-base">The Challenge</Label>
                                        {/* --- RICH TEXT EDITOR FOR CHALLENGE --- */}
                                        <div className="bg-background rounded-md">
                                            <ReactQuill 
                                                theme="snow" 
                                                value={challenge} 
                                                onChange={setChallenge} 
                                                placeholder="Describe the client's problem or main challenge."
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column: Metadata & Image */}
                        <div className="grid gap-6 md:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-2xl">Project Metadata</CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="category" className="text-base">Category</Label>
                                        <Select onValueChange={setCategory} value={category}>
                                            <SelectTrigger id="category" aria-label="Select category" className="text-base">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="e-commerce">E-Commerce Growth</SelectItem>
                                                <SelectItem value="saas">SaaS Branding</SelectItem>
                                                <SelectItem value="content">Content Strategy</SelectItem>
                                                <SelectItem value="ppc">PPC Campaign</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="services" className="text-base">Services</Label>
                                        <Input id="services" type="text" placeholder="e.g., SEO, PPC" className="text-base" value={services} onChange={(e) => setServices(e.target.value)} />
                                        <p className="text-sm text-muted-foreground">Separate services with a comma.</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-2xl">Project Images</CardTitle>
                                    <CardDescription className="text-base">Upload the main image for the project.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {/* --- IMAGE PREVIEW & MANAGEMENT --- */}
                                    {imagePreview ? (
                                        <div className="relative">
                                            <img src={imagePreview} alt="Project preview" className="w-full h-auto rounded-lg" />
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 h-7 w-7 rounded-full"
                                                onClick={handleRemoveImage}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center w-full">
                                            <Label
                                                htmlFor="dropzone-file"
                                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80"
                                            >
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                                    <p className="mb-2 text-base text-muted-foreground text-center">
                                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                                    </p>
                                                </div>
                                                <Input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                            </Label>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                             <Button size="lg" className="w-full btn-primary text-base">Save Project</Button>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AddProjectPage;