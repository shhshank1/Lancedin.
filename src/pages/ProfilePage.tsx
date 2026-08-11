import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  MapPin,
  DollarSign,
  Plus,
  Trash2,
  ShieldAlert,
  Loader2,
  MessageCircle,
  Briefcase,
  ArrowLeft,
} from "lucide-react";
import { api } from "@/lib/api";

interface Project {
  id: string;
  title: string;
  description?: string;
  mediaUrl?: string;
  tags: { id: string; name: string }[];
  createdAt: string;
}

interface PublicUser {
  id: string;
  name: string | null;
  title: string | null;
  avatar: string | null;
  bio: string | null;
  location: string | null;
  hourlyRate: number | null;
  role: string;
  skills: { id: string; name: string }[];
}

// ─── Own Profile (no :id) ─────────────────────────────────────────────────────

const OwnProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    if (!user) return;
    try {
      const response = await api.get(`/api/projects?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects);
      } else {
        setError("Failed to load projects.");
      }
    } catch (err) {
      console.error("Error fetching projects", err);
      setError("An error occurred while loading projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      const response = await api.delete(`/api/projects/${projectId}`);
      if (response.ok) {
        fetchProjects();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete project.");
      }
    } catch (err) {
      console.error("Error deleting project", err);
      alert("Failed to delete project. Please try again.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center p-6 bg-surface">
        <ShieldAlert size={48} className="text-error mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-on-surface-variant mb-6">Please log in to view your profile.</p>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-surface text-on-surface">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Side: Profile Card */}
        <div className="lg:col-span-4 space-y-6">
          <Card variant="elevated" className="p-8 border border-outline-variant/10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary to-primary-container" />

            <div className="flex flex-col items-center pt-4">
              <img
                src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop"}
                alt={`${user.name}'s Avatar`}
                className="w-24 h-24 rounded-full object-cover border-4 border-surface-container mb-4 shadow-sm"
              />
              <h1 className="text-2xl font-black tracking-tight mb-1">{user.name}</h1>
              <p className="text-primary font-bold text-sm mb-4 uppercase tracking-wider">
                {user.role === "TALENT" ? user.title || "Elite Talent" : "Platform Client"}
              </p>

              {user.location && (
                <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mb-2">
                  <MapPin size={14} />
                  <span>{user.location}</span>
                </div>
              )}

              {user.role === "TALENT" && user.hourlyRate !== undefined && (
                <div className="flex items-center gap-1 text-on-surface font-bold text-lg mb-6">
                  <DollarSign size={18} className="text-primary" />
                  <span>{user.hourlyRate}/hr</span>
                </div>
              )}

              {user.bio && (
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6 border-t border-outline-variant/10 pt-4">
                  {user.bio}
                </p>
              )}

              {/* Skills */}
              {user.skills && user.skills.length > 0 && (
                <div className="w-full border-t border-outline-variant/10 pt-4 text-left">
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-3">
                    Expertise
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-full text-xs font-semibold"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                className="w-full mt-6"
                onClick={() => navigate("/onboarding")}
              >
                Edit Profile
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Side: Portfolio Projects */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold tracking-tight">Your Portfolio Projects</h2>
            {user.role === "TALENT" && (
              <Button onClick={() => navigate("/portfolio/upload")} variant="primary" size="sm" className="gap-2">
                <Plus size={16} /> Add Project
              </Button>
            )}
          </div>

          {loading ? (
            <div className="space-y-4">
              <div className="h-32 bg-surface-container animate-pulse rounded-xl" />
              <div className="h-32 bg-surface-container animate-pulse rounded-xl" />
            </div>
          ) : error ? (
            <div className="p-4 bg-error/10 text-error rounded-xl text-sm font-semibold">{error}</div>
          ) : projects.length === 0 ? (
            <Card variant="elevated" className="p-12 border border-outline-variant/10 text-center space-y-4">
              <h3 className="text-xl font-bold">No Projects Uploaded Yet</h3>
              <p className="text-on-surface-variant text-sm max-w-md mx-auto">
                {user.role === "TALENT"
                  ? "Build credibility by uploading screenshots, case studies, or video links of your creative work."
                  : "Seekers can review projects after talent uploads them."}
              </p>
              {user.role === "TALENT" && (
                <Button onClick={() => navigate("/portfolio/upload")} variant="primary">
                  Upload Your First Project
                </Button>
              )}
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  variant="elevated"
                  className="border border-outline-variant/10 overflow-hidden flex flex-col group relative"
                >
                  {project.mediaUrl ? (
                    <div className="h-48 overflow-hidden bg-surface-container relative">
                      <img
                        src={project.mediaUrl}
                        alt={project.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="absolute top-3 right-3 p-2 bg-surface-container-lowest/80 backdrop-blur-sm hover:bg-error/10 hover:text-error rounded-lg shadow-sm transition-all text-on-surface-variant"
                        title="Delete project"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="h-48 bg-surface-container flex items-center justify-center relative">
                      <span className="text-xs text-on-surface-variant">No preview image</span>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="absolute top-3 right-3 p-2 bg-surface-container-lowest/80 backdrop-blur-sm hover:bg-error/10 hover:text-error rounded-lg shadow-sm transition-all text-on-surface-variant"
                        title="Delete project"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{project.title}</h3>
                      {project.description && (
                        <p className="text-on-surface-variant text-xs mt-2 leading-relaxed line-clamp-3">
                          {project.description}
                        </p>
                      )}
                    </div>
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-outline-variant/10">
                        {project.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="px-2.5 py-0.5 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider rounded-full"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Public Profile (with :id — viewing someone else's profile) ───────────────

const PublicProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<PublicUser | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Fetch the public profile info from the talents endpoint (filtered by this id)
        const [profileRes, projectsRes] = await Promise.all([
          api.get(`/api/talents/${id}`),
          api.get(`/api/projects?userId=${id}`),
        ]);

        if (!profileRes.ok) throw new Error("Profile not found");
        const profileData = await profileRes.json();
        setProfile(profileData.talent);

        if (projectsRes.ok) {
          const projData = await projectsRes.json();
          setProjects(projData.projects);
        }
      } catch (err) {
        setError("Could not load this profile.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleMessage = async () => {
    if (!id) return;
    try {
      const res = await api.post("/api/conversations", { recipientId: id });
      if (res.ok) navigate("/messages");
    } catch (err) {
      console.error("Failed to start conversation:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 size={36} className="animate-spin text-primary" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center p-6">
        <ShieldAlert size={48} className="text-error mb-4" />
        <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
        <p className="text-on-surface-variant mb-6">{error || "This user doesn't exist."}</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const initials = (profile.name ?? "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-surface text-on-surface">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface mb-8 transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Profile Card */}
        <div className="lg:col-span-4 space-y-6">
          <Card variant="elevated" className="p-8 border border-outline-variant/10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary to-primary-container" />

            <div className="flex flex-col items-center pt-4">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={`${profile.name}'s Avatar`}
                  className="w-24 h-24 rounded-full object-cover border-4 border-surface-container mb-4 shadow-sm"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary/20 border-4 border-surface-container mb-4 shadow-sm flex items-center justify-center">
                  <span className="text-2xl font-black text-primary">{initials}</span>
                </div>
              )}

              <h1 className="text-2xl font-black tracking-tight mb-1">{profile.name}</h1>
              {profile.title && (
                <p className="text-primary font-bold text-sm mb-4 uppercase tracking-wider">{profile.title}</p>
              )}

              {profile.location && (
                <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mb-2">
                  <MapPin size={14} />
                  <span>{profile.location}</span>
                </div>
              )}

              {profile.hourlyRate && (
                <div className="flex items-center gap-1 text-on-surface font-bold text-lg mb-4">
                  <DollarSign size={18} className="text-primary" />
                  <span>{profile.hourlyRate}/hr</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-4">
                <Briefcase size={13} className="text-primary" />
                <span>{projects.length} project{projects.length !== 1 ? "s" : ""} in portfolio</span>
              </div>

              {profile.bio && (
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6 border-t border-outline-variant/10 pt-4 text-left">
                  {profile.bio}
                </p>
              )}

              {/* Skills */}
              {profile.skills && profile.skills.length > 0 && (
                <div className="w-full border-t border-outline-variant/10 pt-4 text-left mb-6">
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-3">
                    Expertise
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-full text-xs font-semibold"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Message CTA */}
              <button
                id={`message-${profile.id}`}
                onClick={handleMessage}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-on-primary rounded-xl font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
              >
                <MessageCircle size={16} />
                Message {profile.name?.split(" ")[0]}
              </button>
            </div>
          </Card>
        </div>

        {/* Right: Portfolio Projects (read-only) */}
        <div className="lg:col-span-8 space-y-6">
          <h2 className="text-2xl font-extrabold tracking-tight">
            {profile.name?.split(" ")[0]}'s Portfolio
          </h2>

          {projects.length === 0 ? (
            <Card variant="elevated" className="p-12 border border-outline-variant/10 text-center space-y-4">
              <h3 className="text-xl font-bold">No Projects Yet</h3>
              <p className="text-on-surface-variant text-sm">
                {profile.name?.split(" ")[0]} hasn't uploaded any portfolio projects yet.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  variant="elevated"
                  className="border border-outline-variant/10 overflow-hidden flex flex-col group"
                >
                  {project.mediaUrl ? (
                    <div className="h-48 overflow-hidden bg-surface-container">
                      <img
                        src={project.mediaUrl}
                        alt={project.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <Briefcase size={32} className="text-primary/40" />
                    </div>
                  )}

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{project.title}</h3>
                      {project.description && (
                        <p className="text-on-surface-variant text-xs mt-2 leading-relaxed line-clamp-3">
                          {project.description}
                        </p>
                      )}
                    </div>
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-outline-variant/10">
                        {project.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="px-2.5 py-0.5 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider rounded-full"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Smart Router ─────────────────────────────────────────────────────────────
// /profile     → shows your own profile
// /profile/:id → shows someone else's public read-only profile

export const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  return id ? <PublicProfilePage /> : <OwnProfilePage />;
};

export default ProfilePage;
