import React, { useState } from "react";
import { Search } from "lucide-react";
import { NeedCard } from "@/components/freelancer/NeedCard";
import { needsFeed, boardCategories, boardBudgetRanges } from "@/data/mockData";

export const FreelancerHomePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeBudget, setActiveBudget] = useState("Any Budget");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="pb-16">
      {/* Hero Search Section */}
      <section className="max-w-7xl mx-auto px-6 pt-8 mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8 text-on-surface animate-[fade-in_0.5s_ease-out]">
          Find projects that{" "}
          <span className="text-primary">ignite your flow.</span>
        </h1>
        <div className="relative max-w-2xl mx-auto animate-[slide-up_0.4s_ease-out]">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-on-surface-variant">
            <Search size={20} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by keyword, skill, or company..."
            className="w-full pl-14 pr-32 py-5 bg-surface-container-highest dark:bg-surface-container-high rounded-full border-none focus:ring-2 focus:ring-primary/20 focus:outline-none text-lg placeholder:text-on-surface-variant/60 shadow-sm text-on-surface"
          />
          <button className="absolute right-3 top-2 bottom-2 px-8 rounded-full bg-gradient-to-tr from-primary to-primary-container text-on-primary font-semibold text-sm active:scale-95 transition-all hover:shadow-lg">
            Search
          </button>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center animate-[fade-in_0.6s_ease-out]">
          <div className="flex flex-wrap justify-center gap-2">
            {boardCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === category
                    ? "bg-primary text-on-primary shadow-md"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="h-8 w-px bg-outline-variant/30 hidden md:block"></div>
          <div className="flex flex-wrap justify-center gap-2">
            {boardBudgetRanges.map((budget) => (
              <button
                key={budget}
                onClick={() => setActiveBudget(budget)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeBudget === budget
                    ? "bg-tertiary text-on-tertiary shadow-md"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {budget}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Needs Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-6 animate-[fade-in_0.7s_ease-out]">
          <h2 className="text-2xl font-extrabold text-on-surface">Latest Opportunities</h2>
          <span className="text-sm font-medium text-on-surface-variant">{needsFeed.length} results</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
          {needsFeed.map((need, i) => (
            <div
              key={need.id}
              className="animate-[slide-up_0.4s_ease-out]"
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: "both" }}
            >
              <NeedCard
                title={need.title}
                company={need.company}
                budget={need.budget}
                deadline={need.deadline}
                skills={need.skills}
                postedAgo={need.postedAgo}
                proposals={need.proposals}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default FreelancerHomePage;
