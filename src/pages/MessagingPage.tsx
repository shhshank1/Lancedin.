import React, { useState } from "react";
import {
  Search,
  Edit3,
  Phone,
  Video,
  Info,
  PlusCircle,
  Image,
  Smile,
  Send,
} from "lucide-react";
import { ConversationItem } from "@/components/messaging/ConversationItem";
import { MessageBubble } from "@/components/messaging/MessageBubble";
import { conversations, activeChat } from "@/data/mockData";

export const MessagingPage: React.FC = () => {
  const [activeConversation, setActiveConversation] = useState(
    conversations[0].id
  );
  const [messageInput, setMessageInput] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row overflow-hidden -mb-8">
      {/* ─── Sidebar: Conversations ─── */}
      <aside
        className={`
          ${showSidebar ? "flex" : "hidden"}
          md:flex w-full md:w-[380px] bg-surface-container-lowest dark:bg-surface-container
          border-r border-outline-variant/30 flex-col h-full z-10 shrink-0
        `}
      >
        {/* Header */}
        <div className="p-6 pb-2">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-on-surface">
              Messages
            </h1>
            <button className="p-2 bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-on-primary transition-all active:scale-95">
              <Edit3 size={18} />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
            />
            <input
              type="text"
              placeholder="Search conversations"
              className="w-full bg-surface-container-low dark:bg-surface-container-high border-none rounded-xl pl-10 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none text-on-surface placeholder:text-on-surface-variant/50"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              name={conv.name}
              avatar={conv.avatar}
              lastMessage={conv.lastMessage}
              timestamp={conv.timestamp}
              online={conv.online}
              unread={conv.unread}
              isActive={activeConversation === conv.id}
              onClick={() => {
                setActiveConversation(conv.id);
                setShowSidebar(false); // collapse on mobile
              }}
            />
          ))}
        </div>
      </aside>

      {/* ─── Chat Window ─── */}
      <section className="flex-1 bg-surface flex flex-col relative h-full">
        {/* Chat Header */}
        <header className="bg-surface-container-lowest/90 dark:bg-surface-container/90 backdrop-blur-md px-6 md:px-8 py-4 border-b border-outline-variant/30 flex justify-between items-center z-20 shrink-0">
          <div className="flex items-center gap-4">
            {/* Mobile back button */}
            <button
              className="md:hidden p-1 text-on-surface-variant hover:text-primary"
              onClick={() => setShowSidebar(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <div className="relative">
              <img
                alt={activeChat.contactName}
                src={activeChat.contactAvatar}
                className="w-10 h-10 rounded-full object-cover"
              />
              {activeChat.isOnline && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-surface-container-lowest rounded-full" />
              )}
            </div>
            <div>
              <h2 className="text-base font-bold text-on-surface leading-tight">
                {activeChat.contactName}
              </h2>
              <span className="text-xs text-on-surface-variant flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
                Active now
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button className="p-2.5 text-on-surface-variant hover:bg-surface-container-low rounded-xl transition-all">
              <Phone size={18} />
            </button>
            <button className="p-2.5 text-on-surface-variant hover:bg-surface-container-low rounded-xl transition-all">
              <Video size={18} />
            </button>
            <button className="p-2.5 text-on-surface-variant hover:bg-surface-container-low rounded-xl transition-all">
              <Info size={18} />
            </button>
          </div>
        </header>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scroll-smooth">
          {/* Date Divider */}
          <div className="flex items-center justify-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-full">
              Today, Nov 14
            </span>
          </div>

          {/* Messages */}
          {activeChat.messages.map((msg, i) => {
            const nextMsg = activeChat.messages[i + 1];
            const isLastInGroup =
              !nextMsg || nextMsg.sender !== msg.sender;

            return (
              <MessageBubble
                key={msg.id}
                text={msg.text}
                timestamp={msg.timestamp}
                sender={msg.sender}
                senderAvatar={
                  msg.sender === "them"
                    ? activeChat.contactAvatar
                    : undefined
                }
                senderName={
                  msg.sender === "them"
                    ? activeChat.contactName
                    : undefined
                }
                read={"read" in msg ? (msg as { read?: boolean }).read : undefined}
                isLastInGroup={isLastInGroup}
              />
            );
          })}

          {/* Shared Image Attachment */}
          <div className="flex flex-row-reverse gap-3 max-w-[80%] ml-auto">
            <div className="space-y-2 items-end flex flex-col">
              <div className="rounded-2xl overflow-hidden shadow-lg max-w-[300px]">
                <img
                  alt={activeChat.sharedImage.alt}
                  src={activeChat.sharedImage.url}
                  className="w-full h-auto"
                />
              </div>
              <span className="text-[10px] text-on-surface-variant pr-1">
                11:12 AM
              </span>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <footer className="p-4 md:p-6 bg-surface-container-lowest dark:bg-surface-container border-t border-outline-variant/30 shrink-0">
          <div className="flex items-end gap-3 max-w-5xl mx-auto">
            {/* Attachment buttons */}
            <div className="flex items-center pb-2">
              <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-full transition-all">
                <PlusCircle size={20} />
              </button>
              <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-full transition-all">
                <Image size={20} />
              </button>
            </div>

            {/* Text input */}
            <div className="flex-1 relative">
              <textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                rows={1}
                className="w-full bg-surface-container-low dark:bg-surface-container-high border-none rounded-2xl px-6 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none max-h-32 overflow-y-auto text-on-surface placeholder:text-on-surface-variant/50"
              />
              <button className="absolute right-3 bottom-2.5 p-1.5 text-on-surface-variant hover:text-primary transition-all">
                <Smile size={18} />
              </button>
            </div>

            {/* Send button */}
            <button className="bg-primary hover:bg-primary-container text-on-primary p-3 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center">
              <Send size={18} />
            </button>
          </div>

          <div className="mt-4 flex justify-center">
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
              © 2024 LancedIn · Professional Networking
            </p>
          </div>
        </footer>
      </section>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface-container-lowest border-t border-outline-variant/20 flex justify-around items-center py-2 z-50">
        <button className="flex flex-col items-center gap-1 text-on-surface-variant">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 11v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><path d="M12 3v12"/></svg>
          <span className="text-[10px] font-bold">Feed</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-primary">
          <Send size={20} className="fill-primary" />
          <span className="text-[10px] font-bold">Chat</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-on-surface-variant">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
          <span className="text-[10px] font-bold">Saved</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-on-surface-variant">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
          <span className="text-[10px] font-bold">Alerts</span>
        </button>
      </nav>
    </div>
  );
};

export default MessagingPage;
