import React from "react";
import { cn } from "@/lib/utils";
import { MapPin, Briefcase, MessageCircle, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Skill {
  id: string;
  name: string;
}

interface TalentCardProps {
  readonly id: string;
  readonly name: string;
  readonly title: string | null;
  readonly avatar: string | null;
  readonly location: string | null;
  readonly hourlyRate: number | null;
  readonly skills: Skill[];
  readonly projectCount: number;
  readonly onMessage: (talentId: string) => void;
  readonly className?: string;
}

export const TalentCard: React.FC<TalentCardProps> = ({
  id,
  name,
  title,
  avatar,
  location,
  hourlyRate,
  skills,
  projectCount,
  onMessage,
  className = "",
}) => {
  const navigate = useNavigate();
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        "bg-surface-container-lowest rounded-2xl overflow-hidden",
        "shadow-[0_8px_24px_rgba(25,28,29,0.06)]",
        "hover:shadow-[0_16px_40px_rgba(25,28,29,0.12)] hover:-translate-y-1",
        "transition-all duration-300 group flex flex-col",
        className
      )}
    >
      {/* Avatar / Top Section */}
      <div className="relative h-40 bg-gradient-to-br from-primary/20 via-secondary/10 to-tertiary/20 flex items-center justify-center">
        {avatar ? (
          <img
            alt={`Profile of ${name}`}
            src={avatar}
            className="w-24 h-24 rounded-full object-cover border-4 border-surface shadow-lg"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-primary/20 border-4 border-surface shadow-lg flex items-center justify-center">
            <span className="text-2xl font-black text-primary">{initials}</span>
          </div>
        )}
        {/* Project count badge */}
        <div className="absolute top-3 right-3 bg-surface-container-lowest/90 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
          <Briefcase size={11} className="text-primary" />
          <span className="text-xs font-bold text-on-surface">{projectCount}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Name & Title */}
        <div>
          <h3 className="text-base font-bold text-on-surface leading-tight">{name}</h3>
          {title && (
            <p className="text-sm text-on-surface-variant mt-0.5 line-clamp-1">{title}</p>
          )}
        </div>

        {/* Location */}
        {location && (
          <div className="flex items-center gap-1.5 text-on-surface-variant">
            <MapPin size={12} />
            <span className="text-xs">{location}</span>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {skills.slice(0, 3).map((skill) => (
              <span
                key={skill.id}
                className="px-2.5 py-0.5 bg-secondary-fixed text-on-secondary-fixed-variant rounded-full text-[10px] font-bold uppercase tracking-wider"
              >
                {skill.name}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="px-2.5 py-0.5 bg-surface-container-high text-on-surface-variant rounded-full text-[10px] font-medium">
                +{skills.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom row */}
        <div className="pt-3 border-t border-outline-variant/10 flex items-center justify-between gap-2">
          <div>
            {hourlyRate ? (
              <>
                <span className="text-on-surface-variant text-[10px]">Starting at</span>
                <p className="text-on-surface font-black text-lg leading-tight">${hourlyRate}/hr</p>
              </>
            ) : (
              <p className="text-on-surface-variant text-sm">Rate negotiable</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              id={`view-profile-${id}`}
              onClick={() => navigate(`/profile/${id}`)}
              className="p-2 rounded-xl bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface transition-all"
              title="View Profile"
            >
              <UserCircle size={16} />
            </button>
            <button
              id={`message-talent-${id}`}
              onClick={() => onMessage(id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:opacity-90 active:scale-95 transition-all"
            >
              <MessageCircle size={13} />
              Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentCard;
