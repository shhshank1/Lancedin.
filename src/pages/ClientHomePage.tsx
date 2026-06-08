import React, { useState, useEffect, useCallback } from "react";
import { Search, Users, Loader2, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TalentCard } from "@/components/client/TalentCard";
import { CuratedNetworkCTA } from "@/components/client/CuratedNetworkCTA";
import { api } from "@/lib/api";

// Shape of data returned by GET /api/talents
interface Talent {
  id: string;
  name: string;
  title: string | null;
  avatar: string | null;
  location: string | null;
  hourlyRate: number | null;
  bio: string | null;
  skills: { id: string; name: string }[];
  _count: { projects: number };
}

export const ClientHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [activeSkill, setActiveSkill] = useState("All");
  const [allSkills, setAllSkills] = useState<string[]>(["All"]);

  // Fetch talents from real API
  const fetchTalents = useCallback(async (search: string, skill: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (skill && skill !== "All") params.set("skill", skill);

      const res = await api.get(`/api/talents?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch talents");

      const data = await res.json();
      setTalents(data.talents);
    } catch (err) {
      setError("Could not load talent. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // On mount — load all talents and collect unique skill tags for filter pills
  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/talents");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setTalents(data.talents);

        // Build unique skill list from all returned talents
        const skillSet = new Set<string>();
        data.talents.forEach((t: Talent) =>
          t.skills.forEach((s) => skillSet.add(s.name))
        );
        setAllSkills(["All", ...Array.from(skillSet).sort()]);
      } catch {
        setError("Could not load talent. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadInitial();
  }, []);

  // Re-fetch when skill filter changes
  useEffect(() => {
    fetchTalents(searchQuery, activeSkill);
  }, [activeSkill]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    fetchTalents(searchInput, activeSkill);
  };

  // Message button — create a conversation and navigate to messages
  const handleMessage = async (talentId: string) => {
    try {
      const res = await api.post("/api/conversations", { recipientId: talentId });
      if (res.ok) {
        navigate("/messages");
      }
    } catch (err) {
      console.error("Failed to start conversation:", err);
    }
  };

  return (
    <div className="pb-16">
      {/* Hero Search Section */}
      <section className="max-w-7xl mx-auto px-6 pt-8 mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 text-on-surface animate-[fade-in_0.5s_ease-out]">
          Discover your next{" "}
          <span className="text-primary">creative partner.</span>
        </h1>
        <p className="text-on-surface-variant mb-8 text-lg animate-[fade-in_0.6s_ease-out]">
          Browse real talent — all profiles are from verified members.
        </p>
        <form
          onSubmit={handleSearch}
          className="relative max-w-2xl mx-auto animate-[slide-up_0.4s_ease-out]"
        >
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-on-surface-variant">
            <Search size={20} />
          </div>
          <input
            id="talent-search-input"
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name, title, or skill..."
            className="w-full pl-14 pr-32 py-5 bg-surface-container-highest dark:bg-surface-container-high rounded-full border-none focus:ring-2 focus:ring-primary/20 focus:outline-none text-lg placeholder:text-on-surface-variant/60 shadow-sm text-on-surface"
          />
          <button
            id="talent-search-button"
            type="submit"
            className="absolute right-3 top-2 bottom-2 px-8 rounded-full bg-gradient-to-tr from-primary to-primary-container text-on-primary font-semibold text-sm active:scale-95 transition-all hover:shadow-lg"
          >
            Search
          </button>
        </form>
      </section>

      {/* Skill Filter Pills */}
      <section className="max-w-7xl mx-auto px-6 mb-10">
        <div className="flex flex-wrap justify-center gap-2.5 animate-[fade-in_0.6s_ease-out]">
          {allSkills.map((skill) => (
            <button
              key={skill}
              id={`skill-filter-${skill.replace(/\s+/g, "-").toLowerCase()}`}
              onClick={() => setActiveSkill(skill)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeSkill === skill
                  ? "bg-primary text-on-primary shadow-md"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </section>

      {/* Results Header */}
      <section className="max-w-7xl mx-auto px-6 mb-6 flex items-center justify-between animate-[fade-in_0.7s_ease-out]">
        <div className="flex items-center gap-2 text-on-surface-variant">
          <Users size={16} />
          <span className="text-sm font-medium">
            {loading ? "Loading..." : `${talents.length} talent${talents.length !== 1 ? "s" : ""} found`}
          </span>
        </div>
        {searchQuery && (
          <button
            onClick={() => {
              setSearchInput("");
              setSearchQuery("");
              fetchTalents("", activeSkill);
            }}
            className="flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            <RefreshCw size={13} />
            Clear search
          </button>
        )}
      </section>

      {/* Talent Grid */}
      <section className="max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-on-surface-variant">
            <Loader2 size={36} className="animate-spin text-primary" />
            <p className="text-sm">Finding the best talent for you...</p>
          </div>
        ) : error ? (
          <div className="text-center py-24">
            <p className="text-error text-lg font-medium mb-4">{error}</p>
            <button
              onClick={() => fetchTalents(searchQuery, activeSkill)}
              className="px-6 py-3 bg-primary text-on-primary rounded-full font-semibold hover:opacity-90 transition"
            >
              Try Again
            </button>
          </div>
        ) : talents.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-on-surface mb-2">No talent found</h3>
            <p className="text-on-surface-variant text-sm">
              {searchQuery
                ? `No results for "${searchQuery}". Try a different search.`
                : "No talent has joined yet. Check back soon!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {talents.map((talent, i) => (
              <div
                key={talent.id}
                className="animate-[slide-up_0.4s_ease-out]"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
              >
                <TalentCard
                  id={talent.id}
                  name={talent.name ?? "Anonymous"}
                  title={talent.title}
                  avatar={talent.avatar}
                  location={talent.location}
                  hourlyRate={talent.hourlyRate}
                  skills={talent.skills}
                  projectCount={talent._count.projects}
                  onMessage={handleMessage}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <CuratedNetworkCTA />
    </div>
  );
};

export default ClientHomePage;
