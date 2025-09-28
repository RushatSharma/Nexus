import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Sun, Moon, LogOut } from 'lucide-react';
import NexusLogo from '@/assets/Logo.png';
import { useAuth } from '@/contexts/AuthContext';
import { auth, db } from '@/firebase';
import { signOut } from 'firebase/auth';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';

interface Message {
    id: string;
    service: string;
    message: string;
    status: string;
    createdAt: Timestamp | null;
}

const ProfileButton = () => {
    const { currentUser, userData } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/');
    };
    
    const fetchMessages = async () => {
        if (!currentUser) return;
        setLoadingMessages(true);
        const q = query(
            collection(db, "messages"), 
            where("userId", "==", currentUser.uid),
            orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const userMessages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
        setMessages(userMessages);
        setLoadingMessages(false);
    };

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');

    return (
        <Popover onOpenChange={(open) => open && fetchMessages()}>
            <PopoverTrigger asChild>
                <Button variant="ghost" className="rounded-full w-10 h-10">
                    <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData?.name || 'A'}`} />
                        <AvatarFallback>{userData?.name ? getInitials(userData.name) : 'U'}</AvatarFallback>
                    </Avatar>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                         <Avatar>
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData?.name || 'A'}`} />
                            <AvatarFallback>{userData?.name ? getInitials(userData.name) : 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{userData?.name}</p>
                            <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
                        </div>
                    </div>
                    <Separator />
                    <div>
                        <h4 className="text-sm font-semibold mb-2">Message History</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {loadingMessages ? <p className="text-sm text-muted-foreground">Loading messages...</p> : 
                                messages.length > 0 ? messages.map(msg => (
                                    <div key={msg.id} className="text-sm p-2 bg-secondary rounded-md">
                                        <p className="font-semibold capitalize">{msg.service}</p>
                                        <p className="text-muted-foreground truncate">{msg.message}</p>
                                        <p className="text-xs text-muted-foreground/70 capitalize">Status: {msg.status}</p>
                                    </div>
                                )) : <p className="text-sm text-muted-foreground">No messages sent yet.</p>
                            }
                        </div>
                    </div>
                    <Separator />
                    <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    if (newIsDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container-custom">
        <div className="relative flex items-center justify-between h-16 lg:h-20">
          
          {/* Left Side: Logo */}
          <div className="lg:flex-1 flex justify-start">
            <NavLink to="/" className="flex items-center space-x-2">
              <img src={NexusLogo} alt="NEXUS Logo" className="h-8 w-auto" />
              <span className="text-xl font-bold text-foreground">NEXUS</span>
            </NavLink>
          </div>

          {/* Center: Navigation (Desktop) */}
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

          {/* Right Side: Theme Toggle and Auth (Desktop) */}
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
            <button
              className="p-2 rounded-md text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Content */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
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
                 {currentUser ? (
                     <div className='px-3 flex flex-col gap-3'>
                        <p className="text-muted-foreground">Welcome, {userData?.name || 'User'}</p>
                        <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                     </div>
                 ) : (
                     <>
                        <NavLink to="/signup" onClick={() => setIsMenuOpen(false)}>
                            <Button className="btn-primary w-full">Sign Up</Button>
                        </NavLink>
                    </>
                 )}
                 <div className="px-3 pt-2">
                    <Button variant="outline" className="w-full" onClick={toggleTheme}>
                        {isDarkMode ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                        Toggle Theme
                    </Button>
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

