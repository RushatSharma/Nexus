import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import NexusLogo from '@/assets/Logo.png'; // Import logo

const Footer = () => {
  const footerLinks = {
    'Quick Links': ['Home', 'About Us', 'Services', 'Portfolio', 'Contact'],
    'Services': ['Digital Marketing', 'Social Media Marketing', 'SEO Optimization', 'Content Creation', 'Email Marketing'],
    'Resources': ['Blog', 'Case Studies', 'Whitepapers', 'Webinars', 'FAQs'],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="dark-section">
      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-2">
                <img src={NexusLogo} alt="NEXUS Logo" className="h-8 w-auto" />
                <span className="text-xl font-bold text-white">NEXUS</span>
              </div>
              
              <p className="text-gray-300 leading-relaxed max-w-md">
                Your Best Marketing Partner - We help businesses transform their digital presence and achieve remarkable growth through innovative marketing strategies.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-300">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>hello@nexus.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>+91 15534 45353</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>Nagpur, Maharashtra</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-gray-300 hover:bg-primary hover:text-white transition-colors duration-200"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title} className="space-y-6">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-gray-300 hover:text-primary transition-colors duration-200"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="py-8 border-t border-white/10">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Stay Updated with Our Newsletter
              </h3>
              <p className="text-gray-300">
                Get the latest marketing tips and industry insights delivered to your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 NEXUS. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;