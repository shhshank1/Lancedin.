import React from "react";
import { Badge } from "@/components/ui/badge";
import { heroData } from "@/data/mockData";

interface HeroSectionProps {
  readonly className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ className = "" }) => {
  return (
    <div className={`space-y-8 ${className}`}>
      <div>
        <Badge variant="default" className="mb-6">
          {heroData.badge}
        </Badge>
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-on-surface tracking-tighter leading-[0.9] mb-6">
          {heroData.headline}{" "}
          <span className="bg-gradient-to-tr from-primary to-primary-container bg-clip-text text-transparent">
            {heroData.headlineAccent}
          </span>
        </h1>
        <p className="text-lg md:text-xl text-on-surface-variant max-w-xl leading-relaxed">
          {heroData.subtitle}
        </p>
      </div>
    </div>
  );
};

export default HeroSection;
