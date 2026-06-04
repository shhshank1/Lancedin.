import React from "react";
import { curatedNetworkData } from "@/data/mockData";

export const CuratedNetworkCTA: React.FC = () => {
  const { label, headline, description, cta, image, imageAlt } =
    curatedNetworkData;

  return (
    <section className="max-w-7xl mx-auto px-6 mt-24 mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-primary-fixed/30 dark:bg-primary-container/10 rounded-[2rem] p-8 md:p-12">
        {/* Text */}
        <div className="lg:col-span-7 lg:pr-12">
          <span className="text-primary font-bold tracking-widest text-[10px] uppercase mb-4 block">
            {label}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-on-surface leading-tight mb-6">
            {headline}
          </h2>
          <p className="text-on-surface-variant text-lg mb-8 leading-relaxed">
            {description}
          </p>
          <button className="bg-gradient-to-tr from-primary to-primary-container px-10 py-4 rounded-xl text-on-primary font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all hover:shadow-xl">
            {cta}
          </button>
        </div>

        {/* Image */}
        <div className="lg:col-span-5 relative h-64 md:h-80 overflow-hidden rounded-2xl">
          <img
            alt={imageAlt}
            src={image}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default CuratedNetworkCTA;
