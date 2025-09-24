import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import AuthIllustration from "@/assets/Auth.png";
import NexusLogo from '@/assets/Logo.png'; // Import logo

// A simple component for a divider with text
const OrDivider = () => (
  <div className="flex items-center my-4">
    <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
    <span className="mx-4 text-xs font-medium text-gray-400 uppercase">OR</span>
    <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
  </div>
);

// A simple component for social login buttons
const SocialLogins = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    <Button variant="outline">
      <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.222 0-9.618-3.428-11.286-8.001l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l6.19 5.238C44.434 34.048 46 29.496 46 24c0-1.341-.138-2.65-.389-3.917z"></path></svg>
      Google
    </Button>
    <Button variant="outline">
      <svg className="mr-2 h-4 w-4" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>
      GitHub
    </Button>
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
)

export function AuthPage() {
  return (
    <>
    <AuthHeader/>
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      {/* Left Column: Image and Welcome Text */}
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
                <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-2 mt-1 text-primary flex-shrink-0"/><span>Collaborate with our experts and manage projects seamlessly.</span></li>
                <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-2 mt-1 text-primary flex-shrink-0"/><span>Access exclusive resources and marketing insights.</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right Column: Auth Forms */}
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
                    <Input id="login-email" type="email" placeholder="m@example.com" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="login-password">Password</Label>
                        <Link to="#" className="text-sm font-medium text-primary hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                    <Input id="login-password" type="password" />
                  </div>
                  <Button className="w-full btn-primary">Login</Button>
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
                    <Input id="signup-name" placeholder="John Doe" />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="signup-org">Organization Name (Optional)</Label>
                    <Input id="signup-org" placeholder="Acme Inc." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input id="signup-email" type="email" placeholder="m@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input id="signup-password" type="password" />
                  </div>
                  <div className="pt-2">
                    <Button className="w-full btn-primary">Create Account</Button>
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