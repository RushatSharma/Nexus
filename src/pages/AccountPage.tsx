import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth'; // Now provides Supabase user/data
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LogOut, UserCircle, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/supabaseClient'; // Import Supabase client

// Interface for messages fetched from Supabase
interface Message {
    id: number; // Assuming 'id' is bigint/int8 in Supabase
    service: string;
    message: string;
    status: string;
    created_at: string | null; // Supabase timestamp is typically returned as string
    user_id?: string; // Optional, just for type consistency if needed
    email?: string; // Optional, just for type consistency if needed
}

const AccountPage = () => {
  // useAuth now provides Supabase user and profile data
  const { currentUser, userData, loading } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [messagesError, setMessagesError] = useState<string | null>(null); // State for message fetching errors

  // Logout using Supabase
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Error logging out:", error);
        // Optionally show an error to the user
    }
    navigate('/'); // Navigate home after logout attempt
  };

  // Get initials function remains the same
  const getInitials = (name: string | undefined) => name ? name.split(' ').map(n => n[0]).join('') : '';

  // Fetch messages from Supabase
  const fetchMessages = async () => {
    if (!currentUser) return;
    setMessagesLoading(true);
    setMessagesError(null); // Clear previous errors
    try {
        // Select messages for the current user, ordered by creation date
        const { data, error } = await supabase
            .from('messages') // Your messages table name
            .select('*') // Select all columns
            .eq('user_id', currentUser.id) // Filter by the logged-in user's ID
            .order('created_at', { ascending: false }); // Order newest first

        if (error) {
            throw error; // Throw if there's an error fetching
        }

        // Set the fetched messages (data might be null if no messages)
        setMessages(data || []);

    } catch (error: any) {
        console.error("Error fetching messages: ", error);
        setMessagesError(`Failed to load messages: ${error.message || 'Please try again.'}`);
        setMessages([]); // Clear messages on error
    } finally {
        setMessagesLoading(false);
    }
  };

  // Effect to redirect if not logged in (remains the same logic)
  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/login');
    }
  }, [loading, currentUser, navigate]);

  // Loading skeleton remains the same
   if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 container-custom py-12">
           <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-1 flex flex-col items-center text-center">
                <Skeleton className="w-24 h-24 rounded-full mb-4" />
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-5 w-56" />
                <Skeleton className="h-10 w-full max-w-[240px] mt-6" />
                <Skeleton className="h-10 w-full max-w-[240px] mt-2" />
              </div>
              <div className="md:col-span-2">
                <Skeleton className="h-96 w-full" />
              </div>
           </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!currentUser) return null; // Should be redirected by useEffect, but good practice

  // Helper to format Supabase timestamp string
  const formatTimestamp = (timestamp: string | null): string => {
      if (!timestamp) return 'N/A';
      try {
          return new Date(timestamp).toLocaleString();
      } catch (e) {
          return 'Invalid Date';
      }
  }

  // JSX structure remains mostly the same, data sources are updated
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container-custom py-12">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Left Column (Profile Summary) - Uses userData from AuthContext */}
          <div className="md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData?.name || 'User'}`} />
              <AvatarFallback className="text-3xl">{getInitials(userData?.name)}</AvatarFallback>
            </Avatar>
            <h2 className="text-3xl font-bold text-foreground">{userData?.name || "User"}</h2>
            <p className="text-base text-muted-foreground break-all">{currentUser?.email}</p>
            {/* Logout button now uses Supabase handler */}
            <Button onClick={handleLogout} variant="destructive" className="w-full mt-6 md:w-auto">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Right Column (Tabs) */}
          <div className="md:col-span-3">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="profile">
                  <UserCircle className="w-4 h-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="messages" onClick={fetchMessages}> {/* Fetch messages on tab click */}
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Messages
                </TabsTrigger>
              </TabsList>

              <div className="mt-6 h-[520px] w-full"> {/* Fixed height container */}
                {/* Profile Tab - Uses userData from AuthContext */}
                <TabsContent value="profile" className="h-full m-0">
                  <Card className="h-full w-full">
                    <CardHeader>
                      <CardTitle className="text-3xl">Profile Details</CardTitle>
                      <CardDescription className="text-base">Your personal account information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-base">Name</Label>
                        <Input id="name" type="text" value={userData?.name || 'N/A'} readOnly className="bg-muted text-base" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-base">Email</Label>
                        <Input id="email" type="email" value={currentUser?.email || 'N/A'} readOnly className="bg-muted text-base" />
                      </div>
                      {userData?.organization && (
                        <div className="space-y-2">
                          <Label htmlFor="organization" className="text-base">Organization</Label>
                          <Input id="organization" type="text" value={userData.organization} readOnly className="bg-muted text-base" />
                        </div>
                      )}
                       {userData?.role && (
                        <div className="space-y-2">
                          <Label htmlFor="role" className="text-base">Role</Label>
                          <Input id="role" type="text" value={userData.role.charAt(0).toUpperCase() + userData.role.slice(1)} readOnly className="bg-muted text-base" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Messages Tab - Fetches and displays messages from Supabase */}
                <TabsContent value="messages" className="h-full m-0">
                  <Card className="h-full w-full flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-3xl">Message History</CardTitle>
                        <CardDescription className="text-base">A list of messages you've sent via the contact form.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4 overflow-y-auto pr-2"> {/* Scrollable content */}
                        {messagesLoading ? (
                            <div className="space-y-3"> {/* Use multiple skeletons for better loading state */}
                                <Skeleton className="h-20 w-full" />
                                <Skeleton className="h-20 w-full" />
                                <Skeleton className="h-20 w-full" />
                            </div>
                        ) : messagesError ? (
                            <p className="text-destructive text-center py-8">{messagesError}</p>
                        ) : messages.length > 0 ? (
                            <div className="space-y-3">
                                {messages.map(msg => (
                                    <div key={msg.id} className="p-4 bg-muted rounded-md border">
                                        <p className="text-lg font-semibold text-primary capitalize">{msg.service}</p>
                                        <p className="text-base text-foreground mb-1 break-words">{msg.message}</p> {/* Added break-words */}
                                        <p className="text-sm text-muted-foreground">
                                            Status: <span className="capitalize font-medium">{msg.status}</span> | Sent: {formatTimestamp(msg.created_at)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-center py-8">No messages sent yet.</p>
                        )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AccountPage;
