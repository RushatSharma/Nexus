import { Link } from "react-router-dom";
import { MoreHorizontal, PlusCircle, Users } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { getProjects } from "./ProjectsPage";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AdminPage = () => {
    const projects = getProjects();

    return (
        <div className="flex flex-col min-h-screen bg-muted/40">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center gap-6 mb-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-foreground">Projects Dashboard</h1>
                        <p className="text-lg text-muted-foreground">Manage your case studies and project details here.</p>
                    </div>
                    <div className="w-full flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4">
                        <Link to="/admin/users" className="w-full sm:w-auto">
                            <Button variant="default" className="w-full text-base">
                                <Users className="h-4 w-4 mr-2" />
                                Manage Users
                            </Button>
                        </Link>
                        <Link to="/admin/projects/new" className="w-full sm:w-auto">
                            <Button className="btn-primary w-full text-base">
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Add New Project
                            </Button>
                        </Link>
                    </div>
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">All Projects</CardTitle>
                        <CardDescription className="text-base">A list of all case studies in your portfolio.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="hidden w-[100px] sm:table-cell">
                                        <span className="sr-only">Image</span>
                                    </TableHead>
                                    <TableHead className="text-base">Title</TableHead>
                                    <TableHead className="text-base">Client</TableHead>
                                    <TableHead className="hidden md:table-cell text-base">Category</TableHead>
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
                                        <TableCell className="font-medium text-foreground text-base">{project.title}</TableCell>
                                        <TableCell className="text-base">{project.client}</TableCell>
                                        <TableCell className="hidden md:table-cell text-base">{project.category}</TableCell>
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