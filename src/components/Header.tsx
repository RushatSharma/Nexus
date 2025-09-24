import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // ✅ Added useLocation
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
                            <p className="text-sm text-gray-500">{currentUser?.email}</p>
                        </div>
                    </div>
                    <Separator />
                    <div>
                        <h4 className="text-sm font-semibold mb-2">Message History</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {loadingMessages ? <p className="text-sm text-gray-500">Loading messages...</p> : 
                                messages.length > 0 ? messages.map(msg => (
                                    <div key={msg.id} className="text-sm p-2 bg-gray-50 dark:bg-slate-800 rounded-md">
                                        <p className="font-semibold capitalize">{msg.service}</p>
                                        <p className="text-gray-600 dark:text-gray-300 truncate">{msg.message}</p>
                                        <p className="text-xs text-gray-400 capitalize">Status: {msg.status}</p>
                                    </div>
                                )) : <p className="text-sm text-gray-500">No messages sent yet.</p>
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

interface HeaderProps {
  isContactPage?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isContactPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Detect current page

  // ✅ Navigation changes based on page
  const navigation = location.pathname === "/projects"
    ? [{ name: "Home", href: "/" }]
    : [
        { name: 'Home', href: '/' },
        { name: 'About', href: '#about' },
        { name: 'Services', href: '#services' },
        { name: 'Projects', href: '/projects' },
      ];

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm dark:bg-slate-900/95 dark:border-slate-800 border-b border-gray-100 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center space-x-2">
            <img src={NexusLogo} alt="NEXUS Logo" className="h-8 w-auto" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">NEXUS</span>
          </Link>
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary font-medium transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            {currentUser ? (
              <>
                <Link to="/contact">
                  <Button variant="ghost">Contact Us</Button>
                </Link>
                <ProfileButton />
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/contact">
                  <Button variant="ghost">Contact Us</Button>
                </Link>
                <Link to="/signup">
                  <Button className="btn-primary">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          <button
            className="lg:hidden p-2 rounded-md text-gray-700 dark:text-gray-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 dark:border-slate-800">
            <nav className="flex flex-col space-y-3">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary px-3 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex flex-col gap-3">
                 {currentUser ? (
                     <div className='px-3 flex flex-col gap-3'>
                        <p className="text-gray-500">Welcome, {userData?.name || 'User'}</p>
                        <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                          <Button variant="ghost" className="w-full">Contact Us</Button>
                        </Link>
                        <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                     </div>
                 ) : (
                     <>
                        <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                            <Button variant="outline" className="w-full">Contact Us</Button>
                        </Link>
                        <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                            <Button className="btn-primary w-full">Sign Up</Button>
                        </Link>
                    </>
                 )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
