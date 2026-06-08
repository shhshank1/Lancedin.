import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Briefcase, PenTool, Plus, X } from "lucide-react";

export const OnboardingPage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"SEEKER" | "TALENT" | null>(null);
  
  // Profile state
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const popularSkills = [
    "UI/UX Design",
    "Frontend Dev",
    "Backend Dev",
    "Motion Graphics",
    "Video Editor",
    "3D Artist",
    "Copywriter",
    "TypeScript",
    "React",
    "Node.js",
  ];

  const handleRoleSelect = (selectedRole: "SEEKER" | "TALENT") => {
    setRole(selectedRole);
    setStep(2);
  };

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
    if (!role) return;

    setSubmitting(true);
    setError("");

    const success = await updateProfile({
      role,
      bio,
      title: role === "TALENT" ? title : undefined,
      location,
      hourlyRate: role === "TALENT" ? Number(hourlyRate) || undefined : undefined,
      skills: role === "TALENT" ? skills : undefined,
    });

    setSubmitting(false);

    if (success) {
      if (role === "SEEKER") {
        navigate("/client");
      } else {
        navigate("/freelancer");
      }
    } else {
      setError("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-12 bg-surface">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="w-full bg-surface-container-high h-1 rounded-full mb-8 overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-300"
            style={{ width: `${(step / 2) * 100}%` }}
          />
        </div>

        {step === 1 ? (
          <div className="text-center space-y-8 animate-[fade-in_0.3s_ease-out]">
            <div className="space-y-3">
              <h1 className="text-4xl font-black tracking-tight text-on-surface">
                Welcome, {user?.name || "there"}!
              </h1>
              <p className="text-on-surface-variant text-lg max-w-md mx-auto">
                Let's customize your LancedIn experience. How do you plan to use the platform?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <Card
                variant="elevated"
                hover
                onClick={() => handleRoleSelect("SEEKER")}
                className="p-8 border border-outline-variant/10 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary/30"
              >
                <div className="p-4 bg-primary/10 rounded-2xl mb-4 group-hover:bg-primary/20 transition-colors">
                  <Briefcase size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-on-surface">I Need Talent</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  I want to discover, hire, and message elite freelancers for high-impact projects.
                </p>
              </Card>

              <Card
                variant="elevated"
                hover
                onClick={() => handleRoleSelect("TALENT")}
                className="p-8 border border-outline-variant/10 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary/30"
              >
                <div className="p-4 bg-primary/10 rounded-2xl mb-4 group-hover:bg-primary/20 transition-colors">
                  <PenTool size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-on-surface">I Have Talent</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  I am a freelancer/creator looking to showcase projects and find premium clients.
                </p>
              </Card>
            </div>
          </div>
        ) : (
          <Card
            variant="elevated"
            className="p-8 md:p-10 border border-outline-variant/10 space-y-8 animate-[slide-up_0.4s_ease-out]"
          >
            <div>
              <button
                onClick={() => setStep(1)}
                className="text-xs font-bold uppercase tracking-wider text-on-surface-variant hover:text-primary mb-4 transition-colors"
              >
                ← Back
              </button>
              <h2 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">
                Set up your profile
              </h2>
              <p className="text-on-surface-variant text-sm">
                {role === "SEEKER"
                  ? "Help creators learn who is hiring."
                  : "Let clients discover your unique set of skills and background."}
              </p>
            </div>

            {error && (
              <div className="p-4 bg-error/10 border border-error/20 text-error rounded-xl text-sm font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {role === "TALENT" && (
                <>
                  <Input
                    id="title"
                    label="Professional Title"
                    placeholder="e.g. Senior Product Designer, Motion Director"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      id="location"
                      label="Location"
                      placeholder="e.g. San Francisco, CA (or Remote)"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                    <Input
                      id="rate"
                      label="Hourly Rate ($ USD)"
                      placeholder="e.g. 85"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value.replace(/\D/g, ""))}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
                      Skills & Expertise
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

                    {/* Skill Tags List */}
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
                        {popularSkills
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
                </>
              )}

              {role === "SEEKER" && (
                <Input
                  id="location"
                  label="Company / Personal Location"
                  placeholder="e.g. New York, NY (or Remote)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              )}

              <div className="space-y-2">
                <label
                  htmlFor="bio"
                  className="block text-[10px] uppercase tracking-widest font-bold text-on-surface-variant"
                >
                  Bio / Description
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  placeholder={
                    role === "SEEKER"
                      ? "Describe your company, the types of projects you build, and what you look for in partners..."
                      : "Briefly explain your design/dev style, background, and what kinds of collaboration you thrive in..."
                  }
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-highest dark:bg-surface-container-high rounded-xl border-none focus:ring-2 focus:ring-primary/20 focus:outline-none text-on-surface placeholder:text-on-surface-variant/50 transition-all resize-none"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={submitting}
              >
                {submitting ? "Saving Profile..." : "Complete Setup & Enter Platform"}
              </Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
