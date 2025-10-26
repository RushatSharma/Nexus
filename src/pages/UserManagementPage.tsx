import React, { useState, useEffect } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from '../components/ui/badge';
// 1. Import Appwrite client, Query, Models, Exception and remove supabase
import { databases } from '@/appwriteClient';
import { Query, Models, AppwriteException } from 'appwrite'; // Import Query from 'appwrite'

import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

// --- Get Appwrite IDs from .env ---
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID;
// --- ---

// 2. Update User interface for Appwrite document structure
interface User {
    $id: string; // Appwrite Document ID
    userId: string; // Custom attribute storing Auth User ID
    name: string;
    email: string;
    role: 'admin' | 'user';
    organization?: string; // Optional organization attribute
    avatar: string; // Still generated client-side
}

const UserManagementPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Function to generate initials (no change)
    const getInitials = (name: string | undefined): string => name ? name.split(' ').map(n => n[0]).join('') : 'U';

    // 3. Fetch users from Appwrite
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError(null);

            // Environment variable check
            if (!DATABASE_ID || !USERS_COLLECTION_ID) {
                console.error("Appwrite Database/Collection IDs missing in .env for User Management!");
                setError("Configuration error: Cannot load user data.");
                setLoading(false);
                return;
            }

            try {
                // List documents from the 'users' collection
                const response = await databases.listDocuments(
                    DATABASE_ID,
                    USERS_COLLECTION_ID
                    // Add queries here if needed, e.g., Query.limit(100)
                );

                // Map Appwrite documents to the User interface
                const userList = response.documents.map(doc => ({
                    $id: doc.$id, // Use Appwrite's document ID
                    userId: doc.userId, // Map custom attribute
                    name: doc.name || 'No Name',
                    email: doc.email || 'No Email',
                    role: doc.role === 'admin' ? 'admin' : 'user', // Ensure role is valid
                    organization: doc.organization, // Map optional attribute
                    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${doc.name || 'User'}`, // Generate avatar
                })) as User[];

                setUsers(userList);
            } catch (err: any) {
                console.error("Error fetching users:", err);
                let errorMsg = `Failed to fetch users: ${err.message || 'Unknown error'}`;
                 if (err instanceof AppwriteException) {
                     if (err.code === 401 || err.code === 403) {
                         errorMsg = "Permission denied. Ensure Admins have read access to the users collection.";
                     } else if (err.code === 404) {
                         errorMsg = "Database or Users Collection ID might be incorrect.";
                     }
                 }
                setError(errorMsg);
                toast.error(errorMsg);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []); // Run only once on mount

    // 4. Update user role in Appwrite
    const handleRoleChange = async (documentId: string, userIdString: string, newRole: 'admin' | 'user') => {
        // Optimistic UI update
        const originalUsers = [...users];
        setUsers(users.map(user => user.$id === documentId ? { ...user, role: newRole } : user));

        const toastId = toast.loading(`Updating role for user ${userIdString.substring(0, 6)}...`);

        // Environment variable check
         if (!DATABASE_ID || !USERS_COLLECTION_ID) {
            setError("Configuration error prevents updating roles.");
            toast.error("Configuration error. Cannot update role.", { id: toastId });
            setUsers(originalUsers); // Revert optimistic update
            return;
         }

        try {
            // Update the document using its Appwrite $id
            await databases.updateDocument(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                documentId, // Use the document ID ($id)
                { role: newRole } // Data to update
                // TODO: Add Permissions array here if needed for document-level permissions
            );

            toast.success(`User role updated successfully!`, { id: toastId });
            // State is already updated optimistically

        } catch (err: any) {
            console.error('Error updating role:', err);
             let errorMsg = `Failed to update role: ${err.message || 'Unknown error'}`;
             if (err instanceof AppwriteException) {
                 if (err.code === 401 || err.code === 403) {
                     errorMsg = "Permission denied. Ensure Admins have update access to the users collection.";
                 } else if (err.code === 404) {
                      errorMsg = "Database, Collection, or Document ID might be incorrect.";
                 }
             }
            setError(errorMsg);
            toast.error(errorMsg, { id: toastId });
            // Revert optimistic update on error
            setUsers(originalUsers);
        }
    };

    // 5. Filter users (logic remains the same, checks name/email)
    const filteredUsers = users.filter(user =>
        (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    // --- JSX (mostly the same, uses Appwrite data and handlers) ---
    return (
        <div className="flex flex-col min-h-screen bg-muted/40">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    {/* Back Link */}
                    <div className="mb-8">
                        <Link to="/admin" className="flex items-center text-base text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Link>
                    </div>

                    <Card>
                        <CardHeader>
                            {/* Header Layout */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <CardTitle className="text-2xl">User Management</CardTitle>
                                    <CardDescription className="text-base">Assign roles and manage user access.</CardDescription>
                                </div>
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Search by name or email..."
                                        className="pl-8 w-full text-base"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                // Loading State with Skeletons
                                <div className="space-y-4">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="flex items-center space-x-4 p-4">
                                            <Skeleton className="h-10 w-10 rounded-full" />
                                            <div className="space-y-2 flex-1">
                                                <Skeleton className="h-4 w-3/4" />
                                                <Skeleton className="h-4 w-1/2" />
                                            </div>
                                            <Skeleton className="h-10 w-[120px]" />
                                        </div>
                                    ))}
                                </div>
                            ) : error ? (
                                <p className="text-destructive text-center py-8">{error}</p>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-base">User</TableHead>
                                            <TableHead className="hidden sm:table-cell text-base">Role</TableHead>
                                            <TableHead className="text-base text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map((user) => (
                                            // 6. Use user.$id as the key
                                            <TableRow key={user.$id}>
                                                <TableCell>
                                                    {/* User Info Display */}
                                                    <div className="flex items-center gap-4">
                                                        <Avatar className="hidden h-9 w-9 sm:flex">
                                                            <AvatarImage src={user.avatar} alt={user.name} />
                                                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="grid gap-1">
                                                            <p className="font-medium text-foreground text-base leading-tight">{user.name}</p>
                                                            <p className="text-base text-muted-foreground hidden md:block">
                                                                {user.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell">
                                                     {/* Role Badge */}
                                                     <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="text-sm capitalize">
                                                        {user.role}
                                                     </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {/* Role Select - uses Appwrite handler with document ID ($id) */}
                                                    <Select
                                                        defaultValue={user.role}
                                                        // Pass Appwrite document ID ($id) and userId to handler
                                                        onValueChange={(newRole) => handleRoleChange(user.$id, user.userId, newRole as 'admin' | 'user')}
                                                    >
                                                        <SelectTrigger className="w-[120px] text-base ml-auto">
                                                            <SelectValue placeholder="Change role" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="admin">Admin</SelectItem>
                                                            <SelectItem value="user">User</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                            </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                                                    No users found matching "{searchTerm}".
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default UserManagementPage;