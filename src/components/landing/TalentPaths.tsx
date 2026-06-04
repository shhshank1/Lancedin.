import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { talentPaths } from "@/data/mockData";
import { Briefcase, Pen, ArrowRight } from "lucide-react";

interface TalentPathsProps {
  readonly className?: string;
}

const iconMap = {
  Briefcase: Briefcase,
  Pen: Pen,
} as const;

export const TalentPaths: React.FC<TalentPathsProps> = ({ className = "" }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${className}`}>
      {talentPaths.map((path) => {
        const Icon = iconMap[path.icon];
        return (
          <Link key={path.id} to={path.href}>
            <Card hover className="p-6 group">
              <Icon className="text-primary mb-4" size={28} />
              <h3 className="text-lg font-bold mb-1 text-on-surface">{path.title}</h3>
              <p className="text-sm text-on-surface-variant">{path.description}</p>
              <div className="mt-4 flex items-center text-primary font-bold text-sm group-hover:gap-2 transition-all">
                {path.cta} <ArrowRight size={14} className="ml-1" />
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

export default TalentPaths;
