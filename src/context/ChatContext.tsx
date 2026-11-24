"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "../lib/api";
import { AgentType, Conversation, Message } from "../types";
import { useAuth } from "./AuthContext";

interface ChatContextType {
  conversations: Conversation[];
  activeConversation: (Conversation & { messages: Message[] }) | null;
  selectedAgent: AgentType;
  isGenerating: boolean;
  setSelectedAgent: (agent: AgentType) => void;
  loadConversations: () => Promise<void>;
  selectConversation: (id: string) => Promise<void>;
  startNewConversation: () => Promise<string | null>;
  deleteConversation: (id: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<
    (Conversation & { messages: Message[] }) | null
  >(null);
  const [selectedAgent, setSelectedAgent] = useState<AgentType>("auto");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // 1. Fetch conversations when authenticated
  const loadConversations = useCallback(async () => {
    if (!isAuthenticated) {
      setConversations([]);
      return;
    }
    try {
      const list = await api.chat.getConversations();
      setConversations(list);
    } catch (err) {
      console.error("[Failed to load conversations]:", err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // 2. Select and load a conversation thread + messages
  const selectConversation = async (id: string) => {
    try {
      const fullConv = await api.chat.getConversation(id);
      setActiveConversation(fullConv);
    } catch (err) {
      console.error(`[Failed to load conversation ${id}]:`, err);
    }
  };

  // 3. Start a new conversation thread
  const startNewConversation = async (): Promise<string | null> => {
    try {
      const newConv = await api.chat.createConversation("New Conversation");
      const fullConv = { ...newConv, messages: [] };
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversation(fullConv);
      return newConv._id;
    } catch (err) {
      console.error("[Failed to create conversation]:", err);
      return null;
    }
  };

  // 4. Delete a conversation thread
  const deleteConversation = async (id: string) => {
    try {
      await api.chat.deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c._id !== id));
      if (activeConversation?._id === id) {
        setActiveConversation(null);
      }
    } catch (err) {
      console.error(`[Failed to delete conversation ${id}]:`, err);
    }
  };

  // 5. Send message with optimistic update & LangGraph generation
  const sendMessage = async (content: string) => {
    if (!content.trim() || isGenerating) return;

    let targetConvId = activeConversation?._id;

    // If no active thread exists, create one on-the-fly
    if (!targetConvId) {
      targetConvId = (await startNewConversation()) || undefined;
      if (!targetConvId) return;
    }

    const optimisticUserMsg: Message = {
      _id: `temp-${Date.now()}`,
      conversationId: targetConvId,
      role: "user",
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    // Optimistically update the UI immediately
    setActiveConversation((prev) =>
      prev
        ? {
            ...prev,
            messages: [...prev.messages, optimisticUserMsg],
          }
        : null,
    );

    setIsGenerating(true);

    try {
      const result = await api.chat.sendMessage(
        targetConvId,
        content.trim(),
        selectedAgent,
      );

      // Replace optimistic message and append real assistant reply
      setActiveConversation((prev) => {
        if (!prev) return null;
        const filtered = prev.messages.filter(
          (m) => m._id !== optimisticUserMsg._id,
        );
        return {
          ...prev,
          title: result.conversationTitle || prev.title,
          messages: [...filtered, result.userMessage, result.assistantMessage],
        };
      });

      // Update sidebar title if modified
      setConversations((prev) =>
        prev.map((c) =>
          c._id === targetConvId
            ? { ...c, title: result.conversationTitle || c.title }
            : c,
        ),
      );
    } catch (err: any) {
      console.error("[Send message failed]:", err);
      const errorMsg: Message = {
        _id: `err-${Date.now()}`,
        conversationId: targetConvId,
        role: "assistant",
        content: `⚠️ Failed to get AI response: ${err.message}`,
        createdAt: new Date().toISOString(),
      };
      setActiveConversation((prev) =>
        prev
          ? {
              ...prev,
              messages: [...prev.messages, errorMsg],
            }
          : null,
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversation,
        selectedAgent,
        isGenerating,
        setSelectedAgent,
        loadConversations,
        selectConversation,
        startNewConversation,
        deleteConversation,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
