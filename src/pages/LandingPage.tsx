import React from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { TalentPaths } from "@/components/landing/TalentPaths";
import { SignupForm } from "@/components/landing/SignupForm";
import { SocialProofSection } from "@/components/landing/SocialProofSection";

interface LandingPageProps {
  readonly className?: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({ className = "" }) => {
  return (
    <div className={className}>
      {/* Hero Section with Form */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start py-12 lg:py-24">
        <div className="lg:col-span-7 space-y-8">
          <HeroSection />
          <TalentPaths />
        </div>
        <div className="lg:col-span-5">
          <SignupForm />
        </div>
      </section>

      {/* Social Proof / Gallery Section */}
      <div className="border-t border-outline-variant/10">
        <SocialProofSection />
      </div>
    </div>
  );
};

export default LandingPage;
