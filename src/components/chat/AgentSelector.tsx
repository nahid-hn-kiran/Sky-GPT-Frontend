"use client";

import React from "react";
import {
  Sparkles,
  Search,
  Code2,
  FileText,
  Presentation,
  Image as ImageIcon,
  MessageSquare,
} from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { AgentMetadata, AgentType } from "@/types";
import { cn } from "@/lib/utils";

export const AGENT_LIST: AgentMetadata[] = [
  {
    id: "auto",
    name: "Auto",
    tagline: "Smart Assistant: Automatically selects the best specialist for your task",
    badge: "Smart",
    accentColor: "from-sky-400 via-indigo-500 to-purple-500",
    iconName: "Sparkles",
  },
  {
    id: "chat",
    name: "General",
    tagline: "Everyday conversation, writing, advice & brainstorming",
    badge: "Chat",
    accentColor: "from-slate-400 to-slate-600",
    iconName: "MessageSquare",
  },
  {
    id: "search",
    name: "Web Search",
    tagline: "Live web research, breaking news & real-time facts with sources",
    badge: "Live Web",
    accentColor: "from-cyan-400 to-blue-500",
    iconName: "Search",
  },
  {
    id: "coding",
    name: "Code Expert",
    tagline: "Write, debug, review and optimize production-ready code",
    badge: "Code",
    accentColor: "from-blue-500 to-indigo-600",
    iconName: "Code2",
  },
  {
    id: "pdf",
    name: "Document Analyst",
    tagline: "Analyze uploaded PDFs, contracts, notes and policies",
    badge: "Docs",
    accentColor: "from-teal-400 to-sky-500",
    iconName: "FileText",
  },
  {
    id: "ppt",
    name: "Slide Creator",
    tagline: "Generate presentation outlines, executive slide decks & pitch decks",
    badge: "Slides",
    accentColor: "from-indigo-400 to-violet-600",
    iconName: "Presentation",
  },
  {
    id: "image",
    name: "Image Studio",
    tagline: "Generate and visualize creative concept art and illustrations",
    badge: "Visual",
    accentColor: "from-violet-400 to-fuchsia-500",
    iconName: "ImageIcon",
  },
];

const renderIcon = (id: AgentType, className?: string) => {
  switch (id) {
    case "auto":
      return <Sparkles className={className} />;
    case "search":
      return <Search className={className} />;
    case "coding":
      return <Code2 className={className} />;
    case "pdf":
      return <FileText className={className} />;
    case "ppt":
      return <Presentation className={className} />;
    case "image":
      return <ImageIcon className={className} />;
    case "chat":
    default:
      return <MessageSquare className={className} />;
  }
};

export const AgentSelector = () => {
  const { selectedAgent, setSelectedAgent, isGenerating } = useChat();

  return (
    <div className="w-full flex items-center justify-start gap-1.5 overflow-x-auto py-2 px-1 no-scrollbar">
      {AGENT_LIST.map((agent) => {
        const isSelected = selectedAgent === agent.id;
        return (
          <button
            key={agent.id}
            disabled={isGenerating}
            onClick={() => setSelectedAgent(agent.id)}
            title={agent.tagline}
            className={cn(
              "flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 border cursor-pointer",
              isSelected
                ? "bg-sky-500/15 border-sky-400/50 text-sky-200 shadow-[0_0_15px_-3px_rgba(56,189,248,0.3)]"
                : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-800/50",
              isGenerating && "opacity-50 cursor-not-allowed",
            )}
          >
            <span
              className={cn(
                "p-1 rounded-full",
                isSelected
                  ? `bg-gradient-to-br ${agent.accentColor} text-white`
                  : "bg-slate-800 text-slate-400",
              )}
            >
              {renderIcon(agent.id, "w-3 h-3")}
            </span>
            <span>{agent.name}</span>
          </button>
        );
      })}
    </div>
  );
};
