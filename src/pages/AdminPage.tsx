import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MoreHorizontal, PlusCircle, Users, MessageSquare } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { databases } from '@/appwriteClient'; // Only import what your file actually exports
import { Query, Models, AppwriteException } from 'appwrite';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from 'sonner';

// --- Environment Variables & Interfaces (Keep as before) ---
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PROJECTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PROJECTS_COLLECTION_ID;
const STORAGE_BUCKET_ID = import.meta.env.VITE_APPWRITE_PROJECT_IMAGES_BUCKET_ID;

interface Project extends Models.Document {
    title: string; client: string; category: string; imageUrl: string; details?: string;
}
// --- ---

const AdminPage = () => {
    // --- State and Hooks (Keep as before) ---
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    // --- ---

    // --- useEffect fetchAdminProjects (Keep as before) ---
    useEffect(() => {
        const fetchAdminProjects = async () => {
            setLoading(true); setError(null);
            if (!DATABASE_ID || !PROJECTS_COLLECTION_ID) { setError("Config error."); setLoading(false); return; }
            try {
                const response = await databases.listDocuments<Project>( DATABASE_ID, PROJECTS_COLLECTION_ID, [Query.orderDesc('$createdAt')] );
                setProjects(response.documents);
            } catch (err: any) { /* ... error handling ... */
                 console.error("Fetch error:", err); let msg = `Failed: ${err.message || 'Unknown'}`; if (err instanceof AppwriteException && (err.code === 401 || err.code === 403)) { msg = "Permission denied."; } setError(msg); toast.error(msg);
            } finally { setLoading(false); }
        };
        fetchAdminProjects();
    }, []);
    // --- ---

    // --- handleEdit, extractFileIdFromUrl, handleDelete (Keep as before) ---
    const handleEdit = (projectId: string) => { navigate(`/admin/projects/edit/${projectId}`); };
    const extractFileIdFromUrl = (url: string | null): string | null => { if (!url) return null; try { const p = url.split('/files/'); if (p.length > 1) return p[1].split('/')[0]; } catch (e) { console.error("Err extracting ID:", e); } return null; };
    const handleDelete = async (projectId: string, projectTitle: string) => {
         if (!window.confirm(`Delete "${projectTitle}"? Includes images.`)) return;
         const toastId = toast.loading(`Deleting "${projectTitle}"...`);
         if (!DATABASE_ID || !PROJECTS_COLLECTION_ID || !STORAGE_BUCKET_ID) { toast.error("Config error.", { id: toastId }); return; }
         let mainId: string | null = null; let galleryIds: string[] = [];
         try {
             const proj = await databases.getDocument<Project>(DATABASE_ID, PROJECTS_COLLECTION_ID, projectId);
             mainId = extractFileIdFromUrl(proj.imageUrl);
             if (proj.details) { try { const d = JSON.parse(proj.details); if(d.gallery?.length) galleryIds = d.gallery.map((u:string)=>extractFileIdFromUrl(u)).filter((id:string|null): id is string => id !== null); } catch(e){ console.error("Parse error for delete:", e); }}
             await databases.deleteDocument(DATABASE_ID, PROJECTS_COLLECTION_ID, projectId);
             const promises: Promise<void>[] = []; if (mainId) promises.push(storage.deleteFile(STORAGE_BUCKET_ID, mainId)); galleryIds.forEach(id => promises.push(storage.deleteFile(STORAGE_BUCKET_ID, id)));
             await Promise.allSettled(promises).then(res => { res.forEach((r,i) => { const fId=i===0&&mainId?mainId:galleryIds[i-(mainId?1:0)]; if(r.status==='rejected') toast.warning(`Failed to delete image (${fId?.substring(0,6)}...).`); }); });
             setProjects(prev => prev.filter(p => p.$id !== projectId)); toast.success(`"${projectTitle}" deleted!`, { id: toastId });
         } catch (error: any) { /* ... error handling ... */
              console.error("Delete error:", error); let msg = `Failed: ${error.message || 'Unknown'}`; if (error instanceof AppwriteException && (error.code === 401 || error.code === 403)) msg = "Permission denied."; toast.error(msg, { id: toastId });
         }
    };
    // --- ---


    return (
        <div className="flex flex-col min-h-screen bg-muted/40">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-12 sm:px-6 lg:px-8">

                {/* --- UPDATED HEADER/BUTTON SECTION --- */}
                <div className="flex flex-col items-center gap-6 mb-8">
                    {/* Centered Heading */}
                    <div className="text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-foreground">Projects Dashboard</h1>
                        <p className="text-lg text-muted-foreground">Manage your case studies and project details here.</p>
                    </div>
                    {/* Grouped Action Buttons */}
                    <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link to="/admin/users" className="w-full sm:w-auto">
                            {/* --- CHANGED --- */}
                            <Button className="btn-primary w-full text-base">
                                <Users className="h-4 w-4 mr-2" />
                                Manage Users
                            </Button>
                        </Link>
                        {/* Added Messages Button */}
                        <Link to="/admin/messages" className="w-full sm:w-auto">
                             {/* --- CHANGED --- */}
                            <Button className="btn-primary w-full text-base">
                                <MessageSquare className="h-4 w-4 mr-2" />
                                View Messages
                            </Button>
                        </Link>
                         {/* Add Project Button */}
                        <Link to="/admin/projects/new" className="w-full sm:w-auto">
                            <Button className="btn-primary w-full text-base">
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Add New Project
                            </Button>
                        </Link>
                    </div>
                </div>
                {/* --- END UPDATED SECTION --- */}

                {/* Projects Table Card (Keep as before) */}
                <Card>
                    {/* ... (CardHeader) ... */}
                    <CardHeader>
                        <CardTitle className="text-2xl">All Projects</CardTitle>
                        <CardDescription className="text-base">A list of all case studies in your portfolio.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            {/* ... (TableHeader) ... */}
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="hidden w-[100px] sm:table-cell"><span className="sr-only">Image</span></TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Client</TableHead>
                                    <TableHead className="hidden md:table-cell">Category</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {/* ... (TableBody logic: loading, error, map) ... */}
                                {loading ? (
                                     [...Array(3)].map((_, i) => ( <TableRow key={`skel-${i}`}> <TableCell className="hidden sm:table-cell"><Skeleton className="h-16 w-16 rounded-md" /></TableCell> <TableCell><Skeleton className="h-5 w-3/4" /></TableCell> <TableCell><Skeleton className="h-5 w-1/2" /></TableCell> <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-1/2" /></TableCell> <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell> </TableRow> ))
                                ) : error ? (
                                    <TableRow> <TableCell colSpan={5} className="text-center text-destructive py-8">Error: {error}</TableCell> </TableRow>
                                ) : projects.length === 0 ? (
                                    <TableRow> <TableCell colSpan={5} className="text-center text-muted-foreground py-8">No projects yet. <Link to="/admin/projects/new" className="text-primary underline">Add one</Link>.</TableCell> </TableRow>
                                ) : (
                                    projects.map((project) => (
                                        <TableRow key={project.$id}>
                                            <TableCell className="hidden sm:table-cell"> <img alt={project.title} className="aspect-square rounded-md object-cover" height="64" src={project.imageUrl} width="64" /> </TableCell>
                                            <TableCell className="font-medium">{project.title}</TableCell>
                                            <TableCell>{project.client}</TableCell>
                                            <TableCell className="hidden md:table-cell">{project.category}</TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild={false}>
                                                        <Button aria-haspopup="true" size="icon" variant="ghost"> <MoreHorizontal className="h-4 w-4" /> <span className="sr-only">Toggle menu</span> </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleEdit(project.$id)}>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(project.$id, project.title)}>Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    );
};

export default AdminPage;