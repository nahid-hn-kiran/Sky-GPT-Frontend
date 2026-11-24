"use client";

import React from "react";
import {
  Cloud,
  Plus,
  MessageSquare,
  Trash2,
  LogOut,
  User as UserIcon,
  ShieldCheck,
} from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const {
    conversations,
    activeConversation,
    selectConversation,
    startNewConversation,
    deleteConversation,
    isGenerating,
  } = useChat();

  const { user, logout } = useAuth();

  const handleSelect = async (id: string) => {
    await selectConversation(id);
    if (onClose) onClose();
  };

  const handleNew = async () => {
    await startNewConversation();
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed lg:static top-0 left-0 z-50 h-full w-72 flex flex-col bg-[#070b14]/95 lg:bg-[#070b14] border-r border-sky-500/10 transition-transform duration-300 ease-in-out shrink-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-sky-500/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_-2px_rgba(56,189,248,0.4)]">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-wide bg-gradient-to-r from-sky-400 via-sky-200 to-indigo-300 bg-clip-text text-transparent">
                SkyGPT
              </h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                Multi-Agent Studio
              </p>
            </div>
          </div>
        </div>

        {/* New Thread Button */}
        <div className="p-3">
          <button
            onClick={handleNew}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-medium text-sm transition-all shadow-[0_4px_12px_rgba(2,132,199,0.3)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Conversation</span>
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-2 py-1">
            Recent Threads
          </div>

          {conversations.length === 0 ? (
            <div className="text-center py-8 px-4 text-xs text-slate-500">
              No conversations yet. Start a new thread above!
            </div>
          ) : (
            conversations.map((conv) => {
              const isActive = activeConversation?._id === conv._id;
              return (
                <div
                  key={conv._id}
                  onClick={() => handleSelect(conv._id)}
                  className={cn(
                    "group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all border",
                    isActive
                      ? "bg-sky-500/15 border-sky-500/30 text-sky-200"
                      : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40",
                  )}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <MessageSquare
                      className={cn(
                        "w-3.5 h-3.5 shrink-0",
                        isActive ? "text-sky-400" : "text-slate-500",
                      )}
                    />
                    <span className="truncate">{conv.title}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conv._id);
                    }}
                    title="Delete Thread"
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* User Account / Footer */}
        <div className="p-3 border-t border-sky-500/10 bg-slate-950/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                <UserIcon className="w-4 h-4 text-sky-400" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-200 truncate">
                  {user?.name || user?.email || "Guest User"}
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-slate-400 truncate">
                    {user?.email || "Local Sandbox"}
                  </span>
                  {user?.role === "admin" && (
                    <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      <ShieldCheck className="w-2.5 h-2.5" />
                      Admin
                    </span>
                  )}
                </div>
              </div>
            </div>

            {user && (
              <button
                onClick={logout}
                title="Sign Out"
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
