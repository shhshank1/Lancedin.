import React from "react";
import { Link } from "react-router-dom";
import { footerLinks } from "@/data/mockData";
import { Globe, Share2 } from "lucide-react";

interface FooterProps {
  readonly className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  return (
    <footer
      className={`bg-surface-container-lowest dark:bg-surface-container-lowest w-full py-8 border-t border-outline-variant/10 ${className}`}
    >
      <div className="flex flex-col md:flex-row justify-between items-center px-6 lg:px-12 max-w-7xl mx-auto space-y-4 md:space-y-0">
        <p className="text-xs uppercase tracking-widest font-medium text-on-surface-variant/60">
          © 2026 LancedIn
        </p>
        <div className="flex space-x-8">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-xs uppercase tracking-widest text-on-surface-variant/60 hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          <Globe
            size={16}
            className="text-on-surface-variant/40 hover:text-primary cursor-pointer transition-colors"
          />
          <Share2
            size={16}
            className="text-on-surface-variant/40 hover:text-primary cursor-pointer transition-colors"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
