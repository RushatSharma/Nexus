import React, { useState, useEffect } from "react";
// 1. Import Appwrite account and ID, remove supabase
import { databases, ID } from '@/appwriteClient';
import { account} from '@/appwriteClient';
import { AppwriteException } from 'appwrite'; // Optional: for specific error codes
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    CheckCircle,
    CheckCircle2,
    Eye,
    EyeOff,
    Menu,
    Moon,
    Sun,
    X,
} from "lucide-react";
import AuthIllustration from "@/assets/AuthBlack.webp";
import AuthIllustrationWhite from "@/assets/AuthWhite.webp";
import NexusLogo from "@/assets/Logo.webp";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth"; // Still used to check if already logged in

// --- Components (OrDivider, SocialLogins, AuthHeader) remain unchanged ---
// Keep the OrDivider, SocialLogins, and AuthHeader components exactly as they were.
// ... (Paste your existing OrDivider, SocialLogins, and AuthHeader components here) ...
const OrDivider = () => (
    <div className="flex items-center my-2">
        <div className="flex-grow border-t border-border"></div>
        <span className="mx-4 text-xs font-medium text-muted-foreground uppercase">
            OR
        </span>
        <div className="flex-grow border-t border-border"></div>
    </div>
);

const SocialLogins = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* TODO: Implement Appwrite OAuth */}
        <Button variant="outline" disabled>Google (Coming Soon)</Button>
        <Button variant="outline" disabled>GitHub (Coming Soon)</Button>
    </div>
);

const AuthHeader = ({ isDarkMode, toggleTheme }: { isDarkMode: boolean; toggleTheme: () => void }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigation = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Projects", href: "/projects" },
        { name: "Contact Us", href: "/contact" },
    ];

    return (
        <header className="absolute top-0 left-0 right-0 p-4 bg-transparent z-20">
            <div className="container-custom flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2">
                    <img src={NexusLogo} alt="NEXUS Logo" className="h-8 w-auto" />
                    <span className="text-xl font-bold text-foreground">NEXUS</span>
                </Link>
                <nav className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center space-x-8">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            className={({ isActive }) =>
                                cn(
                                    "font-medium text-foreground transition-colors hover:text-primary py-2 relative",
                                    "after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-center after:scale-x-0 after:bg-primary after:transition-transform after:duration-300",
                                    isActive && "text-primary after:scale-x-100"
                                )
                            }
                        >
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
                <div className="hidden lg:flex items-center space-x-2">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-md bg-secondary hover:bg-muted transition-colors"
                        aria-label="Toggle Theme"
                    >
                        {isDarkMode ? (
                            <Sun className="w-5 h-5" />
                        ) : (
                            <Moon className="w-5 h-5" />
                        )}
                    </button>
                    <Link to="/" className="hidden sm:flex">
                        <Button variant="outline" className="btn-outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
                <div className="lg:hidden">
                    <button
                        className="p-2 rounded-md text-foreground"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>
            {isMenuOpen && (
                <div className="absolute left-0 w-full lg:hidden bg-background/95 backdrop-blur-sm p-4 border-t border-border shadow-md">
                    <nav className="flex flex-col space-y-3">
                        {navigation.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.href}
                                className={({ isActive }) =>
                                    cn(
                                        "text-foreground hover:text-primary px-3 py-2 rounded-md",
                                        isActive && "bg-secondary text-primary font-semibold"
                                    )
                                }
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.name}
                            </NavLink>
                        ))}
                        <div className="pt-3 border-t border-border flex flex-col gap-3">
                            <div className="px-3 pt-2">
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={toggleTheme}
                                >
                                    {isDarkMode ? (
                                        <Sun className="w-4 h-4 mr-2" />
                                    ) : (
                                        <Moon className="w-4 h-4 mr-2" />
                                    )}
                                    Toggle Theme
                                </Button>
                            </div>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};


