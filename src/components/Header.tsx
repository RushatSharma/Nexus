import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Sun, Moon, LogOut, User as UserIcon } from 'lucide-react';
import NexusLogo from '@/assets/Logo.png';
import NexusLogoWhite from '@/assets/LogoNavWhite.png';
import { useAuth } from '@/hooks/useAuth'; // Now uses Supabase context
import { supabase } from '@/supabaseClient'; // Import Supabase client
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { toast } from 'sonner'; // Optional: for logout feedback

// --- ProfileButton Component ---
const ProfileButton = () => {
    // useAuth now provides Supabase user and profile data
    const { currentUser, userData } = useAuth();
    const navigate = useNavigate();

    // Helper functions remain the same
    const getInitials = (name: string | undefined): string => name ? name.split(' ').map(n => n[0]).join('') : '';
    const getFirstName = (name: string | undefined): string => name ? name.split(' ')[0] : 'User';

    // Logout handler specific to this button (or call a shared one if needed)
    const handlePopoverLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) { console.error("Logout Error:", error); toast.error(`Logout failed: ${error.message}`); }
        else { navigate('/'); toast.success("Logged out successfully!"); }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" className="rounded-full w-10 h-10 p-0"> {/* Adjusted padding */}
                    <Avatar className="w-9 h-9"> {/* Slightly smaller avatar */}
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData?.name || 'A'}`} alt={userData?.name || 'User Avatar'}/>
                        <AvatarFallback>{getInitials(userData?.name)}</AvatarFallback>
                    </Avatar>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 mr-4"> {/* Added margin for better placement */}
                <div className="flex flex-col items-center text-center p-2">
                    <Avatar className="w-16 h-16 mb-2">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData?.name || 'A'}`} alt={userData?.name || 'User Avatar'}/>
                        <AvatarFallback className="text-2xl">{getInitials(userData?.name)}</AvatarFallback>
                    </Avatar>
                    <p className="font-semibold text-lg">Hi, {getFirstName(userData?.name)}!</p>
                    <p className="text-sm text-muted-foreground mb-4 break-all">{currentUser?.email}</p> {/* Added break-all */}

                    <NavLink to="/account" className="w-full">
                        <Button variant="default" className="w-full btn-primary mb-2">
                           <UserIcon className="w-4 h-4 mr-2" />
                            Manage Account
                        </Button>
                    </NavLink>
                    {/* Logout Button in Popover */}
                    <Button variant="outline" className="w-full" onClick={handlePopoverLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}


// --- Header Component ---
const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });
  const { currentUser, isAdmin, userData } = useAuth();
  console.log("Header rendering. currentUser:", currentUser); // <-- ADDED DEBUG LOG
  const navigate = useNavigate();

  // --- Shared Logout Logic for Mobile Menu ---
  const handleMobileLogout = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
          console.error("Logout Error:", error);
          toast.error(`Logout failed: ${error.message}`);
      } else {
          setIsMenuOpen(false); // Close mobile menu
          navigate('/');
          toast.success("Logged out successfully!");
      }
  };


  // Base navigation links
  const baseNavigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Contact Us', href: '/contact' },
  ];

  // Dynamically build navigation
  const getNavigation = () => {
    let nav = [...baseNavigation];
    if (isAdmin) {
      nav.push({ name: 'Admin', href: '/admin' });
    }
    return nav;
  };

  const navigation = getNavigation();

  // Theme effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Theme toggle function
  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

   // Get initials function
  const getInitials = (name: string | undefined): string => name ? name.split(' ').map(n => n[0]).join('') : '';


  // JSX
  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container-custom">
        <div className="relative flex items-center justify-between h-16 lg:h-20">

          <div className="lg:flex-1 flex justify-start">
            <NavLink to="/" className="flex items-center space-x-2">
              <img src={isDarkMode ? NexusLogoWhite : NexusLogo} alt="NEXUS Logo" className="h-8 w-auto" />
              <span className="text-xl font-bold text-foreground">NEXUS.CO</span>
            </NavLink>
          </div>

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

          <div className="hidden lg:flex flex-1 justify-end items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md bg-secondary hover:bg-muted transition-colors"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Conditional rendering based on Supabase currentUser */}
            {currentUser ? (
              <ProfileButton /> // ProfileButton handles its own popover and logout
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
                   {/* Add Manage Account Link */}
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

              {/* Navigation links */}
              {navigation.map((item) => (
                // Exclude Account link if user is logged in
                (!currentUser || item.href !== '/account') && (
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
                )
              ))}

              {/* Signup button if not logged in */}
              {!currentUser && (
                <NavLink to="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="btn-primary w-full mt-2">Sign Up</Button>
                </NavLink>
              )}

              {/* Theme toggle and Logout (if logged in) */}
              <div className="pt-3 border-t border-border mt-2">
                 <div className="px-3 pt-2 space-y-2">
                    <Button variant="outline" className="w-full" onClick={toggleTheme}>
                        {isDarkMode ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                        Toggle Theme
                    </Button>
                    {/* Add Logout Button */}
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
