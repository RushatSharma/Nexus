import React, { createContext, useEffect, useState, useContext, ReactNode } from 'react';
import { Account, Models, AppwriteException, Query, ID } from 'appwrite'; // Import Query
import { account, databases } from '@/appwriteClient';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner'; // For potential error feedback

// --- Get Appwrite IDs from .env ---
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID;
// --- ---

export interface UserData {
    $id?: string; // Appwrite document ID
    userId?: string; // Custom attribute storing Auth User ID
    name?: string;
    organization?: string;
    role?: 'admin' | 'user';
    email?: string; // Stored in DB for consistency, also available in Auth
}

export interface AuthContextType {
    currentUser: Models.User<Models.Preferences> | null;
    loading: boolean;
    userData: UserData | null;
    isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // --- Function to Fetch or Create User Profile in Appwrite Database ---
    const fetchOrCreateProfile = async (user: Models.User<Models.Preferences>) => {
        console.log("AuthContext: fetchOrCreateProfile called for user ID:", user.$id);

        if (!DATABASE_ID || !USERS_COLLECTION_ID) {
            console.error("Database/Users Collection ID missing in .env for profile fetch!");
            toast.error("Configuration error: Cannot load user profile.");
            // Set minimal data, but mark as not admin and potentially show error elsewhere
            setUserData({ userId: user.$id, email: user.email, name: user.name || 'User', role: 'user' });
            setIsAdmin(false);
            return null; // Indicate failure due to config
        }

        try {
            console.log(`AuthContext: Querying collection ${USERS_COLLECTION_ID} for userId=${user.$id}`);
            // 1. Try to find existing profile document
            const response = await databases.listDocuments(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                [
                    Query.equal('userId', user.$id), // Query by your custom userId attribute
                    Query.limit(1) // We only expect one
                ]
            );

            console.log("AuthContext: Profile query response:", response);

            if (response.documents.length > 0) {
                // Profile Found
                const profile = response.documents[0] as UserData & Models.Document; // Cast includes Appwrite metadata like $id
                console.log("AuthContext: Profile found, setting user data:", profile);
                // Map Appwrite document to UserData
                const fetchedUserData: UserData = {
                    $id: profile.$id,
                    userId: profile.userId,
                    name: profile.name,
                    email: profile.email,
                    organization: profile.organization,
                    role: profile.role === 'admin' ? 'admin' : 'user' // Ensure valid role
                };
                setUserData(fetchedUserData);
                setIsAdmin(fetchedUserData.role === 'admin');
                return fetchedUserData; // Return the fetched data
            } else {
                // Profile Not Found - Create it (First login after signup)
                console.warn("AuthContext: User profile not found, creating...");
                // Use name from Appwrite Auth if available, otherwise fallback
                const profileName = user.name || user.email?.split('@')[0] || 'New User';
                // NOTE: We don't get organization from `account.create`, so it will be null/undefined initially
                const newUserProfileData: Omit<UserData, '$id'> = { // Data to insert
                    userId: user.$id,
                    name: profileName,
                    email: user.email,
                    organization: undefined, // Or null if your attribute allows it
                    role: 'user' // Default role for new signups
                };

                console.log("AuthContext: Inserting new profile:", newUserProfileData);

                // Use the Auth user.$id as the Document ID for easy lookup later
                const newDocument = await databases.createDocument(
                    DATABASE_ID,
                    USERS_COLLECTION_ID,
                    ID.unique(), 
                    newUserProfileData
                    // TODO: Set document-level permissions if needed upon creation
                    // e.g., [Permission.read(Role.user(user.$id)), Permission.update(Role.user(user.$id))]
                );

                console.log("AuthContext: User profile created successfully:", newDocument);
                const createdUserData: UserData = {
                    $id: newDocument.$id,
                    ...newUserProfileData
                };
                setUserData(createdUserData);
                setIsAdmin(false); // New users are not admins by default
                return createdUserData; // Return the newly created data
            }

        } catch (error) {
            console.error('AuthContext: Error during profile fetch/create:', error);
             if (error instanceof AppwriteException) {
                 toast.error(`Profile Error (${error.code}): ${error.message}. Check collection permissions/attributes.`);
             } else {
                 toast.error("An unexpected error occurred while loading user profile.");
             }
            setUserData(null); // Clear data on error
            setIsAdmin(false);
            return null; // Indicate failure
        }
    };

    // --- useEffect for Session Check ---
    useEffect(() => {
        console.log("AuthContext: Checking Appwrite session on load.");
        setLoading(true);

        const checkSession = async () => {
            try {
                const user = await account.get();
                console.log("AuthContext: Session found for user:", user);
                setCurrentUser(user); // Set auth user state first
                await fetchOrCreateProfile(user); // Then fetch/create profile data from DB

                // Redirect if logged in and on an auth page (check AFTER profile attempt)
                if (location.pathname === '/login' || location.pathname === '/signup') {
                    console.log("AuthContext: Redirecting logged-in user from auth page to /");
                    navigate('/');
                }

            } catch (error) {
                // No session exists or error fetching account
                console.log("AuthContext: No active session found or error:", error);
                setCurrentUser(null); // Clear auth state
                setUserData(null);    // Clear profile state
                setIsAdmin(false);
            } finally {
                console.log("AuthContext: Finished session check, setting loading false.");
                setLoading(false);
            }
        };

        checkSession();

    }, [navigate, location]); // Dependencies


    const value = {
        currentUser,
        loading,
        userData,
        isAdmin,
    };

    // Render children ONLY after the initial loading is complete
    return <AuthContext.Provider value={value}>{!loading ? children : null /* Or a Loading Spinner */}</AuthContext.Provider>;
};

// Custom hook (no change)
export const useAuth = (): AuthContextType => {
    // ... (keep existing useAuth hook code) ...
     const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};