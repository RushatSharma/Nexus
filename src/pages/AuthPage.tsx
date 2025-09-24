import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import AuthIllustration from "@/assets/Auth.png";
import NexusLogo from "@/assets/Logo.png";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"; // ✅ Import Alert

const OrDivider = () => (
  <div className="flex items-center my-4">
    <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
    <span className="mx-4 text-xs font-medium text-gray-400 uppercase">OR</span>
    <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
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
        <span className="text-xl font-bold text-gray-900 dark:text-white">NEXUS</span>
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

  // Alert state
  const [alert, setAlert] = useState<{
    type: "success" | "destructive";
    message: string;
  } | null>(null);

  // Auto-dismiss alert after 4 seconds
  const showAlert = (type: "success" | "destructive", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleSignup = async () => {
    setSignupLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      showAlert("success", "✅ Account created successfully!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        showAlert("destructive", `❌ Signup failed: ${error.message}`);
      } else {
        showAlert("destructive", "❌ Unknown signup error.");
      }
    } finally {
      setSignupLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoginLoading(true);
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      showAlert("success", "✅ Logged in successfully!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        showAlert("destructive", `❌ Login failed: ${error.message}`);
      } else {
        showAlert("destructive", "❌ Unknown login error.");
      }
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <>
      <AuthHeader />

      {/* Alert Section */}
      <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
        {alert && (
          <Alert variant={alert.type} withIcon dismissible onDismiss={() => setAlert(null)}>
            <AlertTitle>{alert.type === "success" ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
        {/* Left Column */}
        <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-gray-100 dark:bg-slate-800/50">
          <div className="text-center space-y-8">
            <img src={AuthIllustration} alt="Marketing Illustration" className="w-full max-w-sm mx-auto" />
            <h1 className="text-4xl font-bold leading-tight text-gray-900 dark:text-white">
              Unlock Your Growth Potential
            </h1>
            <div className="text-left max-w-md mx-auto space-y-4">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Join a community of forward-thinking brands and gain access to tools that will elevate your marketing game.
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 mt-1 text-primary flex-shrink-0" />
                  Collaborate with our experts and manage projects seamlessly.
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 mt-1 text-primary flex-shrink-0" />
                  Access exclusive resources and marketing insights.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Access Your Account</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Welcome! Please enter your details.</p>
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <Card className="border-none shadow-none bg-transparent">
                  <CardContent className="space-y-4 pt-6">
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
                      <Input
                        id="login-password"
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />
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
              <TabsContent value="signup">
                <Card className="border-none shadow-none bg-transparent">
                  <CardContent className="space-y-3 pt-6">
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
                      <Input
                        id="signup-password"
                        type="password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                      />
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
