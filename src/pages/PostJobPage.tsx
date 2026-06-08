import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, X, ShieldAlert, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export const PostJobPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  
  // Skills state
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const suggestedSkills = [
    "UI/UX Design",
    "Frontend Dev",
    "Backend Dev",
    "React",
    "TypeScript",
    "Node.js",
    "Branding",
    "Video Editor",
    "Motion Graphics",
    "SaaS",
    "Next.js",
    "Shopify",
  ];

  const handleAddSkill = (skillToAdd: string) => {
    const cleanSkill = skillToAdd.trim();
    if (cleanSkill && !skills.includes(cleanSkill)) {
      setSkills([...skills, cleanSkill]);
    }
    setSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !budget || !description) {
      setError("Please fill out all required fields (Title, Budget, and Description).");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await api.post("/api/jobs", {
        title,
        description,
        company: company || undefined,
        location: location || undefined,
        budget,
        deadline: deadline || undefined,
        skills,
      });

      if (response.ok) {
        // Redirect back to client home page
        navigate("/client");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to post job. Please try again.");
      }
    } catch (err) {
      console.error("Error posting job:", err);
      setError("An unexpected network error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  // Enforce seeker role protection
  if (!user || user.role !== "SEEKER") {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center p-6 bg-surface text-on-surface">
        <ShieldAlert size={48} className="text-error mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-on-surface-variant mb-6">Only Clients (Seekers) can post project opportunities.</p>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-12 bg-surface text-on-surface">
      <div className="w-full max-w-2xl">
        <Card
          variant="elevated"
          className="p-8 md:p-10 border border-outline-variant/10 space-y-8 animate-[slide-up_0.4s_ease-out]"
        >
          <div>
            <button
              onClick={() => navigate(-1)}
              className="text-xs font-bold uppercase tracking-wider text-on-surface-variant hover:text-primary mb-4 transition-colors"
            >
              ← Back
            </button>
            <h2 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">
              Post a Project Opportunity
            </h2>
            <p className="text-on-surface-variant text-sm">
              Describe the role requirements, budget, and timeline to match with top freelancers.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-error/10 border border-error/20 text-error rounded-xl text-sm font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="title"
              label="Project Role Title *"
              placeholder="e.g. React Native Developer for Health App"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                id="company"
                label="Company / Client Name"
                placeholder={user.name || "e.g. Synthetix Labs"}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
              <Input
                id="location"
                label="Location"
                placeholder="e.g. Remote, or San Francisco, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                id="budget"
                label="Project Budget *"
                placeholder="e.g. $5,000 - $8,000 or $75/hr"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
              <Input
                id="deadline"
                label="Timeline / Deadline"
                placeholder="e.g. 2 weeks, or Immediate"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block text-[10px] uppercase tracking-widest font-bold text-on-surface-variant"
              >
                Project Description & Requirements *
              </label>
              <textarea
                id="description"
                rows={5}
                required
                placeholder="Detail what tasks need to be completed, required experience, tech stack, and scope of work..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-surface-container-highest dark:bg-surface-container-high rounded-xl border-none focus:ring-2 focus:ring-primary/20 focus:outline-none text-on-surface placeholder:text-on-surface-variant/50 transition-all resize-none"
              />
            </div>

            {/* Skills required */}
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
                Skills Needed
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a skill and press Enter or click Add"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkill(skillInput);
                    }
                  }}
                  className="flex-1 px-4 py-3.5 bg-surface-container-highest dark:bg-surface-container-high rounded-xl border-none focus:ring-2 focus:ring-primary/20 focus:outline-none text-on-surface placeholder:text-on-surface-variant/50"
                />
                <Button
                  type="button"
                  onClick={() => handleAddSkill(skillInput)}
                  variant="secondary"
                  size="md"
                >
                  <Plus size={18} />
                </Button>
              </div>

              {/* Skills Tags */}
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="p-0.5 rounded-full hover:bg-primary/20 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Suggested Skills */}
              <div className="pt-3">
                <span className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant block mb-2">
                  Suggested Skills
                </span>
                <div className="flex flex-wrap gap-2">
                  {suggestedSkills
                    .filter((s) => !skills.includes(s))
                    .map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleAddSkill(skill)}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-all border border-outline-variant/10"
                      >
                        + {skill}
                      </button>
                    ))}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full flex items-center justify-center gap-2"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Posting Role...
                </>
              ) : (
                "Post Project Listing"
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default PostJobPage;
