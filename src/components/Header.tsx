import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Sun, Moon } from 'lucide-react';
import NexusLogo from '@/assets/Logo.png';

// Define props for the Header component
interface HeaderProps {
  isContactPage?: boolean;
}

const Header = ({ isContactPage = false }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const navigation = [
    { name: 'Home', href: '#' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Portfolio', href: '#portfolio' },
  ];

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm dark:bg-slate-900/95 dark:border-slate-800 border-b border-gray-100 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={NexusLogo} alt="NEXUS Logo" className="h-8 w-auto" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">NEXUS</span>
          </Link>

          {/* Conditional Desktop Navigation */}
          {!isContactPage && (
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
          )}

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>
            
            {/* Conditional Button */}
            {isContactPage ? (
              <Link to="/">
                <Button className="btn-primary">Home</Button>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/contact"> {/* Changed from /login to /contact */}
                  <Button variant="ghost">Contact Us</Button> {/* Changed text from Login */}
                </Link>
                <Link to="/signup">
                  <Button className="btn-primary">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-700 dark:text-gray-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Conditional Mobile Navigation */}
        {isMenuOpen && !isContactPage && (
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
                 <Link to="/contact" onClick={() => setIsMenuOpen(false)}> {/* Changed from /login to /contact */}
                  <Button variant="outline" className="w-full">Contact Us</Button> {/* Changed text from Login */}
                </Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button className="btn-primary w-full">Sign Up</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;