// --- Main AuthPage Component ---
export function AuthPage() {
    // --- State variables remain the same ---
    const [isDarkMode, setIsDarkMode] = useState(
        document.documentElement.classList.contains("dark")
    );
    const [signupName, setSignupName] = useState("");
    const [signupOrg, setSignupOrg] = useState(""); // Still capturing this, though not sending to account.create
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [signupLoading, setSignupLoading] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showSignupPassword, setShowSignupPassword] = useState(false);
    const navigate = useNavigate();
    const { currentUser, loading: authLoading } = useAuth(); // Get current user state
    const [alert, setAlert] = useState<{
        type: "success" | "destructive";
        message: string;
    } | null>(null);
    const [error, setError] = useState<string | null>(null); // General error state if needed
    const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
    const USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID;

    // --- Theme toggling logic remains the same ---
    const toggleTheme = () => { /* ... same as before ... */
        setIsDarkMode((prevMode) => {
            const newMode = !prevMode;
            if (newMode) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
            return newMode;
        });
    };

    useEffect(() => { /* ... same observer as before ... */
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === "class") {
                    setIsDarkMode(document.documentElement.classList.contains("dark"));
                }
            });
        });
        observer.observe(document.documentElement, { attributes: true });
        return () => observer.disconnect();
    }, []);

    // --- Redirect effect remains the same ---
     useEffect(() => {
        if (!authLoading && currentUser) {
            console.log("AuthPage: User already logged in, redirecting to /");
            navigate('/');
        }
     }, [currentUser, authLoading, navigate]);

    // --- showAlert function remains the same ---
    const showAlert = (type: "success" | "destructive", message: string) => { /* ... same as before ... */
        setAlert({ type, message });
        setTimeout(() => setAlert(null), 4000); // Increased timeout slightly
    };

    const handleSignup = async () => {
    // --- Input Validations (keep as before) ---
    if (!signupEmail || !signupPassword || !signupName) {
        showAlert("destructive", "Please fill in Name, Email, and Password.");
        return;
    }
    if (signupPassword.length < 8) {
         showAlert("destructive", "Password must be at least 8 characters long.");
         return;
    }
    // --- ---

    // --- Config Check ---
    if (!DATABASE_ID || !USERS_COLLECTION_ID) {
        console.error("Database/Users Collection ID missing in .env for signup profile creation!");
        showAlert("destructive", "Configuration error: Cannot create profile.");
        return;
    }
    // --- ---

    setSignupLoading(true);
    setError(null);
    let createdAuthUser: Models.User<Models.Preferences> | null = null; // To hold the created user for profile step

    try {
        // --- 1. Create Appwrite Auth User ---
        console.log("Attempting account.create...");
        createdAuthUser = await account.create(
            ID.unique(), // Let Appwrite generate Auth User ID
            signupEmail,
            signupPassword,
            signupName
        );
        console.log("account.create successful:", createdAuthUser);

        // --- 2. Immediately Log In ---
        console.log("Attempting createEmailPasswordSession...");
        await account.createEmailPasswordSession(signupEmail, signupPassword);
        console.log("createEmailPasswordSession successful.");

        // --- 3. Create User Profile Document in Database ---
        const newUserProfileData = {
            userId: createdAuthUser.$id, // Link to the Auth user ID
            name: signupName,
            email: signupEmail,
            organization: signupOrg || null, // Use state value or null
            role: 'user' // Default role
        };

        console.log("Attempting databases.createDocument for user profile:", newUserProfileData);
        // Use the Auth user.$id as the Document ID for easy lookup
        await databases.createDocument(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            createdAuthUser.$id, // Use Auth User ID as Document ID
            newUserProfileData
            // TODO: Add document permissions if needed
        );
        console.log("User profile document created successfully.");

        // --- 4. Success & Redirect ---
        showAlert("success", "Account created and logged in! Redirecting...");
        // Clear form (optional, as redirect happens quickly)
        // setSignupName(''); setSignupOrg(''); setSignupEmail(''); setSignupPassword('');
        navigate('/'); // Redirect to home page

        // Note: Appwrite email verification still happens in the background if enabled.
        // The user is logged in immediately here for convenience.

    } catch (error: any) {
        console.error("Signup Process Error:", error);
        let message = error.message || "An unknown error occurred during signup.";

        // More specific error handling
        if (error instanceof AppwriteException) {
             if (error.code === 409 && error.message.toLowerCase().includes('user already exists')) {
                message = "An account with this email already exists. Please log in.";
             } else if (error.code === 401 && error.message.toLowerCase().includes('session')) {
                 // This might happen if login fails right after signup for some reason
                 message = "Account created, but automatic login failed. Please try logging in manually.";
             } else if (error.code === 400 && error.message.toLowerCase().includes('password')) {
                 message = "Password requirements not met.";
             } else if ((error.code === 401 || error.code === 403 || error.code === 404) && error.message.toLowerCase().includes('database')) {
                 // Error happened during profile creation
                 message = "Account created, but failed to save profile. Please try logging in. If issues persist, contact support.";
                 // Optionally: Attempt to clean up - delete the auth user if profile creation fails? (More complex)
             }
        }
        showAlert("destructive", message);
    } finally {
        setSignupLoading(false);
    }
 };

    // --- Appwrite Login Logic ---
    const handleLogin = async () => {
        if (!loginEmail || !loginPassword) {
            showAlert("destructive", "Please enter both email and password.");
            return;
        }
        setLoginLoading(true);
        setError(null); // Clear previous errors

        try {
            // Use Appwrite's createEmailPasswordSession
            await account.createEmailPasswordSession(loginEmail, loginPassword);

            // Login successful! AuthContext's useEffect will re-run `account.get()`,
            // find the session, update the state, and handle redirection.
            showAlert("success", "Logged in successfully! Redirecting...");
            navigate('/');
            // No navigate('/') needed here.

        } catch (error: any) {
             console.error("Login Error:", error);
             let message = error.message || "An unknown login error occurred.";
             // Appwrite specific error checking (examples)
             if (error instanceof AppwriteException) {
                 if (error.code === 401) { // 401 Unauthorized often means invalid credentials
                    message = "Incorrect email or password. Please try again.";
                 } else if (error.code === 400 && error.message.toLowerCase().includes('verification')) { // Check if verification is needed
                     message = "Please verify your email address before logging in. Check your inbox.";
                 } else if (error.code === 404) { // 404 Not Found might indicate user doesn't exist
                     message = "User with this email not found.";
                 }
             }
            showAlert("destructive", message);
        } finally {
            setLoginLoading(false);
        }
    };


     // --- Loading/Redirect Check remains the same ---
     if (authLoading || (!authLoading && currentUser)) {
        return null; // Show nothing or a spinner while loading/redirecting
     }

    // --- JSX structure remains the same ---
    return (
        <>
            <AuthHeader isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

             {/* Alert Section */}
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
                {alert && (
                    <Alert
                        variant={alert.type}
                        dismissible
                        onDismiss={() => setAlert(null)}
                        className="shadow-lg flex items-start"
                    >
                         {alert.type === 'success' && <CheckCircle className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />}
                         {alert.type === 'destructive' && <X className="h-5 w-5 mr-3 text-destructive flex-shrink-0" />}
                        <div>
                            <AlertTitle>
                                {alert.type === "success" ? "Success" : "Error"}
                            </AlertTitle>
                            <AlertDescription>{alert.message}</AlertDescription>
                        </div>
                    </Alert>
                )}
                 {/* Optional: General error display if needed */}
                 {/* {error && <div className="text-red-500 mt-2">{error}</div>} */}
            </div>

            <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
                {/* Left Column (Illustration) - No changes */}
                <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-background">
                   {/* ... same illustration content ... */}
                    <div className="text-center space-y-8">
                        <img
                            src={isDarkMode ? AuthIllustrationWhite : AuthIllustration}
                            alt="Marketing Illustration"
                            className="w-full max-w-sm mx-auto"
                        />
                        <h1 className="text-4xl font-bold leading-tight text-foreground">
                            Unlock Your Brand's Potential
                        </h1>
                        <div className="text-left max-w-md mx-auto space-y-4">
                            <p className="text-lg text-muted-foreground">
                                Join a community of forward-thinking brands and gain access to
                                tools that will elevate your marketing game.
                            </p>
                            <ul className="space-y-2 text-muted-foreground">
                                <li className="flex items-start">
                                    <CheckCircle2 className="w-5 h-5 mr-2 mt-1 text-primary flex-shrink-0" />
                                    Access data-driven insights and analytics to fuel your
                                    growth.
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle2 className="w-5 h-5 mr-2 mt-1 text-primary flex-shrink-0" />
                                    Collaborate with our experts to unlock your brand's creative
                                    potential.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Right Column (Auth Forms) */}
                <div className="flex flex-col items-center justify-center pt-24 pb-12 px-4 sm:px-6 lg:p-8 bg-background">
                    <div className="w-full max-w-md">
                        {/* ... same header ... */}
                         <div className="text-center mb-6">
                            <h2 className="text-3xl font-bold tracking-tight text-foreground">
                                Access Your Account
                            </h2>
                            <p className="mt-2 text-muted-foreground">
                                Welcome! Please enter your details.
                            </p>
                        </div>

                        <Tabs defaultValue="login" className="w-full">
                            {/* ... same TabsList ... */}
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="login">Login</TabsTrigger>
                                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                            </TabsList>

                            {/* Login Tab */}
                            <TabsContent value="login" className="mt-4">
                                <Card className="border-none shadow-none bg-transparent">
                                    <CardContent className="space-y-4 p-0">
                                        {/* ... Input fields remain the same ... */}
                                         <div className="space-y-2">
                                            <Label htmlFor="login-email">Email</Label>
                                            <Input
                                                id="login-email"
                                                type="email"
                                                placeholder="m@example.com"
                                                value={loginEmail}
                                                onChange={(e) => setLoginEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="login-password">Password</Label>
                                            </div>
                                            <div className="relative">
                                                <Input
                                                    id="login-password"
                                                    type={showLoginPassword ? "text" : "password"}
                                                    value={loginPassword}
                                                    onChange={(e) => setLoginPassword(e.target.value)}
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground"
                                                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                                                    aria-label={showLoginPassword ? "Hide password" : "Show password"}
                                                >
                                                    {showLoginPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                </button>
                                            </div>
                                        </div>
                                        {/* Uses Appwrite handleLogin */}
                                        <Button
                                            className="w-full btn-primary"
                                            onClick={handleLogin}
                                            disabled={loginLoading}
                                        >
                                            {loginLoading ? "Logging in..." : "Login"}
                                        </Button>
                                        <OrDivider />
                                        <SocialLogins />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Signup Tab */}
                            <TabsContent value="signup" className="mt-4">
                                 <Card className="border-none shadow-none bg-transparent">
                                    <CardContent className="space-y-3 p-0">
                                        {/* ... Input fields remain the same ... */}
                                        <div className="space-y-2">
                                            <Label htmlFor="signup-name">Full Name</Label>
                                            <Input
                                                id="signup-name"
                                                placeholder="John Doe"
                                                value={signupName}
                                                onChange={(e) => setSignupName(e.target.value)}
                                                required
                                            />
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="signup-org">Organization Name (Optional)</Label>
                                            <Input
                                                id="signup-org"
                                                placeholder="Acme Inc."
                                                value={signupOrg}
                                                onChange={(e) => setSignupOrg(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="signup-email">Email</Label>
                                            <Input
                                                id="signup-email"
                                                type="email"
                                                placeholder="m@example.com"
                                                value={signupEmail}
                                                onChange={(e) => setSignupEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="signup-password">Password</Label>
                                            <div className="relative">
                                                <Input
                                                    id="signup-password"
                                                    type={showSignupPassword ? "text" : "password"}
                                                    value={signupPassword}
                                                    onChange={(e) => setSignupPassword(e.target.value)}
                                                    required
                                                    minLength={8} // Appwrite default minimum
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground"
                                                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                                                    aria-label={showSignupPassword ? "Hide password" : "Show password"}
                                                >
                                                    {showSignupPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                </button>
                                            </div>
                                             <p className="text-xs text-muted-foreground">Password must be at least 8 characters.</p>
                                        </div>
                                        <div className="pt-2">
                                            {/* Uses Appwrite handleSignup */}
                                            <Button
                                                className="w-full btn-primary"
                                                onClick={handleSignup}
                                                disabled={signupLoading}
                                            >
                                                {signupLoading ? "Creating..." : "Create Account"}
                                            </Button>
                                        </div>
                                        <OrDivider />
                                        <SocialLogins />
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </>
    );
}

// Export default if this is the standard export, otherwise keep named export
// export default AuthPage; // If this was the original export style