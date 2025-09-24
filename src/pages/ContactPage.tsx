import  Footer  from "@/components/Footer";
import Header from "@/components/Header";
import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AuroraTextEffect } from "@/components/AuroraTextEffect";

export function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header isContactPage={true} /> {/* Pass the prop here */}
      <main className="flex-grow container mx-auto px-4 py-10 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Text Content Column */}
          <div className="text-left">
            <AuroraTextEffect
              text="Let's Talk Business"
              fontSize="clamp(2.5rem, 6vw, 4rem)"
              className="justify-start p-0 m-0"
              textClassName="-ml-1"
            />
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-6 mb-6">
              Have a project in mind, or just want to explore possibilities?
              We're here to help you navigate the digital landscape and achieve
              your goals.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Whether you're looking to boost your brand's visibility, drive
              more traffic, or increase conversions, our team is ready to
              build a strategy that works for you. Let's discuss your:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Business Objectives & Goals</li>
                <li>Target Audience & Market</li>
                <li>Current Marketing Challenges</li>
              </ul>
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 text-primary p-2 rounded-full">
                  <Phone className="w-5 h-5" />
                </div>
                <a
                  href="tel:+1234567890"
                  className="text-lg text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  +1 (234) 567-890
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 text-primary p-2 rounded-full">
                  <Mail className="w-5 h-5" />
                </div>
                <a
                  href="mailto:hello@boosttip.com"
                  className="text-lg text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  hello@boosttip.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 text-primary p-2 rounded-full">
                  <MapPin className="w-5 h-5" />
                </div>
                <p className="text-lg text-gray-700 dark:text-gray-200">
                  123 Marketing St, Digital City
                </p>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div>
            <Card className="border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Get a Free Quote</CardTitle>
                <CardDescription className="text-base">
                  Fill out the form and our team will be in touch shortly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="full-name" className="text-base">Full Name</Label>
                      <Input id="full-name" placeholder="Enter your full name" className="text-base p-3" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="company-name" className="text-base">Company Name</Label>
                      <Input id="company-name" placeholder="Enter your company name" className="text-base p-3" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email" className="text-base">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        className="text-base p-3"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone" className="text-base">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 234 567 890"
                        className="text-base p-3"
                      />
                    </div>
                    <div className="sm:col-span-2 grid gap-2">
                      <Label htmlFor="services" className="text-base">Services Interested In</Label>
                      <Select>
                        <SelectTrigger id="services" className="text-base p-3">
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="seo" className="text-base">SEO</SelectItem>
                          <SelectItem value="social-media" className="text-base">
                            Social Media Marketing
                          </SelectItem>
                          <SelectItem value="content-marketing" className="text-base">
                            Content Marketing
                          </SelectItem>
                          <SelectItem value="ppc" className="text-base">PPC Advertising</SelectItem>
                          <SelectItem value="web-development" className="text-base">
                            Web Development
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="sm:col-span-2 grid gap-2">
                      <Label htmlFor="message" className="text-base">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us about your project goals"
                        className="text-base p-3"
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="btn-primary text-base px-6 py-3">Send Message</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}