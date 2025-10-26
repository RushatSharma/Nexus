import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, CheckCircle, Clock, Send, PlusCircle} from 'lucide-react'; // Added Send
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { databases } from '@/appwriteClient'; // Only import what your file actually exports
import { Query, Models, AppwriteException } from 'appwrite';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from "@/lib/utils";
// 1. Import Dialog components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea"; // For reply
import { Label } from "@/components/ui/label"; // For reply

// --- Environment Variables ---
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const MESSAGES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_MESSAGES_COLLECTION_ID;
// --- ---

// Interface (keep as before)
interface AdminMessage extends Models.Document {
    userId: string;
    email: string;
    service: string;
    message: string;
    status: 'pending' | 'replied' | string;
    reply?: string | null;
    repliedAt?: string | null;
    isRead?: boolean;
}

const AdminMessagesPage = () => {
    const [messages, setMessages] = useState<AdminMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 2. Add State for Reply Modal
    const [selectedMessage, setSelectedMessage] = useState<AdminMessage | null>(null);
    const [replyText, setReplyText] = useState("");
    const [isReplying, setIsReplying] = useState(false);
    // --- ---

    // Fetch messages (keep as before)
    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        // ... (keep existing fetch logic) ...
        setLoading(true); setError(null);
        if (!DATABASE_ID || !MESSAGES_COLLECTION_ID) { setError("Config error."); setLoading(false); return; }
        try {
            const response = await databases.listDocuments<AdminMessage>( DATABASE_ID, MESSAGES_COLLECTION_ID, [Query.orderDesc('$createdAt')] );
            setMessages(response.documents);
        } catch (err: any) { /* ... error handling ... */
             console.error("Fetch error:", err); let msg = `Failed: ${err.message || 'Unknown'}`; if (err instanceof AppwriteException && (err.code === 401 || err.code === 403)) { msg = "Permission denied."; } setError(msg); toast.error(msg);
        } finally { setLoading(false); }
    };

    // Format timestamp helper (keep as before)
    const formatTimestamp = (timestamp: string | null | undefined): string => {
        if (!timestamp) return 'N/A';
        try { return new Date(timestamp).toLocaleString(); }
        catch (e) { return 'Invalid Date'; }
    };

    // 3. Add Handlers for Replying
    const handleOpenReply = (message: AdminMessage) => {
        setSelectedMessage(message);
        setReplyText(message.reply || ""); // Pre-fill with existing reply if any
        
        // Mark as read if it's not already
        if (!message.isRead) {
            markAsRead(message.$id);
        }
    };

    const handleCloseReply = () => {
        // Close modal only if not currently submitting
        if (!isReplying) {
            setSelectedMessage(null);
            setReplyText("");
        }
    };

    // Mark as read (optimistic update)
    const markAsRead = async (documentId: string) => {
        // Optimistically update UI
        setMessages(prev => prev.map(m => m.$id === documentId ? { ...m, isRead: true } : m));
        try {
            await databases.updateDocument(
                DATABASE_ID,
                MESSAGES_COLLECTION_ID,
                documentId,
                { isRead: true }
            );
            console.log(`Message ${documentId} marked as read.`);
        } catch (error) {
            console.error("Error marking message as read:", error);
            // Revert on error? Optional, low-impact.
            // setMessages(prev => prev.map(m => m.$id === documentId ? { ...m, isRead: false } : m));
        }
    };

    const handleSendReply = async () => {
        if (!selectedMessage || !replyText.trim()) {
            toast.error("Reply text cannot be empty.");
            return;
        }

        setIsReplying(true);
        const toastId = toast.loading("Sending reply...");

        try {
            const updatedData = {
                reply: replyText,
                status: 'replied',
                repliedAt: new Date().toISOString(), // Set reply timestamp
                isRead: true, // Mark as read upon reply
            };

            const updatedDoc = await databases.updateDocument(
                DATABASE_ID,
                MESSAGES_COLLECTION_ID,
                selectedMessage.$id,
                updatedData
            );

            // Update local state with the replied message
            setMessages(prev => prev.map(m =>
                m.$id === selectedMessage.$id ? (updatedDoc as AdminMessage) : m
            ));

            toast.success("Reply sent successfully!", { id: toastId });
            setIsReplying(false); // Allow closing
            handleCloseReply(); // Close the modal

        } catch (error: any) {
            console.error("Error sending reply:", error);
            let msg = `Failed to send reply: ${error.message || 'Unknown'}`;
             if (error instanceof AppwriteException && (error.code === 401 || err.code === 403)) {
                 msg = "Permission denied. Ensure Admins have Update access to the 'messages' collection.";
             }
            toast.error(msg, { id: toastId });
            setIsReplying(false); // Allow retry/close
        }
    };
    // --- ---

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
                            <CardTitle className="text-2xl flex items-center">
                               <MessageSquare className="h-6 w-6 mr-2" /> User Messages
                            </CardTitle>
                            <CardDescription className="text-base">View and reply to messages sent via the contact form.</CardDescription>
                         </CardHeader>
                         <CardContent>
                             {loading ? (
                                <div className="space-y-4">
                                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
                                </div>
                             ) : error ? (
                                <p className="text-destructive text-center py-8">{error}</p>
                             ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-base">From</TableHead>
                                            <TableHead className="text-base">Service</TableHead>
                                            <TableHead className="hidden md:table-cell text-base">Received</TableHead>
                                            <TableHead className="text-base">Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {messages.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                                    No messages received yet.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                             messages.map((msg) => (
                                                <TableRow key={msg.$id} className={!msg.isRead ? 'bg-primary/5' : ''}>
                                                    <TableCell className="text-base">
                                                        <div className={`font-medium ${!msg.isRead ? 'text-foreground' : ''}`}>{msg.email}</div>
                                                        <div className="text-xs text-muted-foreground">{msg.userId}</div>
                                                    </TableCell>
                                                    <TableCell className="text-base capitalize">{msg.service}</TableCell>
                                                    <TableCell className="hidden md:table-cell text-base">{formatTimestamp(msg.$createdAt)}</TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={msg.status === 'replied' ? 'default' : 'secondary'}
                                                            className={cn(
                                                                "capitalize",
                                                                msg.status === 'replied' ? 'bg-green-600 hover:bg-green-600/90 text-white' : '',
                                                                !msg.isRead && msg.status === 'pending' ? 'bg-primary/20 text-primary-foreground' : ''
                                                            )}
                                                        >
                                                            {msg.status === 'replied' ? <CheckCircle className="h-3 w-3 mr-1"/> : <Clock className="h-3 w-3 mr-1"/>}
                                                            {msg.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {/* --- 4. UPDATED BUTTON --- */}
                                                        <Button variant="outline" size="sm" onClick={() => handleOpenReply(msg)}>
                                                            View / Reply
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                             ))
                                        )}
                                    </TableBody>
                                </Table>
                             )}
                         </CardContent>
                    </Card>
                 </div>

                 {/* --- 5. NEW: Reply Modal --- */}
                 <Dialog open={!!selectedMessage} onOpenChange={handleCloseReply}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Reply to Message</DialogTitle>
                            <DialogDescription>
                                Replying to: {selectedMessage?.email}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <Card className="bg-muted/50">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">Original Message</CardTitle>
                                    <p className="text-sm text-muted-foreground pt-1">
                                        Service: <span className="font-medium text-primary capitalize">{selectedMessage?.service}</span>
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-foreground">{selectedMessage?.message}</p>
                                </CardContent>
                            </Card>

                            <div className="grid gap-2">
                                <Label htmlFor="reply-message" className="text-base">
                                    Your Reply
                                </Label>
                                <Textarea
                                    id="reply-message"
                                    placeholder="Type your reply here..."
                                    rows={5}
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    disabled={isReplying}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline" disabled={isReplying}>
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="button" onClick={handleSendReply} disabled={isReplying || !replyText.trim()}>
                                {isReplying ? "Sending..." : "Send Reply"}
                                <Send className="h-4 w-4 ml-2" />
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                 {/* --- END: Reply Modal --- */}

            </main>
            <Footer />
        </div>
    );
};

export default AdminMessagesPage;