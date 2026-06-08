import React, { useState, useEffect, useRef } from "react";
import { Search, Phone, Video, Info, PlusCircle, Image, Smile, Send, X, Users, MessageSquare } from "lucide-react";
import { ConversationItem } from "@/components/messaging/ConversationItem";
import { MessageBubble } from "@/components/messaging/MessageBubble";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  role: "SEEKER" | "TALENT";
  title?: string;
}

interface Conversation {
  id: string;
  otherUser: {
    id: string;
    name: string;
    avatar?: string;
    title?: string;
  };
  lastMessage: string;
  timestamp: string;
}

interface Message {
  id: string;
  content: string;
  conversationId: string;
  senderId: string;
  createdAt: string;
}

export const MessagingPage: React.FC = () => {
  const { user } = useAuth();
  const [conversationsList, setConversationsList] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations
  const fetchConversations = async (silent = false) => {
    try {
      const response = await fetch("http://localhost:3000/api/conversations", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setConversationsList(data.conversations);
      }
    } catch (err) {
      console.error("Error fetching conversations", err);
    } finally {
      if (!silent) setLoadingConvs(false);
    }
  };

  // Fetch messages for active conversation
  const fetchMessages = async (convId: string, silent = false) => {
    if (!silent) setLoadingMessages(true);
    try {
      const response = await fetch(`http://localhost:3000/api/conversations/${convId}/messages`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Error fetching messages", err);
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  };

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/users/contacts", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts);
      }
    } catch (err) {
      console.error("Error fetching contacts", err);
    }
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Initial load
  useEffect(() => {
    fetchConversations();
    fetchContacts();
  }, []);

  // Poll for new messages and conversation updates
  useEffect(() => {
    if (!activeConversation) return;

    fetchMessages(activeConversation);

    const interval = setInterval(() => {
      fetchMessages(activeConversation, true);
      fetchConversations(true);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeConversation]);

  // Scroll on message length change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const activeConvDetails = conversationsList.find((c) => c.id === activeConversation);

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConversation || !messageInput.trim()) return;

    const content = messageInput;
    setMessageInput(""); // Clear immediately

    try {
      const response = await fetch(`http://localhost:3000/api/conversations/${activeConversation}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, data.message]);
        fetchConversations(true);
      }
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  // Start conversation with contact
  const handleStartConversation = async (recipientId: string) => {
    try {
      const response = await fetch("http://localhost:3000/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipientId }),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        const newConv = data.conversation;

        if (!conversationsList.some((c) => c.id === newConv.id)) {
          setConversationsList((prev) => [newConv, ...prev]);
        }

        setActiveConversation(newConv.id);
        setShowContactsModal(false);
        setShowSidebar(false); // collapse on mobile
      }
    } catch (err) {
      console.error("Error starting conversation", err);
    }
  };

  // Filter conversations based on query
  const filteredConversations = conversationsList.filter((c) =>
    c.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row overflow-hidden -mb-8 bg-surface text-on-surface">
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
            <button
              onClick={() => setShowContactsModal(true)}
              className="p-2 bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-on-primary transition-all active:scale-95"
              title="Start conversation"
            >
              <Users size={18} />
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
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-low dark:bg-surface-container-high border-none rounded-xl pl-10 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none text-on-surface placeholder:text-on-surface-variant/50"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1 pb-4">
          {loadingConvs ? (
            <div className="p-4 space-y-3">
              <div className="h-12 bg-surface-container animate-pulse rounded-xl" />
              <div className="h-12 bg-surface-container animate-pulse rounded-xl" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-6 text-center text-on-surface-variant/70 text-sm space-y-2">
              <p>No active conversations found.</p>
              <button
                onClick={() => setShowContactsModal(true)}
                className="text-primary font-bold text-xs hover:underline uppercase tracking-wide block mx-auto animate-pulse"
              >
                + Start a Chat
              </button>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                name={conv.otherUser.name}
                avatar={conv.otherUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"}
                lastMessage={conv.lastMessage}
                timestamp={new Date(conv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                online={false}
                unread={0}
                isActive={activeConversation === conv.id}
                onClick={() => {
                  setActiveConversation(conv.id);
                  setShowSidebar(false); // collapse on mobile
                }}
              />
            ))
          )}
        </div>
      </aside>

      {/* ─── Chat Window ─── */}
      <section className="flex-1 bg-surface flex flex-col relative h-full">
        {activeConversation && activeConvDetails ? (
          <>
            {/* Chat Header */}
            <header className="bg-surface-container-lowest/90 dark:bg-surface-container/90 backdrop-blur-md px-6 md:px-8 py-4 border-b border-outline-variant/30 flex justify-between items-center z-20 shrink-0">
              <div className="flex items-center gap-4">
                {/* Mobile back button */}
                <button
                  className="md:hidden p-1 text-on-surface-variant hover:text-primary mr-1"
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
                    alt={activeConvDetails.otherUser.name}
                    src={activeConvDetails.otherUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-base font-bold text-on-surface leading-tight">
                    {activeConvDetails.otherUser.name}
                  </h2>
                  <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                    {activeConvDetails.otherUser.title || "Elite Professional"}
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
              {loadingMessages && messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="relative w-8 h-8">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse" />
                    <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-on-surface-variant/60 text-sm space-y-2">
                  <MessageSquare size={36} className="text-primary/30" />
                  <p>Send a message to start the conversation!</p>
                </div>
              ) : (
                messages.map((msg, i) => {
                  const nextMsg = messages[i + 1];
                  const isLastInGroup = !nextMsg || nextMsg.senderId !== msg.senderId;
                  const isMe = msg.senderId === user?.id;

                  return (
                    <MessageBubble
                      key={msg.id}
                      text={msg.content}
                      timestamp={new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      sender={isMe ? "me" : "them"}
                      senderAvatar={
                        !isMe
                          ? activeConvDetails.otherUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
                          : undefined
                      }
                      senderName={!isMe ? activeConvDetails.otherUser.name : undefined}
                      isLastInGroup={isLastInGroup}
                    />
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 md:p-6 bg-surface-container-lowest dark:bg-surface-container border-t border-outline-variant/30 shrink-0"
            >
              <div className="flex items-end gap-3 max-w-5xl mx-auto">
                <div className="flex items-center pb-2">
                  <button type="button" className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-full transition-all">
                    <PlusCircle size={20} />
                  </button>
                  <button type="button" className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-full transition-all">
                    <Image size={20} />
                  </button>
                </div>

                <div className="flex-1 relative">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full bg-surface-container-low dark:bg-surface-container-high border-none rounded-2xl px-6 py-3.5 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none max-h-32 overflow-y-auto text-on-surface placeholder:text-on-surface-variant/50"
                  />
                  <button type="button" className="absolute right-3 bottom-2.5 p-1.5 text-on-surface-variant hover:text-primary transition-all">
                    <Smile size={18} />
                  </button>
                </div>

                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-container text-on-primary p-3.5 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-surface space-y-4">
            <div className="p-4 bg-primary/10 rounded-full text-primary">
              <MessageSquare size={36} />
            </div>
            <h2 className="text-xl font-bold">Your Inbox</h2>
            <p className="text-on-surface-variant text-sm max-w-sm">
              Select a conversation from the sidebar, or start a new chat with our verified creators and seekers.
            </p>
            <Button onClick={() => setShowContactsModal(true)}>Find Someone to Message</Button>
          </div>
        )}
      </section>

      {/* ─── Contacts Selection Modal ─── */}
      {showContactsModal && (
        <div className="fixed inset-0 bg-surface-container-lowest/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-[fade-in_0.2s_ease-out]">
          <Card className="w-full max-w-md border border-outline-variant/20 p-6 space-y-6 relative overflow-hidden shadow-xl bg-surface-container-lowest">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-extrabold tracking-tight">New Conversation</h3>
              <button
                onClick={() => setShowContactsModal(false)}
                className="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[300px] overflow-y-auto space-y-3 pr-1">
              {contacts.length === 0 ? (
                <p className="text-center text-xs text-on-surface-variant py-6">
                  No other active users found matching your opposite role.
                </p>
              ) : (
                contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-3 bg-surface hover:bg-surface-container-low rounded-xl transition-all border border-outline-variant/10 group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={contact.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"}
                        alt={contact.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <span className="text-sm font-bold block text-on-surface leading-tight">
                          {contact.name}
                        </span>
                        <span className="text-[10px] text-on-surface-variant font-medium">
                          {contact.title || (contact.role === "TALENT" ? "Freelance Professional" : "Client")}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleStartConversation(contact.id)}
                      variant="ghost"
                      size="sm"
                      className="text-xs text-primary font-bold hover:underline"
                    >
                      Chat
                    </Button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MessagingPage;
