import React from "react";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface TalentCardProps {
  readonly name: string;
  readonly role: string;
  readonly avatar: string;
  readonly rating: number;
  readonly hourlyRate: number;
  readonly className?: string;
}

export const TalentCard: React.FC<TalentCardProps> = ({
  name,
  role,
  avatar,
  rating,
  hourlyRate,
  className = "",
}) => {
  return (
    <div
      className={cn(
        "bg-surface-container-lowest rounded-xl p-5",
        "shadow-[0_12px_32px_rgba(25,28,29,0.04)]",
        "hover:shadow-md transition-all duration-300",
        "group cursor-pointer",
        className
      )}
    >
      {/* Image */}
      <div className="relative mb-4">
        <img
          alt={`Profile of ${name}`}
          src={avatar}
          className="w-full h-56 object-cover rounded-xl grayscale group-hover:grayscale-0 transition-all duration-500"
        />
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-surface-container-lowest/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
          <Star
            size={12}
            className="text-tertiary fill-tertiary"
          />
          <span className="text-xs font-bold text-on-surface">{rating}</span>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-on-surface">{name}</h3>
        <div className="flex flex-wrap gap-2 py-2">
          <span className="px-3 py-1 bg-secondary-fixed text-on-secondary-fixed-variant rounded-full text-[10px] font-bold uppercase tracking-wider">
            {role}
          </span>
        </div>
        <div className="pt-3 flex items-center justify-between border-t border-outline-variant/10">
          <span className="text-on-surface-variant text-xs">Starting at</span>
          <span className="text-on-surface font-bold text-lg">
            ${hourlyRate}/hr
          </span>
        </div>
      </div>
    </div>
  );
};

export default TalentCard;
