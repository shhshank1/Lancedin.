import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly variant?: "primary" | "secondary" | "ghost" | "outline";
  readonly size?: "sm" | "md" | "lg";
  readonly onClick?: () => void;
  readonly type?: "button" | "submit" | "reset";
  readonly disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  onClick,
  type = "button",
  disabled = false,
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-bold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-gradient-to-tr from-primary to-primary-container text-on-primary rounded-xl shadow-lg hover:shadow-xl",
    secondary:
      "bg-surface-container-low text-on-surface rounded-xl hover:bg-surface-container",
    ghost:
      "bg-transparent text-primary hover:bg-surface-container-low rounded-xl",
    outline:
      "bg-transparent text-on-surface border border-outline-variant/20 rounded-xl hover:bg-surface-container-low",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-3 text-sm",
    lg: "px-6 py-4 text-base",
  };

  return (
    <button
      type={type}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
