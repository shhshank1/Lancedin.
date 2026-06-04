import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly variant?: "default" | "skill" | "status";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className = "",
  variant = "default",
}) => {
  const variants = {
    default:
      "bg-primary-fixed text-on-primary-fixed dark:bg-primary-fixed dark:text-on-primary-fixed",
    skill:
      "bg-primary-fixed text-on-primary-fixed dark:bg-primary-fixed dark:text-on-primary-fixed",
    status:
      "bg-tertiary-fixed text-on-tertiary-fixed dark:bg-tertiary-fixed dark:text-on-tertiary-fixed",
  };

  return (
    <span
      className={cn(
        "inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
