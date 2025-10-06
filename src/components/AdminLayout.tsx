import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from '../hooks/useAuth';
import { Skeleton } from "./ui/skeleton";

const AdminLayout = () => {
    const { isAdmin, loading } = useAuth();

    if (loading) {
        // Show a loading screen while we check auth status
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="space-y-4 w-1/2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        );
    }

    // After loading, if user is not an admin, redirect to home page
    if (!isAdmin) {
        return <Navigate to="/" />;
    }
    
    // If user is an admin, show the admin content
    return <Outlet />;
};

export default AdminLayout;