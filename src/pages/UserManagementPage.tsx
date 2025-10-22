import React, { useState, useEffect } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "../components/ui/button"; // Assuming Button is still needed elsewhere or for future use
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from '../components/ui/badge';
import { supabase } from '@/supabaseClient'; // Import Supabase client
// Removed Firebase imports: import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
// Removed Firebase imports: import { db } from '@/firebase';
import { toast } from 'sonner'; // Import toast for notifications
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton for loading state

// Define the User interface matching Supabase table structure
interface User {
    id: string; // uuid from Supabase Auth / users table
    name: string;
    email: string;
    role: 'admin' | 'user';
    avatar: string; // We'll still generate this client-side
    // Add other fields if needed, e.g., organization
}

const UserManagementPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Function to generate initials (can be moved to utils if used elsewhere)
    const getInitials = (name: string | undefined): string => name ? name.split(' ').map(n => n[0]).join('') : 'U';

    // Fetch users from Supabase
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError(null);
            try {
                // Select id, name, email, role from the 'users' table
                const { data, error: fetchError } = await supabase
                    .from('users')
                    .select('id, name, email, role'); // Specify columns

                if (fetchError) {
                    throw fetchError; // Throw if fetching fails
                }

                // Map the data to the User interface, generating avatar URL
                const userList = (data || []).map(user => ({
                    id: user.id,
                    name: user.name || 'No Name', // Handle potential null names
                    email: user.email || 'No Email', // Handle potential null emails
                    role: user.role || 'user', // Default role if missing
                    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${user.name || 'User'}`, // Generate avatar
                })) as User[];

                setUsers(userList);
            } catch (err: any) {
                console.error("Error fetching users:", err);
                setError(`Failed to fetch users: ${err.message || 'Unknown error'}`);
                toast.error(`Failed to fetch users: ${err.message || 'Unknown error'}`);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []); // Run only once on mount

    // Update user role in Supabase
    const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
        // Optimistic UI update (optional but improves perceived performance)
        const originalUsers = [...users];
        setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));

        const toastId = toast.loading(`Updating role for user ${userId.substring(0, 6)}...`);

        try {
            // Update the 'role' field in the 'users' table where 'id' matches
            const { error: updateError } = await supabase
                .from('users')
                .update({ role: newRole })
                .eq('id', userId); // Specify the user to update

            if (updateError) {
                throw updateError; // Throw if update fails
            }

            toast.success(`User role updated successfully!`, { id: toastId });
            // State is already updated optimistically

        } catch (err: any) {
            console.error('Error updating role:', err);
            setError(`Failed to update role: ${err.message || 'Unknown error'}`);
            toast.error(`Failed to update role: ${err.message || 'Unknown error'}`, { id: toastId });
            // Revert optimistic update on error
            setUsers(originalUsers);
        }
    };

    // Filter users based on search term (remains the same)
    const filteredUsers = users.filter(user =>
        (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

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
                            {/* Header Layout remains the same */}
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
                                // Improved Loading State with Skeletons
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
                                            <TableHead className="text-base text-right">Actions</TableHead> {/* Aligned right */}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell>
                                                    {/* User Info Display remains the same */}
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
                                                     {/* Role Badge remains the same */}
                                                     <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="text-sm capitalize">
                                                        {user.role}
                                                     </Badge>
                                                </TableCell>
                                                <TableCell className="text-right"> {/* Aligned right */}
                                                    {/* Role Select - uses Supabase handler */}
                                                    <Select
                                                        defaultValue={user.role}
                                                        onValueChange={(newRole) => handleRoleChange(user.id, newRole as 'admin' | 'user')}
                                                    >
                                                        <SelectTrigger className="w-[120px] text-base ml-auto"> {/* Added ml-auto */}
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