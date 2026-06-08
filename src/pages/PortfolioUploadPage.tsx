import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, X, ArrowLeft } from "lucide-react";

export const PortfolioUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const suggestedTags = ["React", "TypeScript", "Node.js", "UI/UX Design", "Motion Graphics", "3D Modeling", "Branding"];

  const handleAddSkill = (skill: string) => {
    const clean = skill.trim();
    if (clean && !skills.includes(clean)) {
      setSkills([...skills, clean]);
    }
    setSkillInput("");
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      setError("Project title is required.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          mediaUrl,
          tags: skills,
        }),
        credentials: "include",
      });

      if (response.ok) {
        navigate("/profile");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to create project.");
      }
    } catch (err) {
      console.error("Failed to upload project", err);
      setError("An error occurred while uploading. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-12 bg-surface">
      <div className="w-full max-w-2xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <Card
          variant="elevated"
          className="p-8 md:p-10 border border-outline-variant/10 space-y-8 animate-[slide-up_0.4s_ease-out]"
        >
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">
              Upload your project
            </h2>
            <p className="text-on-surface-variant text-sm">
              Showcase your work to the LancedIn network. Explain what you built and how.
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
              label="Project Title"
              placeholder="e.g. Atelier E-commerce Redesign"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block text-[10px] uppercase tracking-widest font-bold text-on-surface-variant"
              >
                Project Description
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder="Detail the stack used, your creative process, the design decisions, and what problem you solved..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-surface-container-highest dark:bg-surface-container-high rounded-xl border-none focus:ring-2 focus:ring-primary/20 focus:outline-none text-on-surface placeholder:text-on-surface-variant/50 transition-all resize-none"
              />
            </div>

            <Input
              id="mediaUrl"
              label="Media Image URL"
              placeholder="e.g. https://images.unsplash.com/photo-..."
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
            />

            {mediaUrl && (
              <div className="relative rounded-xl overflow-hidden border border-outline-variant/10 bg-surface-container h-48 flex items-center justify-center">
                <img
                  src={mediaUrl}
                  alt="Project Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
                Project Tags / Tech Stack
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a tag and press Enter or click Add"
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

              {/* Tag List */}
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

              {/* Suggestions */}
              <div className="pt-3">
                <span className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant block mb-2">
                  Suggested Tags
                </span>
                <div className="flex flex-wrap gap-2">
                  {suggestedTags
                    .filter((t) => !skills.includes(t))
                    .map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleAddSkill(tag)}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-all border border-outline-variant/10"
                      >
                        + {tag}
                      </button>
                    ))}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={submitting}
            >
              {submitting ? "Uploading Project..." : "Publish Project"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default PortfolioUploadPage;
