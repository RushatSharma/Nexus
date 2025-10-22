import React, { useState, useEffect } from "react";
// Import Supabase client
import { supabase } from "../supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Menu,
  Moon,
  Sun,
  X,
} from "lucide-react";
import AuthIllustration from "@/assets/Auth.png";
import AuthIllustrationWhite from "@/assets/AuthWhite.png";
import NexusLogo from "@/assets/Logo.png";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const OrDivider = () => (
    <div className="flex items-center my-2">
        <div className="flex-grow border-t border-border"></div>
        <span className="mx-4 text-xs font-medium text-muted-foreground uppercase">
            OR
        </span>
        <div className="flex-grow border-t border-border"></div>
    </div>
);

// Note: Supabase social logins require configuration in the Supabase dashboard
// and potentially different client-side logic. Keeping buttons for now.
const SocialLogins = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button variant="outline" disabled>Google (Coming Soon)</Button>
        <Button variant="outline" disabled>GitHub (Coming Soon)</Button>
    </div>
);

// AuthHeader remains mostly the same, only used for layout and theme toggle
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

export function AuthPage() {
    const [isDarkMode, setIsDarkMode] = useState(
        document.documentElement.classList.contains("dark")
    );
    const [signupName, setSignupName] = useState("");
    const [signupOrg, setSignupOrg] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [signupLoading, setSignupLoading] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showSignupPassword, setShowSignupPassword] = useState(false);
    const navigate = useNavigate();

    // Theme toggling logic remains the same
    const toggleTheme = () => {
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

    useEffect(() => {
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

    const [alert, setAlert] = useState<{
        type: "success" | "destructive";
        message: string;
    } | null>(null);

    // showAlert function remains the same
    const showAlert = (
        type: "success" | "destructive",
        message: string,
        redirect = false
    ) => {
        setAlert({ type, message });
        if (redirect) {
            setTimeout(() => {
                setAlert(null);
                navigate("/"); // Navigate after successful login/signup
            }, 1500); // Short delay for user to see success message
        } else {
            // Auto-dismiss error alerts after a few seconds
            setTimeout(() => setAlert(null), 4000);
        }
    };

    // --- Supabase Signup Logic ---
    const handleSignup = async () => {
        if (!signupEmail || !signupPassword || !signupName) {
            showAlert("destructive", "Please fill in Name, Email, and Password.");
            return;
        }
        setSignupLoading(true);
        setError(null); // Clear previous errors

        try {
            // Step 1: Sign up the user with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: signupEmail,
                password: signupPassword,
            });

            if (authError) throw authError; // Throw if Supabase Auth signup fails

            // Check if user object exists (should exist if no error)
            const user = authData.user;
            if (!user) {
                throw new Error("Signup successful but user data is missing.");
            }

            // Step 2: Insert user profile data into the 'users' table
            // Link the profile to the auth user via the user.id
            const { error: insertError } = await supabase
                .from('users') // Your table name
                .insert({
                    id: user.id, // Foreign key linking to auth.users table
                    name: signupName,
                    email: signupEmail, // Store email here too for easier querying if needed
                    organization: signupOrg || null, // Handle optional field
                    role: 'user' // Default role
                });

            if (insertError) {
                // Handle potential profile insertion errors (e.g., if RLS prevents it)
                console.error("Error inserting user profile:", insertError);
                // Optionally: try to delete the auth user if profile creation fails critically
                // await supabase.auth.admin.deleteUser(user.id); // Requires admin privileges - cannot do from client-side
                throw new Error(`Account created, but failed to save profile: ${insertError.message}`);
            }

            // Show success message - Supabase usually requires email confirmation
            showAlert(
              "success",
              "Account created! Please check your email to confirm your address before logging in."
            );
            // Optionally clear form fields
            setSignupName('');
            setSignupOrg('');
            setSignupEmail('');
            setSignupPassword('');
            // Don't redirect automatically, user needs to confirm email first

        } catch (error: any) {
            console.error("Signup Error:", error);
            // Provide more specific Supabase error messages if possible
            let message = error.message || "An unknown signup error occurred.";
            if (error.message.includes("User already registered")) {
                message = "An account with this email already exists. Please log in.";
            } else if (error.message.includes("Password should be at least 6 characters")) {
                 message = "Password should be at least 6 characters long.";
            }
            showAlert("destructive", message);
        } finally {
            setSignupLoading(false);
        }
    };

    // --- Supabase Login Logic ---
    const handleLogin = async () => {
        if (!loginEmail || !loginPassword) {
            showAlert("destructive", "Please enter both email and password.");
            return;
        }
        setLoginLoading(true);
        setError(null); // Clear previous errors

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: loginEmail,
                password: loginPassword,
            });

            if (error) throw error;

            // AuthContext listener will handle fetching user data and redirecting
            // Show temporary success message here before context handles navigation
             showAlert("success", "Logged in successfully! Redirecting...");
             // No need to call navigate('/') here directly if AuthContext handles it

        } catch (error: any) {
             console.error("Login Error:", error);
            // Provide more specific Supabase error messages
            let message = error.message || "An unknown login error occurred.";
             if (error.message.includes("Invalid login credentials")) {
                message = "Incorrect email or password. Please try again.";
            } else if (error.message.includes("Email not confirmed")) {
                 message = "Please confirm your email address before logging in. Check your inbox.";
             }
            showAlert("destructive", message);
        } finally {
            setLoginLoading(false);
        }
    };
    const [error, setError] = useState<string | null>(null);

    // JSX structure remains largely the same, only button onClick handlers change
    return (
        <>
            <AuthHeader isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

             {/* Alert Section */}
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
                {alert && (
                    <Alert
                        variant={alert.type}
                        // Removed withIcon prop as we add icon manually below for better control
                        dismissible
                        onDismiss={() => setAlert(null)}
                        className="shadow-lg flex items-start" // Use flex for icon alignment
                    >
                         {/* Manually add icon */}
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
                 {error && <div className="text-red-500 mt-2">{error}</div>}
            </div>

            <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
                {/* Left Column (Illustration) */}
                <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-background">
                   <div className="text-center space-y-8">
                      <img
                        src={isDarkMode ? AuthIllustrationWhite : AuthIllustration}
                        alt="Marketing Illustration"
                        className="w-full max-w-sm mx-auto"
                      />
                      <h1 className="text-4xl font-bold leading-tight text-foreground">
                        Unlock Your Brand's Potential
                      </h1>
                      {/* ... rest of the illustration section ... */}
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
                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-bold tracking-tight text-foreground">
                                Access Your Account
                            </h2>
                            <p className="mt-2 text-muted-foreground">
                                Welcome! Please enter your details.
                            </p>
                        </div>

                        <Tabs defaultValue="login" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="login">Login</TabsTrigger>
                                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                            </TabsList>

                            {/* Login Tab */}
                            <TabsContent value="login" className="mt-4">
                                <Card className="border-none shadow-none bg-transparent">
                                    <CardContent className="space-y-4 p-0">
                                        <div className="space-y-2">
                                            <Label htmlFor="login-email">Email</Label>
                                            <Input
                                                id="login-email"
                                                type="email"
                                                placeholder="m@example.com"
                                                value={loginEmail}
                                                onChange={(e) => setLoginEmail(e.target.value)}
                                                required // Added required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="login-password">Password</Label>
                                                {/* <Link // Simplified: removed forgot password for now
                                                    to="#"
                                                    className="text-sm font-medium text-primary hover:underline"
                                                >
                                                    Forgot password?
                                                </Link> */}
                                            </div>
                                            <div className="relative">
                                                <Input
                                                    id="login-password"
                                                    type={showLoginPassword ? "text" : "password"}
                                                    value={loginPassword}
                                                    onChange={(e) => setLoginPassword(e.target.value)}
                                                    required // Added required
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
                                        <Button
                                            className="w-full btn-primary"
                                            onClick={handleLogin} // Use updated Supabase handler
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
                                        <div className="space-y-2">
                                            <Label htmlFor="signup-name">Full Name</Label>
                                            <Input
                                                id="signup-name"
                                                placeholder="John Doe"
                                                value={signupName}
                                                onChange={(e) => setSignupName(e.target.value)}
                                                required // Added required
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
                                                required // Added required
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
                                                    required // Added required
                                                    minLength={6} // Added minLength for basic validation
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
                                             <p className="text-xs text-muted-foreground">Password must be at least 6 characters.</p>
                                        </div>
                                        <div className="pt-2">
                                            <Button
                                                className="w-full btn-primary"
                                                onClick={handleSignup} // Use updated Supabase handler
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

// NOTE: Remember to remove the old Firebase imports if they were present at the top
// e.g., import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
// e.g., import { auth, db } from "../firebase";
// e.g., import { doc, setDoc } from "firebase/firestore";
