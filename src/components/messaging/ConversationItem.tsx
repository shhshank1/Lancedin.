import React from "react";
import { cn } from "@/lib/utils";

interface ConversationItemProps {
  readonly name: string;
  readonly avatar: string;
  readonly lastMessage: string;
  readonly timestamp: string;
  readonly online: boolean;
  readonly isActive: boolean;
  readonly unread: number;
  readonly onClick: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  name,
  avatar,
  lastMessage,
  timestamp,
  online,
  isActive,
  unread,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer",
        isActive
          ? "bg-primary/5 border-l-4 border-primary"
          : "hover:bg-surface-container-low border-l-4 border-transparent"
      )}
    >
      {/* Avatar with online indicator */}
      <div className="relative shrink-0">
        <img
          alt={name}
          src={avatar}
          className="w-12 h-12 rounded-full object-cover"
        />
        {online && (
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-surface-container-lowest rounded-full" />
        )}
      </div>

      {/* Text content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-0.5">
          <h3 className="text-sm font-bold truncate text-on-surface">{name}</h3>
          <span
            className={cn(
              "text-[10px] uppercase tracking-wider shrink-0 ml-2",
              isActive
                ? "text-primary font-bold"
                : "text-on-surface-variant"
            )}
          >
            {timestamp}
          </span>
        </div>
        <p
          className={cn(
            "text-xs truncate",
            unread > 0
              ? "text-on-surface-variant font-medium"
              : "text-on-surface-variant"
          )}
        >
          {lastMessage}
        </p>
      </div>
    </div>
  );
};

export default ConversationItem;
