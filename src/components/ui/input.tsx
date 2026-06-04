import React from "react";
import { cn } from "@/lib/utils";

interface InputProps {
  readonly id: string;
  readonly label: string;
  readonly type?: "text" | "email" | "password" | "search";
  readonly placeholder?: string;
  readonly className?: string;
  readonly value?: string;
  readonly onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input: React.FC<InputProps> = ({
  id,
  label,
  type = "text",
  placeholder = "",
  className = "",
  value,
  onChange,
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor={id}
        className="block text-[10px] uppercase tracking-widest font-bold text-on-surface-variant"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3.5 bg-surface-container-highest dark:bg-surface-container-high rounded-xl border-none focus:ring-2 focus:ring-primary/20 focus:outline-none text-on-surface placeholder:text-on-surface-variant/50 transition-all"
      />
    </div>
  );
};

export default Input;
