"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowUp, Sparkles } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { AgentSelector } from "./AgentSelector";

export const ChatInput = () => {
  const { sendMessage, isGenerating } = useChat();
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [content]);

  const handleSend = async () => {
    if (!content.trim() || isGenerating) return;
    const textToSend = content;
    setContent("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    await sendMessage(textToSend);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4">
      {/* 1. Floating Agent Selector Pill Bar */}
      <AgentSelector />

      {/* 2. Chat Input Box */}
      <div className="relative mt-2 rounded-2xl border border-sky-500/20 bg-[#0d1527]/90 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] focus-within:border-sky-400/50 transition-all p-3">
        <textarea
          ref={textareaRef}
          rows={1}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask SkyGPT anything... (Enter to send, Shift+Enter for new line)"
          disabled={isGenerating}
          className="w-full resize-none bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none max-h-40 overflow-y-auto leading-relaxed"
        />

        <div className="flex items-center justify-between pt-2 mt-1 border-t border-sky-500/10">
          <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
            <Sparkles className="w-3 h-3 text-sky-400/70" />
            LangGraph Autonomous Agent System
          </span>

          <button
            onClick={handleSend}
            disabled={!content.trim() || isGenerating}
            className="p-2 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md cursor-pointer shrink-0"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
