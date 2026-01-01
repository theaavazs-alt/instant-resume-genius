import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const navItems = [
  { label: "Resume Generator", href: "/generator" },
  { label: "Resume Analyzer", href: "/analyzer" },
  { label: "Photo Generator", href: "/photo" },
  { label: "Cover Letter", href: "/cover-letter" },
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="container flex items-center justify-between h-14 sm:h-16 md:h-20 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-1.5 sm:gap-2 group">
          <img src={logo} alt="ResumeGenius Logo" className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl" />
          <span className="text-lg sm:text-xl font-bold text-foreground">
            Resume<span className="text-accent">Genius</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === item.href
                  ? "bg-accent/10 text-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Button variant="accent" size="sm">
            Get Started Free
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-strong border-t border-border"
          >
            <nav className="container py-4 flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === item.href
                      ? "bg-accent/10 text-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-border mt-2">
                <Button variant="accent" className="w-full">
                  Get Started Free
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
