import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/data/mockData";
import { Moon, Sun, Menu, X, Bell, MessageSquare, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface NavbarProps {
  readonly theme: "light" | "dark";
  readonly onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ theme, onToggleTheme }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  // Close popover on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50",
        "bg-surface-container-lowest/80 dark:bg-surface-container-lowest/80",
        "backdrop-blur-xl shadow-sm",
        "flex justify-between items-center px-6 py-3"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-8">
        <Link to="/" className="text-xl font-black tracking-tight text-on-surface">
          LancedIn
        </Link>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center space-x-4">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            to={link.href}
            className="text-on-surface-variant text-sm font-semibold hover:text-primary transition-colors"
          >
            {link.label}
          </Link>
        ))}

        {/* Notification Bell — always visible */}
        <div ref={bellRef} className="relative">
          <button
            onClick={() => setBellOpen(!bellOpen)}
            className="relative p-2 rounded-xl hover:bg-surface-container-low transition-colors text-on-surface-variant"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {/* Pulse dot */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full animate-pulse" />
          </button>

          {/* Popover */}
          {bellOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-surface-container-lowest dark:bg-surface-container rounded-2xl shadow-[0_16px_48px_rgba(25,28,29,0.12)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.4)] border border-outline-variant/15 overflow-hidden animate-[scale-in_0.2s_ease-out]">
              {/* Header */}
              <div className="px-5 pt-5 pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                    <MessageSquare size={14} className="text-primary" />
                  </div>
                  <h3 className="text-sm font-bold text-on-surface">
                    Start Connecting
                  </h3>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed mt-2">
                  Sign up or log in to message talent, get project updates, and never miss an opportunity.
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-outline-variant/10 mx-5" />

              {/* Actions */}
              <div className="p-4 space-y-2">
                <button
                  onClick={() => {
                    setBellOpen(false);
                    navigate("/messages");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 hover:bg-primary/10 transition-all text-left group"
                >
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <MessageSquare size={16} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-on-surface block">
                      View Messages
                    </span>
                    <span className="text-[10px] text-on-surface-variant">
                      Preview the messaging experience
                    </span>
                  </div>
                  <ArrowRight size={14} className="text-on-surface-variant group-hover:text-primary transition-colors" />
                </button>

                <button
                  onClick={() => {
                    setBellOpen(false);
                    navigate("/");
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-tr from-primary to-primary-container text-on-primary font-bold text-sm shadow-md hover:shadow-lg active:scale-[0.98] transition-all"
                >
                  Sign Up / Log In
                </button>
              </div>

              {/* Footer hint */}
              <div className="px-5 pb-4 pt-1">
                <p className="text-[10px] text-on-surface-variant/60 text-center">
                  Join 50,000+ professionals on LancedIn
                </p>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl hover:bg-surface-container-low transition-colors text-on-surface-variant"
          aria-label="Toggle theme"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {loading ? (
          <div className="w-20 h-8 bg-surface-container animate-pulse rounded-lg" />
        ) : user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-on-surface">{user.name}</span>
            <button
              onClick={logout}
              className="text-xs font-semibold text-on-surface-variant hover:text-error transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <Button variant="primary" size="sm" onClick={handleGoogleLogin}>
            Login
          </Button>
        )}
      </div>

      {/* Mobile — bell + theme + hamburger */}
      <div className="flex md:hidden items-center gap-1">
        {/* Mobile Bell */}
        <div ref={undefined} className="relative">
          <button
            onClick={() => setBellOpen(!bellOpen)}
            className="relative p-2 rounded-xl hover:bg-surface-container-low transition-colors text-on-surface-variant"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full animate-pulse" />
          </button>

          {/* Mobile Popover — same content, positioned differently */}
          {bellOpen && (
            <div className="fixed left-4 right-4 top-16 bg-surface-container-lowest dark:bg-surface-container rounded-2xl shadow-[0_16px_48px_rgba(25,28,29,0.15)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.5)] border border-outline-variant/15 overflow-hidden animate-[scale-in_0.2s_ease-out] z-[60]">
              <div className="px-5 pt-5 pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                    <MessageSquare size={14} className="text-primary" />
                  </div>
                  <h3 className="text-sm font-bold text-on-surface">Start Connecting</h3>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed mt-2">
                  Sign up or log in to message talent, get project updates, and never miss an opportunity.
                </p>
              </div>
              <div className="h-px bg-outline-variant/10 mx-5" />
              <div className="p-4 space-y-2">
                <button
                  onClick={() => { setBellOpen(false); navigate("/messages"); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 hover:bg-primary/10 transition-all text-left group"
                >
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MessageSquare size={16} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-on-surface block">View Messages</span>
                    <span className="text-[10px] text-on-surface-variant">Preview the messaging experience</span>
                  </div>
                  <ArrowRight size={14} className="text-on-surface-variant" />
                </button>
                <button
                  onClick={() => { setBellOpen(false); navigate("/"); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-tr from-primary to-primary-container text-on-primary font-bold text-sm shadow-md active:scale-[0.98] transition-all"
                >
                  Sign Up / Log In
                </button>
              </div>
              <div className="px-5 pb-4 pt-1">
                <p className="text-[10px] text-on-surface-variant/60 text-center">
                  Join 50,000+ professionals on LancedIn
                </p>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl hover:bg-surface-container-low transition-colors text-on-surface-variant"
          aria-label="Toggle theme"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl hover:bg-surface-container-low transition-colors text-on-surface"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-surface-container-lowest dark:bg-surface-container-lowest border-t border-outline-variant/10 p-6 flex flex-col gap-4 md:hidden animate-[slide-up_0.3s_ease-out]">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-on-surface-variant text-sm font-semibold hover:text-primary transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/messages"
            className="text-on-surface-variant text-sm font-semibold hover:text-primary transition-colors flex items-center gap-2"
            onClick={() => setMobileOpen(false)}
          >
            <MessageSquare size={16} />
            Messages
          </Link>
          <Button variant="primary" size="md" className="w-full" onClick={handleGoogleLogin}>
            Login
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
