import React, { useState } from "react";
import { Search } from "lucide-react";
import { TalentCard } from "@/components/client/TalentCard";
import { CuratedNetworkCTA } from "@/components/client/CuratedNetworkCTA";
import { featuredFreelancers, talentCategories } from "@/data/mockData";

export const ClientHomePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All Talents");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="pb-16">
      {/* Hero Search Section */}
      <section className="max-w-7xl mx-auto px-6 pt-8 mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8 text-on-surface animate-[fade-in_0.5s_ease-out]">
          Discover your next{" "}
          <span className="text-primary">creative partner.</span>
        </h1>
        <div className="relative max-w-2xl mx-auto animate-[slide-up_0.4s_ease-out]">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-on-surface-variant">
            <Search size={20} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find a skill, talent, or creator..."
            className="w-full pl-14 pr-32 py-5 bg-surface-container-highest dark:bg-surface-container-high rounded-full border-none focus:ring-2 focus:ring-primary/20 focus:outline-none text-lg placeholder:text-on-surface-variant/60 shadow-sm text-on-surface"
          />
          <button className="absolute right-3 top-2 bottom-2 px-8 rounded-full bg-gradient-to-tr from-primary to-primary-container text-on-primary font-semibold text-sm active:scale-95 transition-all hover:shadow-lg">
            Search
          </button>
        </div>
      </section>

      {/* Category Filters */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex flex-wrap justify-center gap-3 animate-[fade-in_0.6s_ease-out]">
          {talentCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === category
                  ? "bg-primary text-on-primary shadow-md"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Talent Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {featuredFreelancers.map((freelancer, i) => (
            <div
              key={freelancer.id}
              className="animate-[slide-up_0.4s_ease-out]"
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: "both" }}
            >
              <TalentCard
                name={freelancer.name}
                role={freelancer.role}
                avatar={freelancer.avatar}
                rating={freelancer.rating}
                hourlyRate={freelancer.hourlyRate}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Curated Network CTA */}
      <CuratedNetworkCTA />
    </div>
  );
};

export default ClientHomePage;
