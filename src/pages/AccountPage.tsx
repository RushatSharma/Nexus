import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LogOut, UserCircle, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { databases, account } from '@/appwriteClient'; // Only import what your file actually exports
import { Query, Models, AppwriteException } from 'appwrite';
import { toast } from 'sonner';

// --- Environment Variables ---
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const MESSAGES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_MESSAGES_COLLECTION_ID;
// --- ---

interface Message extends Models.Document {
    userId: string;
    email: string;
    service: string;
    message: string;
    status: string;
    reply?: string | null;
    repliedAt?: string | null;
}

const AccountPage = () => {
  const { currentUser, userData, loading } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  // --- *** THE FIX IS HERE *** ---
  const [messagesLoading, setMessagesLoading] = useState(false); // Start false
  // --- *** ---
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [hasFetchedMessages, setHasFetchedMessages] = useState(false);

  // handleLogout
  const handleLogout = async () => {
      try { await account.deleteSession('current'); navigate('/'); } catch (error) { console.error("Error logging out:", error); }
  };

  // getInitials
  const getInitials = (name: string | undefined) => name ? name.split(' ').map(n => n[0]).join('') : '';

  // fetchMessages
  const fetchMessages = async () => {
    // Guard clause: Now, messagesLoading will be false here on first run
    if (!currentUser || messagesLoading || hasFetchedMessages) return;

    setMessagesLoading(true); // <-- Set loading TRUE now
    setMessagesError(null);
    if (!DATABASE_ID || !MESSAGES_COLLECTION_ID) {
        setMessagesError("Configuration error."); setLoading(false); setHasFetchedMessages(true); return;
    }
    try {
        const response = await databases.listDocuments(
            DATABASE_ID, MESSAGES_COLLECTION_ID,
            [ Query.equal('userId', currentUser.$id), Query.orderDesc('$createdAt') ]
        );
        setMessages(response.documents as Message[]);
    } catch (error: any) {
        let msg = `Failed to load messages: ${error.message || 'Unknown'}`;
        if (error instanceof AppwriteException && (error.code === 401 || error.code === 403)) { msg = "Permission denied."; }
        setMessagesError(msg); setMessages([]); toast.error(msg);
    } finally {
        setMessagesLoading(false); // <-- Set loading FALSE on completion
        setHasFetchedMessages(true);
    }
  };

  // useEffect (redirect)
  useEffect(() => {
    if (!loading && !currentUser) { navigate('/login'); }
  }, [loading, currentUser, navigate]);

  // useEffect (fetch on load) - This will now work correctly
  useEffect(() => {
    if (!loading && currentUser && !hasFetchedMessages) {
      fetchMessages();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, currentUser]);

  // formatTimestamp
  const formatTimestamp = (timestamp: string | null): string => {
      if (!timestamp) return 'N/A';
      try { return new Date(timestamp).toLocaleString(); } catch (e) { return 'Invalid Date'; }
  };

  // Loading skeleton (for auth)
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

  if (!currentUser) return null;

  // --- JSX (No changes needed from last version) ---
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container-custom py-12">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Left Column */}
          <div className="md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData?.name || 'User'}`} />
              <AvatarFallback className="text-3xl">{getInitials(userData?.name)}</AvatarFallback>
            </Avatar>
            <h2 className="text-3xl font-bold text-foreground">{userData?.name || "User"}</h2>
            <p className="text-base text-muted-foreground break-all">{currentUser?.email}</p>
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
                <TabsTrigger
                  value="messages"
                  onClick={() => {
                    if (!hasFetchedMessages && !messagesLoading) fetchMessages();
                  }}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Messages
                </TabsTrigger>
              </TabsList>

              <div className="mt-6 h-[520px] w-full">
                {/* Profile Tab */}
                <TabsContent value="profile" className="h-full m-0">
                  <Card className="h-full w-full">
                    <CardHeader>
                      <CardTitle className="text-3xl">Profile Details</CardTitle>
                      <CardDescription className="text-base">Your personal account information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-base">Name</Label>
                        <Input id="name" type="text" value={userData?.name || 'Loading...'} readOnly className="bg-muted text-base" />
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

                {/* Messages Tab */}
                <TabsContent value="messages" className="h-full m-0">
                  <Card className="h-full w-full flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-3xl">Message History</CardTitle>
                        <CardDescription className="text-base">A list of messages you've sent via the contact form.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4 overflow-y-auto pr-2">
                        {messagesLoading ? (
                            <div className="space-y-3">
                                <Skeleton className="h-24 w-full" />
                                <Skeleton className="h-24 w-full" />
                            </div>
                        ) : messagesError ? (
                            <p className="text-destructive text-center py-8">{messagesError}</p>
                        ) : messages.length > 0 ? (
                            <div className="space-y-4">
                                {messages.map(msg => (
                                    <div key={msg.$id} className="p-4 bg-muted rounded-lg border space-y-3">
                                        {/* Original Message */}
                                        <div>
                                            <p className="text-lg font-semibold text-primary capitalize">{msg.service}</p>
                                            <p className="text-base text-foreground mb-1 break-words whitespace-pre-wrap">{msg.message}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Status: <span className="capitalize font-medium">{msg.status}</span> | Sent: {formatTimestamp(msg.$createdAt)}
                                            </p>
                                        </div>

                                        {/* Admin's Reply (Conditional) */}
                                        {msg.reply && msg.status === 'replied' && (
                                            <div className="border-t border-border/50 pt-3 pl-4 border-l-2 border-l-primary/70">
                                                <p className="text-base font-semibold text-foreground">Reply from Nexus:</p>
                                                <p className="text-base text-muted-foreground mb-1 break-words whitespace-pre-wrap">{msg.reply}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Replied: {formatTimestamp(msg.repliedAt || null)}
                                                </p>
                                            </div>
                                        )}
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