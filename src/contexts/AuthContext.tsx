import React, { createContext, useEffect, useState, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/supabaseClient';
import { useNavigate, useLocation } from 'react-router-dom';

export interface UserData {
    id?: string;
    name?: string;
    organization?: string;
    role?: 'admin' | 'user';
}

export interface AuthContextType {
    currentUser: User | null;
    session: Session | null;
    loading: boolean; // Indicates initial auth check + profile fetch is happening
    userData: UserData | null;
    isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true); // *** Start loading: true ***
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // --- Helper function for profile logic (same as before) ---
    const fetchOrCreateProfile = async (user: User) => {
        console.log("AuthContext: fetchOrCreateProfile called for user ID:", user.id);
        try {
            console.log("AuthContext: Entering profile try block.");
            const { data, error: fetchError, status } = await supabase
                .from('users')
                .select(`name, organization, role`)
                .eq('id', user.id)
                .single();

            console.log("AuthContext: Profile select result - Status:", status, "Data:", data, "Error:", fetchError);

            if (fetchError && status !== 406) {
                console.error('AuthContext: Error fetching user profile:', fetchError);
                throw fetchError;
            }

            if (data) {
                console.log("AuthContext: Profile found, setting user data.");
                setUserData(data as UserData);
                setIsAdmin(data.role === 'admin');
                return data;
            } else if (status === 406) {
                console.warn("AuthContext: User profile not found (406), attempting to create...");
                const profileName = user.user_metadata?.name || user.email?.split('@')[0] || 'New User';
                const profileOrg = user.user_metadata?.organization || null;
                const newUserProfile: UserData = {
                    id: user.id,
                    name: profileName,
                    organization: profileOrg || undefined,
                    role: 'user'
                };

                console.log("AuthContext: Inserting new profile:", { id: user.id, name: profileName, email: user.email, organization: profileOrg, role: 'user' });
                const { error: insertError } = await supabase
                    .from('users')
                    .insert({ id: user.id, name: profileName, email: user.email, organization: profileOrg, role: 'user' });

                if (insertError) {
                    console.error("AuthContext: Error creating user profile:", insertError);
                    throw insertError;
                }

                console.log("AuthContext: User profile created successfully.");
                setUserData(newUserProfile);
                setIsAdmin(false);
                return newUserProfile;
            } else {
                 console.warn("AuthContext: Profile select returned ambiguous status:", status);
                 setUserData(null);
                 setIsAdmin(false);
                 return null;
            }

        } catch (error) {
            console.error('AuthContext: Caught error during profile fetch/create process:', error);
            setUserData(null);
            setIsAdmin(false);
            return null; // Return null on error
        }
    };

    useEffect(() => {
        console.log("AuthContext: Setting up onAuthStateChange listener.");
        // We start in loading state, setLoading(true) is the default useState value

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, currentSession) => {
                console.log("AuthContext: onAuthStateChange triggered. Event:", _event, "Session:", currentSession);

                const user = currentSession?.user ?? null;

                // Set user/session state immediately
                setSession(currentSession);
                setCurrentUser(user);

                if (!user) {
                    // Logged out state (or initial check finds no user)
                    console.log("AuthContext Listener: No user found, clearing data and finishing load.");
                    setUserData(null);
                    setIsAdmin(false);
                    setLoading(false); // Finish loading
                } else {
                    // Logged in state (initial check found user OR user just logged in)
                    console.log("AuthContext Listener: User found, attempting profile fetch/create...");
                    try {
                        const profileData = await fetchOrCreateProfile(user); // Attempt to get profile

                        // Redirect ONLY if profile fetch succeeds AND user is on an auth page
                        if (profileData && (location.pathname === '/login' || location.pathname === '/signup')) {
                             console.log("AuthContext Listener: Redirecting logged-in user from auth page to /");
                             navigate('/');
                        }
                    } catch (error) {
                        console.error("AuthContext Listener: Error during profile handling:", error);
                        // Clear potentially stale data on error
                        setUserData(null);
                        setIsAdmin(false);
                    } finally {
                        console.log("AuthContext Listener: Finished processing logged-in state, setting loading false.");
                         // Finish loading AFTER profile attempt (success or fail)
                        setLoading(false);
                    }
                }
            }
        );

        // Cleanup
        return () => {
            console.log("AuthContext: Unsubscribing auth listener.");
            subscription?.unsubscribe();
        };
        // Dependencies: navigate and location are generally stable, but including them ensures
        // the effect *could* re-run if routing changes fundamentally, which is unlikely here.
        // Primarily, this effect runs once on mount due to the empty array pattern implicitly used by useEffect's cleanup.
    }, [navigate, location]);


    const value = {
        currentUser,
        session,
        loading,
        userData,
        isAdmin,
    };

    // Render children ONLY after the initial loading is absolutely complete
    // You could show a loading spinner here: { loading ? <YourSpinner /> : children }
    return <AuthContext.Provider value={value}>{!loading ? children : null}</AuthContext.Provider>;
};

// Custom hook (remains the same)
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
