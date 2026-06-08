import React, { useState, useEffect, useCallback } from "react";
import { Search, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { NeedCard } from "@/components/freelancer/NeedCard";
import { boardCategories, boardBudgetRanges } from "@/data/mockData";
import { api } from "@/lib/api";

export const FreelancerHomePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeBudget, setActiveBudget] = useState("Any Budget");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch jobs from server with search and skill tag filters
      const skillParam = activeCategory !== "All" ? activeCategory : "";
      const response = await api.get(`/api/jobs?search=${encodeURIComponent(searchQuery)}&skill=${encodeURIComponent(skillParam)}`);
      
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
      } else {
        setError("Failed to fetch opportunities.");
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchQuery]);

  // Fetch jobs on mount and when category changes
  useEffect(() => {
    fetchJobs();
  }, [activeCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const formatPostedAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  // Helper to parse numeric values from budget string for budget range filtering
  const matchesBudget = (budgetStr: string) => {
    if (activeBudget === "Any Budget") return true;
    
    // Clean and extract numbers from budget string
    const numbers = budgetStr.replace(/[$,]/g, "").match(/\d+/g);
    if (!numbers) return true; // fallback
    
    const val = Math.max(...numbers.map(Number)); // take the upper limit of budget
    
    if (activeBudget === "Under $1,000") return val < 1000;
    if (activeBudget === "$1,000 - $5,000") return val >= 1000 && val <= 5000;
    if (activeBudget === "$5,000 - $10,000") return val >= 5000 && val <= 10000;
    if (activeBudget === "$10,000+") return val >= 10000;
    
    return true;
  };

  // Filter jobs by budget client-side
  const filteredJobs = jobs.filter((job) => matchesBudget(job.budget));

  return (
    <div className="pb-16 text-on-surface">
      {/* Hero Search Section */}
      <section className="max-w-7xl mx-auto px-6 pt-8 mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8 text-on-surface animate-[fade-in_0.5s_ease-out]">
          Find projects that <span className="text-primary">ignite your flow.</span>
        </h1>
        <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto animate-[slide-up_0.4s_ease-out]">
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
          <button
            type="submit"
            className="absolute right-3 top-2 bottom-2 px-8 rounded-full bg-gradient-to-tr from-primary to-primary-container text-on-primary font-semibold text-sm active:scale-95 transition-all hover:shadow-lg"
          >
            Search
          </button>
        </form>
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
          <div className="flex items-center gap-3">
            <button
              onClick={fetchJobs}
              className="p-2 text-on-surface-variant hover:text-primary transition-colors"
              title="Refresh job board"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <span className="text-sm font-medium text-on-surface-variant">
              {filteredJobs.length} result{filteredJobs.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 size={40} className="animate-spin text-primary" />
            <p className="text-on-surface-variant text-sm font-semibold">Loading opportunities...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto space-y-4">
            <AlertCircle size={40} className="text-error" />
            <h3 className="text-lg font-bold">Failed to load jobs</h3>
            <p className="text-on-surface-variant text-sm">{error}</p>
            <button
              onClick={fetchJobs}
              className="px-5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-sm font-semibold transition-all"
            >
              Try Again
            </button>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-16 text-center space-y-4">
            <h3 className="text-xl font-bold">No Opportunities Found</h3>
            <p className="text-on-surface-variant text-sm max-w-md mx-auto">
              There are no matching job listings right now. Check back later or try adjusting your search terms and filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map((job, i) => (
              <div
                key={job.id}
                className="animate-[slide-up_0.4s_ease-out]"
                style={{ animationDelay: `${i * 50}ms`, animationFillMode: "both" }}
              >
                <NeedCard
                  title={job.title}
                  company={job.company || job.seeker?.name || "Client"}
                  budget={job.budget}
                  deadline={job.deadline || "TBD"}
                  skills={job.tags ? job.tags.map((t: any) => t.name) : []}
                  postedAgo={formatPostedAgo(job.createdAt)}
                  proposals={0}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default FreelancerHomePage;
