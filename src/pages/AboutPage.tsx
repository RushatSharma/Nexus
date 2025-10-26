import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, Lightbulb, Users, ShieldCheck, ArrowRight, TrendingUp, UsersRound, Award, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils"; // Import cn utility

// Import local assets
import teamMember1 from "@/assets/hero-woman.jpg";
import Avatar1 from "@/assets/Avatar1.webp";
import Avatar2 from "@/assets/Avatar2.webp";
import Avatar3 from "@/assets/Avatar3.webp";
import Avatar4 from "@/assets/Avatar4.webp";
import Avatar5 from "@/assets/Avatar5.webp";
import Avatar6 from "@/assets/Avatar6.webp";
import Avatar7 from "@/assets/Avatar7.webp";
import Image1 from "@/assets/Image1.webp";
import Image2 from "@/assets/Image2.webp";

import logoSymbol from "@/assets/LogoAbout.webp";
import logoWhite from "@/assets/LogoWhite.webp";
import contactIllustration from "@/assets/contact-illustration.webp";


const AboutPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const teamMembers = [
    { name: "Jane Doe", role: "Founder & CEO", avatar: teamMember1 },
    { name: "John Smith", role: "Head of Marketing", avatar: Avatar1 },
    { name: "Michael Johnson", role: "Creative Director", avatar: Avatar2 },
    { name: "Sarah Williams", role: "Lead SEO Strategist", avatar: Avatar3 },
    { name: "David Brown", role: "PPC Specialist", avatar: Avatar4 },
    { name: "Emily Taylor", role: "Social Media Manager", avatar: Avatar5 },
    { name: "Mark Wilson", role: "Data Analyst", avatar: Avatar6 },
    { name: "Jennifer Lee", role: "Content Creator", avatar: Avatar7 },
  ];

  const values = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      title: "Integrity",
      description: "We believe in honesty, transparency, and ethical practices in every aspect of our work. Your trust is the foundation of our partnership.",
    },
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "Excellence",
      description: "We are committed to delivering exceptional quality in all our projects. From concept to completion, we strive for perfection in every detail.",
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Collaboration",
      description: "We foster open communication and mutual respect, both internally and with our clients. Your vision is our shared goal.",
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-primary" />,
      title: "Innovation",
      description: "We embrace creativity to stay at the forefront of the industry. We constantly explore new technologies to deliver innovative solutions.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* --- Hero Section --- */}
        <section className="pt-10 lg:pt-2 pb-20 lg:pb-24 bg-background">
          <div className="container-custom flex flex-col items-center text-center">

            <img
              src={isDarkMode ? logoWhite : logoSymbol}
              alt="Nexus Logo Symbol"
              className="w-[150px] h-[150px] mb-0 animate-spin-slow"
            />

            <h3 className="text-primary font-semibold uppercase tracking-wider">About Us</h3>
            <h1 className="mt-4 max-w-4xl text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              Connecting Brands to People with Data and Creativity
            </h1>

            <p className="mt-6 max-w-2xl text-xl font-medium text-muted-foreground">
              We're not just a marketing agency we are your growth partner, dedicated to forging powerful connections that last.
            </p>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Nexus is a collective of creators, strategists, and innovators passionate about creating real-world impact for brands. We don't just market; we build legacies.
            </p>

            <div className="w-full max-w-4xl border-t border-border pt-10 mt-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="text-center">
                        <UsersRound className="w-8 h-8 mx-auto text-primary mb-2"/>
                        <p className="text-4xl font-bold text-primary">15+</p>
                        <p className="mt-1 text-muted-foreground">Happy Clients</p>
                    </div>
                    <div className="text-center">
                        <Megaphone className="w-8 h-8 mx-auto text-primary mb-2"/>
                        <p className="text-4xl font-bold text-primary">30+</p>
                        <p className="mt-1 text-muted-foreground">Projects Done</p>
                    </div>
                    <div className="text-center">
                        <TrendingUp className="w-8 h-8 mx-auto text-primary mb-2"/>
                        <p className="text-4xl font-bold text-primary">50k+</p>
                        <p className="mt-1 text-muted-foreground">Impressions</p>
                    </div>
                    <div className="text-center">
                        <Award className="w-8 h-8 mx-auto text-primary mb-2"/>
                        <p className="text-4xl font-bold text-primary">2+</p>
                        <p className="mt-1 text-muted-foreground">Awards Won</p>
                    </div>
                </div>
            </div>
          </div>
        </section>

        {/* --- Journey Section --- */}
        <section className="py-15 bg-background">
          <div className="container-custom space-y-16">
            <div className="text-center max-w-3xl mx-auto">
              <h3 className="text-primary font-semibold">Our Journey</h3>
              <h2 className="mt-2 text-3xl lg:text-4xl font-bold text-foreground">The Nexus Story</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                 Since our inception, Nexus has navigated a significant evolutionary path, consistently adapting to the ever-changing digital marketing landscape. This journey has honed our ability to overcome complex challenges and solidified our position as a dynamic, forward-thinking agency adept at driving client growth.
              </p>
            </div>
            {/* Story Block 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
               {/* --- UPDATED IMAGE TAG --- */}
              <img
                src={Image1}
                alt="Inception"
                className="rounded-2xl shadow-lg w-full max-w-lg mx-auto" 
               />
              <div>
                <h3 className="text-2xl font-bold text-foreground">Inception Vision</h3>
                <p className="mt-4 text-lg text-muted-foreground">
                   The foundation of Nexus rests upon this forward-thinking vision: to redefine marketing excellence through a blend of strategic innovation and steadfast integrity. Our founders established a company culture centered on proactive solutions, transparent practices, and an unwavering commitment to fostering successful, long-term client partnerships built on mutual satisfaction.
                </p>
              </div>
            </div>
            {/* Story Block 2 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="md:order-2">
                 {/* --- UPDATED IMAGE TAG --- */}
                <img
                  src={Image2}
                  alt="Evolution"
                  className="rounded-2xl shadow-lg w-full max-w-lg mx-auto" 
                 />
              </div>
              <div className="md:order-1">
                <h3 className="text-2xl font-bold text-foreground">Evolutionary Journey</h3>
                <p className="mt-4 text-lg text-muted-foreground">
                   Since our inception, Nexus has navigated a significant evolutionary path, consistently adapting to the ever-changing digital marketing landscape. This journey has honed our ability to overcome complex challenges and solidified our position as a dynamic, forward-thinking agency adept at driving client growth.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- Team Section --- */}
        <section className="pt-20 pb-15 bg-background text-center lg:pt-15">

          <div className="container-custom">
            <h3 className="text-primary font-semibold">Our Team</h3>
            <h2 className="mt-2 text-3xl lg:text-4xl font-bold text-foreground">Meet Our Dedicated Team</h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
               The success Nexus delivers is a direct result of the collective expertise, unwavering dedication, and collaborative synergy within our talented team. We invite you to meet the passionate professionals who apply strategic insight and technical proficiency to every client engagement, ensuring impactful results.
            </p>
            <div className="mt-12 bg-muted p-8 rounded-3xl shadow-lg">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-8 gap-y-12">
                {teamMembers.map((member, index) => (
                  <div key={index} className="group text-center">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto object-cover shadow-lg transform transition-transform duration-300 group-hover:scale-110"
                    />
                    <h3 className="mt-4 text-lg font-bold text-foreground">{member.name}</h3>
                    <p className="text-primary">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- Values Section --- */}
        <section className="pt-20 pb-15 bg-background">
            <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto">
              <h3 className="text-primary font-semibold">Our Mission and Values</h3>
              <h2 className="mt-2 text-3xl lg:text-4xl font-bold text-foreground">Crafting Excellence in Digital Marketing</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Our mission is to redefine excellence by delivering innovative, sustainable, and high-quality solutions that exceed our clients' expectations.
              </p>
            </div>
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value) => (
                <div key={value.title} className="bg-muted p-8 rounded-2xl shadow-lg">
                  <div className="flex-shrink-0">{value.icon}</div>
                  <h3 className="mt-6 text-xl font-bold text-foreground">{value.title}</h3>
                  <p className="mt-2 text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
            </div>
        </section>

         {/* --- CTA Section: FULLY RESPONSIVE --- */}
        <section className="py-16">
            <div className="container-custom">
                <div className="relative rounded-3xl p-8 md:p-12 lg:p-10 overflow-hidden bg-primary">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative z-10 text-white text-center md:text-left">
                            <h2 className="text-3xl md:text-4xl font-bold">Empowering Your Vision: Request a Quote</h2>
                            <p className="mt-4 text-lg">
                            Ready to bring your vision to life? Requesting a quote from Nexus is the first step towards turning your dreams into reality. Whether you're launching a new brand, aiming to increase your market reach, or looking to optimize your digital presence, our team of experts is standing by to provide you with a personalized estimate tailored to your project's needs. Let's build something amazing together.
                            </p>
                            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <Link to="/contact">
                                    <Button size="lg" className="bg-background text-foreground hover:bg-background/90">
                                        Request Quote <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="relative mt-8 md:mt-0 flex justify-center md:justify-end">
                            <img
                                src={contactIllustration}
                                alt="Empowering your vision"
                                className="w-full max-w-xs sm:max-w-sm md:max-w-md object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;