import React from "react";
import { cn } from "@/lib/utils";
import { Clock, Briefcase } from "lucide-react";

interface NeedCardProps {
  readonly title: string;
  readonly company: string;
  readonly budget: string;
  readonly deadline: string;
  readonly skills: readonly string[];
  readonly postedAgo: string;
  readonly proposals: number;
  readonly className?: string;
}

export const NeedCard: React.FC<NeedCardProps> = ({
  title,
  company,
  budget,
  deadline,
  skills,
  postedAgo,
  proposals,
  className = "",
}) => {
  return (
    <div
      className={cn(
        "bg-surface-container-lowest rounded-xl p-6",
        "shadow-[0_12px_32px_rgba(25,28,29,0.04)]",
        "hover:shadow-md transition-all duration-300",
        "group cursor-pointer flex flex-col h-full",
        className
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-on-surface-variant font-medium text-sm flex items-center gap-1">
            <Briefcase size={14} />
            {company}
          </p>
        </div>
        <span className="text-on-surface-variant text-xs flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded-md">
          <Clock size={12} />
          {postedAgo}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {skills.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1 bg-secondary-fixed text-on-secondary-fixed-variant rounded-full text-[10px] font-bold uppercase tracking-wider"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-outline-variant/10 flex items-center justify-between">
        <div>
          <p className="text-on-surface-variant text-xs mb-1">Budget</p>
          <p className="text-on-surface font-bold">{budget}</p>
        </div>
        <div className="text-center">
          <p className="text-on-surface-variant text-xs mb-1">Timeline</p>
          <p className="text-on-surface font-bold">{deadline}</p>
        </div>
        <div className="text-right">
          <p className="text-on-surface-variant text-xs mb-1">Proposals</p>
          <p className="text-on-surface font-bold">{proposals}</p>
        </div>
      </div>
    </div>
  );
};

export default NeedCard;
