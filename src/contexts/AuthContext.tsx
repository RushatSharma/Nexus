import React, { createContext, useEffect, useState, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';

// Define the shape of the user data fetched from your 'users' table
export interface UserData {
  id?: string; // Supabase user ID will match this
  name?: string;
  organization?: string;
  role?: 'admin' | 'user';
}

// Define the shape of the context value
export interface AuthContextType {
  currentUser: User | null; // Supabase User type
  session: Session | null; // Supabase Session type
  loading: boolean;
  userData: UserData | null; // Your custom user profile data
  isAdmin: boolean;
}

// Create the context with an initial value of null
export const AuthContext = createContext<AuthContextType | null>(null);

// Provider component that wraps the app
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true); // Start loading initially
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let initialCheckDone = false; // Flag to prevent race condition with initial getSession

    // Attempt to get the initial session synchronously
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      // Only set initial state if the listener hasn't already run
      if (!initialCheckDone) {
        setSession(initialSession);
        setCurrentUser(initialSession?.user ?? null);
         // If there's no initial session, we might be done loading early
        if (!initialSession) {
            setLoading(false);
            initialCheckDone = true;
        }
      }
    }).catch(error => {
        // Handle potential error during initial session fetch
        console.error("Error fetching initial session:", error);
         if (!initialCheckDone) {
             setLoading(false); // Assume done loading if initial check fails
             initialCheckDone = true;
         }
    });

    // Set up the listener for authentication state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        initialCheckDone = true; // Mark that the listener has taken over
        setSession(currentSession);
        const user = currentSession?.user ?? null;
        setCurrentUser(user);

        // If user logs out
        if (!user) {
          setUserData(null);
          setIsAdmin(false);
          setLoading(false); // Finished loading (logged out state)
          return;
        }

        // If user is logged in, fetch or create their profile
        // setLoading(true); // Optionally set loading true again if profile fetch is slow
        try {
          // 1. Attempt to fetch existing profile data from 'users' table
          const { data, error: fetchError, status } = await supabase
            .from('users')
            .select(`name, organization, role`) // Select only needed profile fields
            .eq('id', user.id) // Match the authenticated user's ID
            .single(); // Expect exactly one row or null

          // Handle potential fetch errors (excluding 'not found')
          if (fetchError && status !== 406) { // 406 specifically means row not found
            console.error('Error fetching user profile:', fetchError);
            throw fetchError;
          }

          // 2. If profile data exists, update the state
          if (data) {
            setUserData(data as UserData);
            setIsAdmin(data.role === 'admin');
          }
          // 3. If profile data does NOT exist (status 406), create it
          else if (status === 406) {
            console.warn("User profile not found in 'users' table, attempting to create...");

            // Get name/org from signup metadata (if provided) or generate defaults
            const profileName = user.user_metadata?.name || user.email?.split('@')[0] || 'New User';
            const profileOrg = user.user_metadata?.organization || null;

            const newUserProfile: UserData = {
                id: user.id,
                name: profileName,
                organization: profileOrg,
                role: 'user' // Default role for new signups
            };

            // Insert the new profile into the 'users' table
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                  id: user.id, // Ensure ID matches the auth user ID
                  name: profileName,
                  email: user.email, // Include email in the table
                  organization: profileOrg,
                  role: 'user'
              });

            if (insertError) {
              // If insert fails (e.g., RLS policy prevents it unexpectedly)
              console.error("Error creating user profile after signup:", insertError);
              setUserData(null); // Ensure userData is null if profile creation failed
              setIsAdmin(false);
            } else {
              // If insert succeeds, update the state with the new profile data
              console.log("User profile created successfully.");
              setUserData(newUserProfile);
              setIsAdmin(false); // New users default to 'user' role
            }
          }

        } catch (error) {
          // Catch errors from fetch or the insert attempt
          console.error('Failed during profile fetch/create process:', error);
          setUserData(null); // Reset user data on error
          setIsAdmin(false); // Reset admin status on error
        } finally {
          // Always set loading to false after attempting to fetch/create profile
          setLoading(false);
        }
      }
    );

    // Cleanup function to unsubscribe the listener when the component unmounts
    return () => {
      subscription?.unsubscribe();
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // The value provided to consuming components
  const value = {
    currentUser,
    session,
    loading,
    userData,
    isAdmin,
  };

  // Render children only after the initial loading is complete
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

// Custom hook to easily consume the context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === null) { // Explicit check for null
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

