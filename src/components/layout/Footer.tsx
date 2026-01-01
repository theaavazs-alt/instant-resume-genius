import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import logo from "@/assets/logo.png";

const footerLinks = {
  tools: [
    { label: "Resume Generator", href: "/generator" },
    { label: "Resume Analyzer", href: "/analyzer" },
    { label: "Photo Generator", href: "/photo" },
    { label: "Cover Letter", href: "/cover-letter" },
  ],
};

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-10 sm:py-12 md:py-16 px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={logo} alt="ResumeGenius Logo" className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl" />
              <span className="text-lg sm:text-xl font-bold">
                Resume<span className="text-accent">Genius</span>
              </span>
            </Link>
            <p className="text-primary-foreground/70 max-w-sm mb-6 text-sm sm:text-base">
              Create stunning, ATS-optimized resumes in minutes. No signup required. 
              Your data stays private — nothing is stored.
            </p>
            <div className="flex flex-col gap-2">
              <p className="text-primary-foreground/80 text-xs sm:text-sm font-medium">
                Made by Shivam Choudhury
              </p>
              <a 
                href="https://wa.me/919330249895" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-accent transition-colors text-xs sm:text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp: 9330249895
              </a>
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Tools</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.tools.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-primary-foreground/60 text-xs sm:text-sm text-center sm:text-left">
            © {new Date().getFullYear()} ResumeGenius. Made by Shivam Choudhury.
          </p>
          <p className="text-primary-foreground/60 text-xs sm:text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            No data stored • 100% Private
          </p>
        </div>
      </div>
    </footer>
  );
};
