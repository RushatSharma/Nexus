import { useState, useRef, useEffect } from 'react'; // Add useEffect here
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Mail, Phone, MapPin, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input"; // Not used
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AuroraTextEffect } from "@/components/AuroraTextEffect";
import { useAuth } from '../hooks/useAuth';
// Import Appwrite client, ID, and specific error types
import { databases, ID } from '@/appwriteClient';
import { AppwriteException } from 'appwrite';
import { toast } from 'sonner'; // Using sonner for notifications

// --- Get Appwrite IDs from .env ---
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const MESSAGES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_MESSAGES_COLLECTION_ID;
// --- ---

export function ContactPage() {
    const { currentUser } = useAuth();
    const [service, setService] = useState('');
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const messageRef = useRef<HTMLTextAreaElement>(null);

    // Add validation check for environment variables
    useEffect(() => {
        if (!DATABASE_ID || !MESSAGES_COLLECTION_ID) {
            console.error("Appwrite Database/Collection IDs missing in .env file!");
            setError("Configuration error: Cannot connect to the database. Please contact support.");
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Environment variable check
        if (!DATABASE_ID || !MESSAGES_COLLECTION_ID) {
            setError("Configuration error prevents sending messages.");
            toast.error("Configuration error. Cannot send message.");
            return;
        }

        if (!currentUser) {
            setError("You must be logged in to send a message.");
            // Consider redirecting or showing login modal
            // navigate('/login');
            return;
        }
        if (!service || !message) {
            setError("Please select a service and enter a message.");
            return;
        }
        setError('');
        setSuccess(false);
        setIsSubmitting(true);
        const loadingToastId = toast.loading("Sending message...");

        try {
            // Prepare data matching Appwrite collection attributes
            // Ensure attribute keys match your Appwrite 'messages' table columns
            const messageData = {
                userId: currentUser.$id, // Link to the user
                email: currentUser.email,
                service: service,
                message: message,
                status: 'pending', // Default status from Appwrite table should apply if not sent
            };

            // Use Appwrite's createDocument
            await databases.createDocument(
                DATABASE_ID,
                MESSAGES_COLLECTION_ID,
                ID.unique(), // Let Appwrite generate document ID
                messageData
                // You might need document-level permissions here if your collection requires it
                // e.g., [Permission.read(Role.user(currentUser.$id)), Permission.update(Role.user(currentUser.$id))]
            );

            toast.success("Message sent successfully!", { id: loadingToastId });
            setSuccess(true);
            setMessage('');
            setService('');
             if (messageRef.current) {
                messageRef.current.style.height = "auto";
             }
        } catch (err: any) {
             console.error("Error sending message:", err);
             let errorMsg = `Failed to send message: ${err.message || 'Please try again.'}`;
             if (err instanceof AppwriteException) {
                 if (err.code === 401 || err.code === 403) {
                    errorMsg = "Failed to send message: Permission denied. Check collection permissions.";
                 } else if (err.code === 404) {
                    errorMsg = "Failed to send message: Database or Collection ID might be incorrect.";
                 } else if (err.message.includes('Invalid document structure') || err.code === 400) {
                     errorMsg = "Failed to send message: Data doesn't match expected format. Check attributes.";
                 }
             }
             setError(errorMsg);
             toast.error(errorMsg, { id: loadingToastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    // handleMessageChange remains the same
    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
        if (messageRef.current) {
            messageRef.current.style.height = "auto";
            const maxHeight = window.innerHeight * 0.3;
            messageRef.current.style.height = `${Math.min(messageRef.current.scrollHeight, maxHeight)}px`;
        }
    };


    // --- JSX remains the same ---
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header/>
            <main className="flex-grow container mx-auto px-4 py-12 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                    {/* Left Column (Info) */}
                    <div className="text-left">
                         <AuroraTextEffect
                            text="Let's Talk Business"
                            fontSize="clamp(2.5rem, 6vw, 4rem)"
                            className="justify-start p-0 m-0"
                            textClassName="-ml-1"
                        />
                         <p className="text-lg text-muted-foreground mt-6 mb-6">
                           Have a project in mind, or just want to explore possibilities?
                           We're here to help you navigate the digital landscape and achieve
                           your goals.
                         </p>
                         <p className="text-lg text-muted-foreground mb-8">
                             Whether you're looking to boost your brand's visibility, drive
                             more traffic, or increase conversions, our team is ready to
                             build a strategy that works for you. Let's discuss your:
                             <ul className="list-disc list-inside mt-2 space-y-1">
                                 <li>Business Objectives & Goals</li>
                                 <li>Target Audience & Market</li>
                                 <li>Current Marketing Challenges</li>
                             </ul>
                         </p>
                         <div className="space-y-4">
                             <div className="flex items-center space-x-3">
                                 <div className="bg-primary/10 text-primary p-2 rounded-full">
                                     <Phone className="w-5 h-5" />
                                 </div>
                                 <a
                                     href="tel:+1234567890"
                                     className="text-lg text-foreground hover:text-primary transition-colors"
                                 >
                                     +91 15534 45353
                                 </a>
                             </div>
                             <div className="flex items-center space-x-3">
                                 <div className="bg-primary/10 text-primary p-2 rounded-full">
                                     <Mail className="w-5 h-5" />
                                 </div>
                                 <a
                                     href="mailto:hello@nexus.com"
                                     className="text-lg text-foreground hover:text-primary transition-colors"
                                 >
                                     hello@nexus.com
                                 </a>
                             </div>
                             <div className="flex items-center space-x-3">
                                 <div className="bg-primary/10 text-primary p-2 rounded-full">
                                     <MapPin className="w-5 h-5" />
                                 </div>
                                 <p className="text-lg text-foreground">
                                     Nagpur,Maharashtra
                                 </p>
                             </div>
                         </div>
                    </div>

                    {/* Right Column (Form) */}
                    <div>
                        <Card className="border-border bg-secondary">
                            <CardHeader>
                                <CardTitle className="text-2xl">Get a Free Quote</CardTitle>
                                <CardDescription className="text-base">
                                    Fill out the form and our team will be in touch shortly.
                                </CardDescription>
                            </CardHeader>
                            <form onSubmit={handleSubmit}>
                                <CardContent className="space-y-4">
                                    {/* Service Select */}
                                    <div className="sm:col-span-2 grid gap-2">
                                        <Label htmlFor="services" className="text-base">Services Interested In</Label>
                                        <Select onValueChange={setService} value={service} required>
                                            <SelectTrigger id="services" className="text-base p-3">
                                                <SelectValue placeholder="Select a service" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="seo" className="text-base">Search Engine Optimization (SEO)</SelectItem>
                                                <SelectItem value="ppc" className="text-base">Pay-Per-Click (PPC) Advertising</SelectItem>
                                                <SelectItem value="social-media" className="text-base">Social Media Marketing</SelectItem>
                                                <SelectItem value="content-marketing" className="text-base">Content Marketing</SelectItem>
                                                <SelectItem value="branding-creative" className="text-base">Branding & Creative Services</SelectItem>
                                                <SelectItem value="analytics-reporting" className="text-base">Analytics & Reporting</SelectItem>
                                                <SelectItem value="other" className="text-base">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {/* Message Textarea */}
                                    <div className="sm:col-span-2 grid gap-2">
                                        <Label htmlFor="message" className="text-base">Message</Label>
                                        <Textarea
                                            id="message"
                                            placeholder="Tell us about your project goals"
                                            className="text-base p-3 resize-none overflow-y-auto"
                                            style={{ maxHeight: '30vh', minHeight: '80px' }}
                                            value={message}
                                            ref={messageRef}
                                            onChange={handleMessageChange}
                                            required
                                        />
                                    </div>
                                    {/* Error/Success Messages */}
                                    {error && <p className="text-sm text-destructive">{error}</p>}
                                    {success && (
                                        <div className="flex items-center text-sm text-green-600 dark:text-green-500">
                                            <CheckCircle className="w-4 h-4 mr-2"/>
                                            Message sent successfully! We'll get back to you soon.
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="flex justify-end">
                                    {/* Submit Button */}
                                    <Button type="submit" className="btn-primary text-base px-6 py-3" disabled={isSubmitting}>
                                        {isSubmitting ? 'Sending...' : 'Send Message'}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer/>
        </div>
    );
}

// export default ContactPage; // Use if needed