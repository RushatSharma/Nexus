import { Link } from "react-router-dom";
import { MoreHorizontal, PlusCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getProjects } from "@/pages/ProjectsPage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AdminPage = () => {
    const projects = getProjects();

    return (
        <div className="flex flex-col min-h-screen bg-muted/40">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Projects Dashboard</h1>
                        <p className="text-muted-foreground">Manage your case studies and project details here.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link to="/admin/users">
                             <Button variant="outline">
                                <Users className="h-4 w-4 mr-2" />
                                Manage Users
                            </Button>
                        </Link>
                        <Link to="/admin/projects/new">
                            <Button className="btn-primary">
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Add New Project
                            </Button>
                        </Link>
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>All Projects</CardTitle>
                        <CardDescription>A list of all case studies in your portfolio.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="hidden w-[100px] sm:table-cell">
                                        <span className="sr-only">Image</span>
                                    </TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Client</TableHead>
                                    <TableHead className="hidden md:table-cell">Category</TableHead>
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {projects.map((project) => (
                                    <TableRow key={project.id}>
                                        <TableCell className="hidden sm:table-cell">
                                            <img
                                                alt={project.title}
                                                className="aspect-square rounded-md object-cover"
                                                height="64"
                                                src={project.imageUrl}
                                                width="64"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium text-foreground">{project.title}</TableCell>
                                        <TableCell>{project.client}</TableCell>
                                        <TableCell className="hidden md:table-cell">{project.category}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Toggle menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
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