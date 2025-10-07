import React, { useState } from 'react';
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

// --- Hardcoded Demo User Data ---
const demoUsers = [
    {
        id: '1',
        name: 'Rushat Sharma',
        email: 'rushatsharma2501@gmail.com',
        role: 'admin',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Rushat%20Sharma',
    },
    {
        id: '2',
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        role: 'user',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Jane%20Doe',
    },
    {
        id: '3',
        name: 'John Smith',
        email: 'john.smith@example.com',
        role: 'user',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=John%20Smith',
    },
    {
        id: '4',
        name: 'Emily Taylor',
        email: 'emily.taylor@example.com',
        role: 'user',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Emily%20Taylor',
    },
];

const UserManagementPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = demoUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col min-h-screen bg-muted/40">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-8">
                        <Link to="/admin" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Link>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <CardTitle>User Management</CardTitle>
                                    <CardDescription>Assign roles and manage user access.</CardDescription>
                                </div>
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        type="search" 
                                        placeholder="Search by name or email..." 
                                        className="pl-8 w-full" 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead className="hidden sm:table-cell">Role</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-4">
                                                    <Avatar>
                                                        <AvatarImage src={user.avatar} />
                                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium text-foreground">{user.name}</p>
                                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                 <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                 </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Select defaultValue={user.role}>
                                                    <SelectTrigger className="w-[120px]">
                                                        <SelectValue placeholder="Change role" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="admin">Admin</SelectItem>
                                                        <SelectItem value="user">User</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default UserManagementPage;

