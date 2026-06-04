import React from "react";
import { Card } from "@/components/ui/card";
import { testimonialData, galleryImage, socialProofData } from "@/data/mockData";
import { Quote, Star } from "lucide-react";

interface SocialProofSectionProps {
  readonly className?: string;
}

export const SocialProofSection: React.FC<SocialProofSectionProps> = ({
  className = "",
}) => {
  return (
    <section className={`max-w-7xl mx-auto px-6 py-16 lg:py-24 ${className}`}>
      {/* Trust Line */}
      <div className="mb-12">
        <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-4">
          {socialProofData.trustLine}
        </p>
        <div className="flex flex-wrap gap-8 opacity-40 grayscale">
          {socialProofData.brandLogos.map((brand) => (
            <div
              key={brand}
              className="h-6 w-24 bg-on-surface-variant/20 rounded-sm"
              title={brand}
            />
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Large Image */}
        <div className="md:col-span-2 relative h-[350px] md:h-[500px] rounded-xl overflow-hidden group">
          <img
            alt={galleryImage.alt}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            src={galleryImage.src}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-8 left-8 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-2 opacity-80">
              {galleryImage.caption}
            </p>
            <h2 className="text-2xl md:text-3xl font-black leading-tight whitespace-pre-line">
              {galleryImage.headline}
            </h2>
          </div>
        </div>

        {/* Side Cards */}
        <div className="flex flex-col gap-8">
          {/* Testimonial */}
          <Card variant="accent" className="p-8 flex-grow flex flex-col justify-between">
            <Quote className="text-on-primary-container mb-4" size={40} />
            <p className="text-xl font-medium text-on-primary-container italic leading-relaxed">
              {testimonialData.quote}
            </p>
            <div className="flex items-center gap-4 mt-6">
              <div className="w-12 h-12 rounded-full bg-primary-fixed overflow-hidden flex-shrink-0">
                <img
                  alt={testimonialData.author}
                  src={testimonialData.avatarUrl}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-on-primary-container">
                  {testimonialData.author}
                </p>
                <p className="text-xs text-on-primary-container/70">
                  {testimonialData.role}
                </p>
              </div>
            </div>
          </Card>

          {/* Rating Card */}
          <Card className="p-8">
            <div className="flex gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className="text-tertiary fill-tertiary"
                />
              ))}
            </div>
            <p className="text-sm font-bold text-on-surface">
              {testimonialData.rating}/5 Average Rating
            </p>
            <p className="text-xs text-on-surface-variant mt-1">
              Based on {testimonialData.ratingCount} completed flows
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
