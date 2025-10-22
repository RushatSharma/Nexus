import { useState, useRef } from 'react';
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Mail, Phone, MapPin, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input"; // Although Input isn't used, keep for consistency if needed later
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AuroraTextEffect } from "@/components/AuroraTextEffect";
import { useAuth } from '../hooks/useAuth'; // Auth hook now uses Supabase context
import { supabase } from '@/supabaseClient'; // Import Supabase client
// Removed Firebase imports: import { db } from '@/firebase';
// Removed Firebase imports: import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export function ContactPage() {
    const { currentUser } = useAuth(); // Get current Supabase user
    const [service, setService] = useState('');
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // Add loading state

    // Ref for the textarea to adjust height
    const messageRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Check if user is logged in (using Supabase user object now)
        if (!currentUser) {
            setError("You must be logged in to send a message.");
            // Optionally, you could redirect to login here: navigate('/login');
            return;
        }
        if (!service || !message) {
            setError("Please select a service and enter a message.");
            return;
        }
        setError('');
        setSuccess(false);
        setIsSubmitting(true); // Set loading state

        try {
            // Prepare data for Supabase insert
            const messageData = {
                user_id: currentUser.id, // Foreign key to the users table
                email: currentUser.email, // User's email
                service: service,
                message: message,
                // 'created_at' and 'status' will use default values set in the database
            };

            // Insert data into the 'messages' table
            const { error: insertError } = await supabase
                .from('messages') // Your table name
                .insert(messageData);

            if (insertError) {
                // Throw error if insert fails
                throw insertError;
            }

            setSuccess(true);
            setMessage(''); // Clear message field
            setService('');   // Clear service selection
             if (messageRef.current) { // Reset textarea height
                messageRef.current.style.height = "auto";
             }
        } catch (err: any) {
             console.error("Error sending message:", err);
            setError(`Failed to send message: ${err.message || 'Please try again.'}`);
        } finally {
            setIsSubmitting(false); // Reset loading state
        }
    };

    // Textarea height adjustment remains the same
    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
        if (messageRef.current) {
            messageRef.current.style.height = "auto"; // Reset height first
            // Set height based on scroll height, capped at viewport height fraction
            const maxHeight = window.innerHeight * 0.3; // Cap at 30vh
            messageRef.current.style.height = `${Math.min(messageRef.current.scrollHeight, maxHeight)}px`;
        }
    };


    // JSX structure remains mostly the same
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header/>
            <main className="flex-grow container mx-auto px-4 py-12 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                    {/* Left Column (Info) - No changes needed */}
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
                         {/* ... rest of the info section ... */}
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
                                    <div className="sm:col-span-2 grid gap-2">
                                        <Label htmlFor="services" className="text-base">Services Interested In</Label>
                                        <Select onValueChange={setService} value={service} required> {/* Added required */}
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
                                                {/* Add other services if needed */}
                                                <SelectItem value="other" className="text-base">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="sm:col-span-2 grid gap-2">
                                        <Label htmlFor="message" className="text-base">Message</Label>
                                        <Textarea
                                            id="message"
                                            placeholder="Tell us about your project goals"
                                            className="text-base p-3 resize-none overflow-y-auto" // Added overflow-y-auto
                                            style={{ maxHeight: '30vh', minHeight: '80px' }} // Set max/min height via style
                                            value={message}
                                            ref={messageRef}
                                            onChange={handleMessageChange} // Use updated handler
                                            required // Added required
                                        />
                                    </div>
                                    {error && <p className="text-sm text-destructive">{error}</p>}
                                    {success && (
                                        <div className="flex items-center text-sm text-green-600 dark:text-green-500"> {/* Use green color */}
                                            <CheckCircle className="w-4 h-4 mr-2"/>
                                            Message sent successfully! We'll get back to you soon.
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="flex justify-end">
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