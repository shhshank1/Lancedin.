import React from "react";
import { cn } from "@/lib/utils";
import { CheckCheck } from "lucide-react";

interface MessageBubbleProps {
  readonly text: string;
  readonly timestamp: string;
  readonly sender: "me" | "them";
  readonly senderAvatar?: string;
  readonly senderName?: string;
  readonly read?: boolean;
  readonly isLastInGroup?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  text,
  timestamp,
  sender,
  senderAvatar,
  read,
  isLastInGroup = true,
}) => {
  const isMe = sender === "me";

  return (
    <div
      className={cn(
        "flex gap-3 max-w-[80%]",
        isMe ? "flex-row-reverse ml-auto" : ""
      )}
    >
      {/* Avatar — only for received, only on last in group */}
      {!isMe && (
        <div className="w-8 shrink-0 self-end">
          {isLastInGroup && senderAvatar ? (
            <img
              alt=""
              src={senderAvatar}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8" />
          )}
        </div>
      )}

      {/* Bubble + timestamp */}
      <div
        className={cn(
          "space-y-1",
          isMe ? "items-end flex flex-col" : ""
        )}
      >
        <div
          className={cn(
            "px-5 py-3 rounded-2xl text-sm leading-relaxed",
            isMe
              ? "bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-br-none shadow-md"
              : "bg-surface-container-lowest dark:bg-surface-container-high border border-outline-variant/10 rounded-bl-none shadow-sm text-on-surface"
          )}
        >
          {text}
        </div>
        {isLastInGroup && (
          <span
            className={cn(
              "text-[10px] text-on-surface-variant flex items-center gap-1",
              isMe ? "pr-1" : "pl-1"
            )}
          >
            {timestamp}
            {isMe && read && (
              <CheckCheck size={12} className="text-primary" />
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
