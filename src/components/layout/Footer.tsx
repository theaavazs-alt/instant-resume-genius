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
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={logo} alt="ResumeGenius Logo" className="w-10 h-10 rounded-xl" />
              <span className="text-xl font-bold">
                Resume<span className="text-accent">Genius</span>
              </span>
            </Link>
            <p className="text-primary-foreground/70 max-w-sm mb-6">
              Create stunning, ATS-optimized resumes in minutes. No signup required. 
              Your data stays private — nothing is stored.
            </p>
            <div className="flex flex-col gap-2">
              <p className="text-primary-foreground/80 text-sm font-medium">
                Made by Shivam Choudhury
              </p>
              <a 
                href="https://wa.me/919330249895" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-accent transition-colors text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp: 9330249895
              </a>
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3 className="font-semibold mb-4">Tools</h3>
            <ul className="space-y-3">
              {footerLinks.tools.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} ResumeGenius. Made by Shivam Choudhury.
          </p>
          <p className="text-primary-foreground/60 text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            No data stored • 100% Private
          </p>
        </div>
      </div>
    </footer>
  );
};
