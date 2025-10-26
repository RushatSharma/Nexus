import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Sun, Moon, LogOut, User as UserIcon } from 'lucide-react';
import NexusLogo from '@/assets/Logo.webp';
import NexusLogoWhite from '@/assets/LogoNavWhite.webp';
import { useAuth } from '@/hooks/useAuth';
import { account } from '@/appwriteClient';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// --- ProfileButton Component (No changes needed from last version) ---
const ProfileButton = () => {
    // ... (Keep the existing ProfileButton component code) ...
    const { currentUser, userData } = useAuth();
    const navigate = useNavigate();

    const getInitials = (name: string | undefined): string => name ? name.split(' ').map(n => n[0]).join('') : '';
    const getFirstName = (name: string | undefined): string => name ? name.split(' ')[0] : 'User';

    const handlePopoverLogout = async () => {
        try {
            await account.deleteSession('current');
            navigate('/');
            toast.success("Logged out successfully!");
        } catch (error: any) {
            console.error("Logout Error:", error);
            toast.error(`Logout failed: ${error.message || 'Unknown error'}`);
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" className="rounded-full w-10 h-10 p-0">
                    <Avatar className="w-9 h-9">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData?.name || 'A'}`} alt={userData?.name || 'User Avatar'}/>
                        <AvatarFallback>{getInitials(userData?.name)}</AvatarFallback>
                    </Avatar>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 mr-4">
                <div className="flex flex-col items-center text-center p-2">
                    <Avatar className="w-16 h-16 mb-2">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData?.name || 'A'}`} alt={userData?.name || 'User Avatar'}/>
                        <AvatarFallback className="text-2xl">{getInitials(userData?.name)}</AvatarFallback>
                    </Avatar>
                    <p className="font-semibold text-lg">Hi, {getFirstName(userData?.name)}!</p>
                    <p className="text-sm text-muted-foreground mb-4 break-all">{currentUser?.email}</p>

                    <NavLink to="/account" className="w-full">
                        <Button variant="default" className="w-full btn-primary mb-2">
                           <UserIcon className="w-4 h-4 mr-2" />
                            Manage Account
                        </Button>
                    </NavLink>
                    <Button variant="outline" className="w-full" onClick={handlePopoverLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
};


// --- Header Component ---
const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });
  const { currentUser, isAdmin, userData } = useAuth(); // Get auth state
  const navigate = useNavigate();

  // --- Mobile Logout Logic (no change) ---
  const handleMobileLogout = async () => {
      // ... (keep existing handleMobileLogout code) ...
        try {
            await account.deleteSession('current');
            setIsMenuOpen(false);
            navigate('/');
            toast.success("Logged out successfully!");
        } catch (error: any) {
            console.error("Logout Error:", error);
            toast.error(`Logout failed: ${error.message || 'Unknown error'}`);
        }
  };


  // --- Base navigation links ---
  const baseNavigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Contact Us', href: '/contact' },
    // Removed Account from base, we'll add it conditionally
  ];

  // --- Theme effect (no change) ---
  useEffect(() => {
    // ... (keep existing theme effect code) ...
     if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // --- Theme toggle function (no change) ---
  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

   // --- Get initials function (no change) ---
  const getInitials = (name: string | undefined): string => name ? name.split(' ').map(n => n[0]).join('') : '';


  // --- JSX ---
  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container-custom">
        <div className="relative flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <div className="lg:flex-1 flex justify-start">
            <NavLink to="/" className="flex items-center space-x-2">
              <img src={isDarkMode ? NexusLogoWhite : NexusLogo} alt="NEXUS Logo" className="h-8 w-auto" />
              <span className="text-xl font-bold text-foreground">NEXUS.CO</span>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center space-x-8">
            {/* Map base navigation */}
            {baseNavigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn( /* --- Keep existing cn logic --- */
                    "font-medium text-foreground transition-colors hover:text-primary py-2 relative",
                    "after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-center after:scale-x-0 after:bg-primary after:transition-transform after:duration-300",
                    isActive && "text-primary after:scale-x-100"
                  )
                }
              >
                {item.name}
              </NavLink>
            ))}
            {/* Conditionally add Account Link */}
            {currentUser && (
               <NavLink
                 to="/account"
                 className={({ isActive }) =>
                   cn( /* --- Keep existing cn logic --- */
                     "font-medium text-foreground transition-colors hover:text-primary py-2 relative",
                     "after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-center after:scale-x-0 after:bg-primary after:transition-transform after:duration-300",
                     isActive && "text-primary after:scale-x-100"
                   )
                 }
               >
                 Account
               </NavLink>
            )}
            {/* Conditionally add Admin Link */}
            {isAdmin && (
                 <NavLink
                 to="/admin"
                 className={({ isActive }) =>
                   cn( /* --- Keep existing cn logic --- */
                     "font-medium text-foreground transition-colors hover:text-primary py-2 relative",
                     "after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-center after:scale-x-0 after:bg-primary after:transition-transform after:duration-300",
                     isActive && "text-primary after:scale-x-100"
                   )
                 }
               >
                 Admin
               </NavLink>
            )}
          </nav>

          {/* Right side actions (Theme toggle, Profile/Signup) */}
          <div className="hidden lg:flex flex-1 justify-end items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md bg-secondary hover:bg-muted transition-colors"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {currentUser ? (
              <ProfileButton />
            ) : (
              <div className="flex items-center gap-2">
                <NavLink to="/signup">
                  <Button className="btn-primary">Sign Up</Button>
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
             {/* ... (Keep existing button) ... */}
              <button
                className="p-2 rounded-md text-foreground"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
                >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isMenuOpen && (
          <div className="absolute left-0 w-full lg:hidden bg-background/95 backdrop-blur-sm p-4 border-t border-border shadow-md">
            <nav className="flex flex-col space-y-1">
              {/* User info in mobile menu */}
              {currentUser && (
                <>
                  <div className="px-3 py-2 flex items-center gap-3">
                    {/* ... (Keep existing Avatar section) ... */}
                     <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData?.name || 'A'}`} alt={userData?.name || 'User Avatar'}/>
                        <AvatarFallback>{getInitials(userData?.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-foreground">{userData?.name || "User"}</p>
                        <p className="text-sm text-muted-foreground break-all">{currentUser.email}</p>
                    </div>
                  </div>
                  <Separator className="my-2"/>
                  {/* Keep Manage Account Link here */}
                   <NavLink
                     to="/account"
                     className={({ isActive }) =>
                       cn(
                         "text-foreground hover:text-primary px-3 py-2 rounded-md",
                         isActive && "bg-secondary text-primary font-semibold"
                       )
                     }
                     onClick={() => setIsMenuOpen(false)}
                   >
                     Manage Account
                   </NavLink>
                </>
              )}

              {/* Base Navigation links */}
              {baseNavigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      cn( /* --- Keep existing cn logic --- */
                        "text-foreground hover:text-primary px-3 py-2 rounded-md",
                        isActive && "bg-secondary text-primary font-semibold"
                      )
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </NavLink>
              ))}
              {/* Conditionally add Account Link for logged-in users */}
               {currentUser && !isAdmin && ( // Only show if logged in AND not admin (admins have separate link below)
                 <NavLink
                   to="/account"
                   className={({ isActive }) =>
                     cn( /* --- Keep existing cn logic --- */
                        "text-foreground hover:text-primary px-3 py-2 rounded-md",
                        isActive && "bg-secondary text-primary font-semibold"
                      )
                   }
                   onClick={() => setIsMenuOpen(false)}
                 >
                   Account
                 </NavLink>
               )}
               {/* Conditionally add Admin Link */}
               {isAdmin && (
                 <NavLink
                   to="/admin"
                   className={({ isActive }) =>
                     cn( /* --- Keep existing cn logic --- */
                        "text-foreground hover:text-primary px-3 py-2 rounded-md",
                        isActive && "bg-secondary text-primary font-semibold"
                      )
                   }
                   onClick={() => setIsMenuOpen(false)}
                 >
                   Admin
                 </NavLink>
               )}


              {/* Signup button if not logged in */}
              {!currentUser && (
                 <NavLink to="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="btn-primary w-full mt-2">Sign Up</Button>
                </NavLink>
              )}

              {/* Theme toggle and Logout (if logged in) */}
              <div className="pt-3 border-t border-border mt-2">
                 <div className="px-3 pt-2 space-y-2">
                    {/* ... (Keep Theme Toggle Button) ... */}
                    <Button variant="outline" className="w-full" onClick={toggleTheme}>
                        {isDarkMode ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                        Toggle Theme
                    </Button>
                    {/* Logout Button uses Appwrite handler */}
                    {currentUser && (
                       <Button variant="outline" className="w-full" onClick={handleMobileLogout}>
                           <LogOut className="w-4 h-4 mr-2" />
                           Logout
                       </Button>
                    )}
                 </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;