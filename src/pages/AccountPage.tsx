import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LogOut, UserCircle, MessageSquare } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth, db } from '@/firebase';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';

// --- Hardcoded Demo Message Data ---
const demoMessages = [
    {
        id: '1',
        service: 'Search Engine Optimization (SEO)',
        message: 'Hello, I was interested in learning more about your SEO services for my e-commerce store. Can we schedule a call?',
        status: 'Replied',
        createdAt: new Date('2023-10-26T10:00:00Z'),
    },
    {
        id: '2',
        service: 'Branding & Creative Services',
        message: 'Our company is looking to rebrand. I saw your portfolio and was very impressed. What is the first step to get a quote?',
        status: 'New',
        createdAt: new Date('2023-10-28T14:30:00Z'),
    },
    {
        id: '3',
        service: 'Social Media Marketing',
        message: 'Do you offer packages for managing Instagram and TikTok accounts for a small business?',
        status: 'Replied',
        createdAt: new Date('2023-10-25T09:15:00Z'),
    },
];

interface Message {
    id: string;
    service: string;
    message: string;
    status: string;
    createdAt: Timestamp | null;
}

const AccountPage = () => {
  const { currentUser, userData, loading } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const getInitials = (name: string) => name ? name.split(' ').map(n => n[0]).join('') : '';

  const fetchMessages = async () => {
    if (!currentUser) return;
    setMessagesLoading(true);
    // For now, we use the demo data. Later, this will fetch from Firestore.
    setTimeout(() => {
        setMessages(demoMessages.map(msg => ({...msg, createdAt: Timestamp.fromDate(msg.createdAt)})));
        setMessagesLoading(false);
    }, 1000); // Simulate network delay
  };

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/login');
    }
  }, [loading, currentUser, navigate]);

  if (loading) {
    // Skeleton loader remains the same
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

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container-custom py-12">
        <div className="grid gap-12 md:grid-cols-4">
          {/* --- Left Column: User Identity and Actions --- */}
          <div className="md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData?.name || 'User'}`} />
              <AvatarFallback className="text-3xl">{userData?.name ? getInitials(userData.name) : 'U'}</AvatarFallback>
            </Avatar>
            <h2 className="text-3xl font-bold text-foreground">{userData?.name}</h2>
            <p className="text-base text-muted-foreground">{currentUser?.email}</p>
            <Button onClick={handleLogout} variant="destructive" className="w-full mt-6 md:w-auto">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* --- Right Column: Tabbed Content --- */}
          <div className="md:col-span-3">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="profile">
                  <UserCircle className="w-4 h-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="messages" onClick={fetchMessages}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Messages
                </TabsTrigger>
              </TabsList>
              
              <div className="mt-6 h-[520px] w-full">
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

                <TabsContent value="messages" className="h-full m-0">
                  <Card className="h-full w-full flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-3xl">Message History</CardTitle>
                        <CardDescription className="text-base">A list of messages you've sent via the contact form.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4 overflow-y-auto pr-2">
                        {messagesLoading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-20 w-full" />
                                <Skeleton className="h-20 w-full" />
                                <Skeleton className="h-20 w-full" />
                            </div>
                        ) : messages.length > 0 ? (
                            <div className="space-y-3">
                                {messages.map(msg => (
                                    <div key={msg.id} className="p-4 bg-muted rounded-md border">
                                        <p className="text-lg font-semibold text-primary capitalize">{msg.service}</p>
                                        <p className="text-base text-foreground mb-1">{msg.message}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Status: <span className="capitalize font-medium">{msg.status}</span> | Sent: {msg.createdAt?.toDate().toLocaleString()}
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