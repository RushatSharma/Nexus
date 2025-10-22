import React, { createContext, useEffect, useState, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js'; // Import Supabase types
import { supabase } from '../supabaseClient'; // Import your initialized Supabase client

// Define the shape of the user data fetched from your 'users' table
export interface UserData {
  id?: string; // Supabase user ID will match this
  name?: string;
  organization?: string;
  role?: 'admin' | 'user';
  // Add other fields from your 'users' table if needed
}

// Update the context type
export interface AuthContextType {
  currentUser: User | null; // Supabase User type
  session: Session | null; // Supabase Session type
  loading: boolean;
  userData: UserData | null; // Your custom user profile data
  isAdmin: boolean;
}

// Export the context so the hook can use it
export const AuthContext = createContext<AuthContextType | null>(null);

// Provider component that wraps the app
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true); // Start as true
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log("AuthProvider useEffect started"); // <-- Log Start

    let initialCheckDone = false; // Flag to manage initial loading state

    // 1. Check for initial session synchronously
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log("Initial getSession completed. Session:", initialSession); // <-- Log Initial Session
      // Only set initial state if the listener hasn't run yet
      if (!initialCheckDone) {
        setSession(initialSession);
        setCurrentUser(initialSession?.user ?? null);
        // Don't set loading false here, wait for listener + profile fetch
      }
    });

    // 2. Set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        initialCheckDone = true; // Mark that the listener has taken over
        console.log("onAuthStateChange triggered. Event:", _event, "Session:", currentSession); // <-- Log Auth Change
        setSession(currentSession);
        const user = currentSession?.user ?? null;
        setCurrentUser(user);

        // Reset user data and admin status if logged out
        if (!user) {
          console.log("No user session found by listener."); // <-- Log No User
          setUserData(null);
          setIsAdmin(false);
          console.log("Setting loading to false (no user)."); // <-- Log Loading False
          setLoading(false); // Auth status known
          return;
        }

        // Fetch user profile data from 'users' table if logged in
        console.log("User session found, attempting to fetch profile for user ID:", user.id); // <-- Log Profile Fetch Start
        // setLoading(true); // Don't reset loading to true here unless necessary, causes flicker
        try {
          const { data, error, status } = await supabase
            .from('users') // Your table name
            .select(`name, organization, role`) // Select specific columns
            .eq('id', user.id) // Match the user ID
            .single(); // Expect only one row

          console.log("Profile fetch result:", { data, error, status }); // <-- Log Profile Result

          if (error && status !== 406) { // 406 means no row found
            console.error('Error fetching user data:', error);
            throw error;
          }

          if (data) {
            console.log("Setting user data:", data); // <-- Log User Data Set
            setUserData(data as UserData);
            setIsAdmin(data.role === 'admin');
            console.log("Is Admin:", data.role === 'admin'); // <-- Log Admin Status
          } else {
            console.warn("User profile data not found in 'users' table."); // <-- Log Profile Not Found
            setUserData(null);
            setIsAdmin(false);
          }
        } catch (error) {
          console.error('Failed to fetch or process user profile:', error); // <-- Keep Error Log
          setUserData(null);
          setIsAdmin(false);
        } finally {
          // This should be the final point where loading becomes false after auth state is known AND profile is fetched/attempted
          console.log("Setting loading to false (after user check/profile fetch)."); // <-- Log Final Loading False
          setLoading(false);
        }
      }
    );

    // Initial loading state check - if no session detected quickly by listener, set loading false
    // This handles the case where the user is definitely logged out.
    const timer = setTimeout(() => {
        if (!initialCheckDone && !session && !currentUser) {
            console.log("Timeout check: No session detected quickly, setting loading false.");
             setLoading(false);
        }
    }, 500); // Adjust timeout if needed


    // Cleanup function
    return () => {
      console.log("AuthProvider useEffect cleanup"); // <-- Log Cleanup
      clearTimeout(timer); // Clear the timeout
      subscription?.unsubscribe();
    };
  }, []); // Run only once on mount

  console.log("AuthProvider rendering. Loading state:", loading); // <-- Log Render State

  const value = {
    currentUser,
    session,
    loading,
    userData,
    isAdmin,
  };

  // Render children only when the initial loading is complete
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

// Custom hook remains the same, but AuthContextType is updated
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

