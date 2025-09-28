import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Eye, EyeOff } from "lucide-react";
import AuthIllustration from "@/assets/Auth.png";
import NexusLogo from "@/assets/Logo.png";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const OrDivider = () => (
  <div className="flex items-center my-2">
    <div className="flex-grow border-t border-border"></div>
    <span className="mx-4 text-xs font-medium text-muted-foreground uppercase">OR</span>
    <div className="flex-grow border-t border-border"></div>
  </div>
);

const SocialLogins = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    <Button variant="outline">Google</Button>
    <Button variant="outline">GitHub</Button>
  </div>
);

const AuthHeader = () => (
  <header className="absolute top-0 left-0 right-0 p-4 bg-transparent z-20">
    <div className="container-custom flex justify-between items-center">
      <Link to="/" className="flex items-center space-x-2">
        <img src={NexusLogo} alt="NEXUS Logo" className="h-8 w-auto" />
        <span className="text-xl font-bold text-foreground">NEXUS</span>
      </Link>
      <Link to="/" className="hidden sm:flex">
        <Button variant="outline" className="btn-outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </Link>
    </div>
  </header>
);

export function AuthPage() {
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

  const [alert, setAlert] = useState<{
    type: "success" | "destructive";
    message: string;
  } | null>(null);

  const showAlert = (type: "success" | "destructive", message: string, redirect = false) => {
    setAlert({ type, message });
    if (redirect) {
      setTimeout(() => {
        setAlert(null);
        navigate('/');
      }, 1500);
    } else {
      setTimeout(() => setAlert(null), 4000);
    }
  };

  const handleSignup = async () => {
    if (!signupEmail || !signupPassword || !signupName) {
        showAlert("destructive", "Please fill in all required fields.");
        return;
    }
    setSignupLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      showAlert("success", "Account created successfully! Redirecting...", true);
    } catch (error: any) {
        let message = "An unknown error occurred.";
        switch (error.code) {
            case 'auth/email-already-in-use':
                message = "An account with this email already exists. Please log in.";
                break;
            case 'auth/weak-password':
                message = "Password should be at least 6 characters long.";
                break;
            case 'auth/invalid-email':
                message = "Please enter a valid email address.";
                break;
            case 'auth/network-request-failed':
                message = "Network error. Please check your connection and try again.";
                break;
        }
        showAlert("destructive", message);
    } finally {
      setSignupLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
        showAlert("destructive", "Please fill in both email and password.");
        return;
    }
    setLoginLoading(true);
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      showAlert("success", "Logged in successfully! Redirecting...", true);
    } catch (error: any) {
        let message = "An unknown error occurred.";
        switch (error.code) {
            case 'auth/invalid-credential':
            case 'auth/wrong-password':
                message = "Incorrect email or password. Please try again.";
                break;
            case 'auth/user-not-found':
                message = "No account found with this email. Please sign up.";
                break;
            case 'auth/invalid-email':
                message = "Please enter a valid email address.";
                break;
            case 'auth/network-request-failed':
                message = "Network error. Please check your connection and try again.";
                break;
        }
        showAlert("destructive", message);
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <>
      <AuthHeader />
      
      {/* Alert Section - Positioned as an overlay */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
        {alert && (
            <Alert variant={alert.type} withIcon dismissible onDismiss={() => setAlert(null)} className="shadow-lg backdrop-blur-sm">
                <AlertTitle>{alert.type === "success" ? "Success" : "Error"}</AlertTitle>
                <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
        )}
      </div>

      <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
        {/* Left Column */}
        <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-secondary">
          <div className="text-center space-y-8">
            <img src={AuthIllustration} alt="Marketing Illustration" className="w-full max-w-sm mx-auto" />
            <h1 className="text-4xl font-bold leading-tight text-foreground">
              Unlock Your Brand's Potential
            </h1>
            <div className="text-left max-w-md mx-auto space-y-4">
              <p className="text-lg text-muted-foreground">
                Join a community of forward-thinking brands and gain access to tools that will elevate your marketing game.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 mt-1 text-primary flex-shrink-0" />
                  Access data-driven insights and analytics to fuel your growth.
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 mt-1 text-primary flex-shrink-0" />
                  Collaborate with our experts to unlock your brand's creative potential.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="w-full max-w-md">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Access Your Account</h2>
              <p className="mt-2 text-muted-foreground">Welcome! Please enter your details.</p>
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
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="login-password">Password</Label>
                        <Link to="#" className="text-sm font-medium text-primary hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showLoginPassword ? "text" : "password"}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                        >
                          {showLoginPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                    <Button className="w-full btn-primary" onClick={handleLogin} disabled={loginLoading}>
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
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                        >
                          {showSignupPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                    <div className="pt-2">
                      <Button className="w-full btn-primary" onClick={handleSignup} disabled={signupLoading}>
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