"use client";

import React from "react";
import { Menu, Sparkles, LogIn } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import { AGENT_LIST } from "../chat/AgentSelector";

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenLoginModal: () => void;
}

export const Header = ({ onToggleSidebar, onOpenLoginModal }: HeaderProps) => {
  const { activeConversation, selectedAgent, isGenerating } = useChat();
  const { user } = useAuth();

  const currentAgentInfo =
    AGENT_LIST.find((a) => a.id === selectedAgent) || AGENT_LIST[0];

  return (
    <header className="h-14 border-b border-sky-500/10 bg-[#070b14]/80 backdrop-blur-md px-4 flex items-center justify-between z-30 shrink-0">
      {/* Left: Sidebar toggle + Thread title */}
      <div className="flex items-center gap-3 overflow-hidden">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors lg:hidden cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="overflow-hidden">
          <h2 className="text-sm font-semibold text-slate-100 truncate">
            {activeConversation?.title || "New Exploration"}
          </h2>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] text-sky-400">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              Active Mode: <strong>{currentAgentInfo.name}</strong>
            </span>
            {isGenerating && (
              <span className="text-[10px] text-indigo-400 flex items-center gap-1 font-medium">
                <Sparkles className="w-3 h-3 animate-spin" />
                Thinking...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Login Button if not logged in */}
        {!user && (
          <button
            onClick={onOpenLoginModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-[0_0_12px_rgba(99,102,241,0.3)] transition-all cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
