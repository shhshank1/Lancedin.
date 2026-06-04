import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly variant?: "default" | "elevated" | "accent";
  readonly hover?: boolean;
  readonly onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  variant = "default",
  hover = false,
  onClick,
}) => {
  const variants = {
    default: "bg-surface-container-low dark:bg-surface-container-low",
    elevated:
      "bg-surface-container-lowest dark:bg-surface-container shadow-[0_12px_32px_rgba(25,28,29,0.04)]",
    accent: "bg-primary-container dark:bg-primary-container",
  };

  return (
    <div
      className={cn(
        "rounded-xl transition-all duration-300",
        variants[variant],
        hover && "cursor-pointer hover:bg-surface-container dark:hover:bg-surface-container-high",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
