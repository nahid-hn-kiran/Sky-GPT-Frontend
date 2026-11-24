"use client";

import React, { useEffect, useRef } from "react";
import { Sparkles, Bot } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";

export const ChatContainer = () => {
  const { activeConversation, isGenerating, selectedAgent } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = activeConversation?.messages || [];

  // Auto-scroll smoothly to bottom on message updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-transparent relative">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-6 py-6 space-y-2">
        {messages.length === 0 ? (
          /* Empty State / Welcome Screen */
          <div className="h-full flex flex-col items-center justify-center text-center px-4 py-12 max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-[0_0_30px_rgba(56,189,248,0.4)] mb-4">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-100 tracking-tight mb-2">
              Welcome to SkyGPT
            </h2>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Your autonomous multi-agent ecosystem. Powered by Google Gemini,
              LangGraph cyclic tool calling, and Better Auth.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
              <div className="p-3.5 rounded-xl sky-glass border border-sky-500/15 text-xs">
                <span className="font-bold text-sky-400 block mb-1">
                  🔍 Live Web Research
                </span>
                <span className="text-slate-400">
                  Ask for current news or facts; Tavily search tool will fetch real-time sources.
                </span>
              </div>
              <div className="p-3.5 rounded-xl sky-glass border border-sky-500/15 text-xs">
                <span className="font-bold text-blue-400 block mb-1">
                  💻 Coding Specialist
                </span>
                <span className="text-slate-400">
                  Strict TypeScript, arrow functions, and complexity analysis.
                </span>
              </div>
              <div className="p-3.5 rounded-xl sky-glass border border-sky-500/15 text-xs">
                <span className="font-bold text-teal-400 block mb-1">
                  📄 PDF / Document RAG
                </span>
                <span className="text-slate-400">
                  Index contracts or policies and ask grounded questions.
                </span>
              </div>
              <div className="p-3.5 rounded-xl sky-glass border border-sky-500/15 text-xs">
                <span className="font-bold text-violet-400 block mb-1">
                  📊 Slide Deck Maker
                </span>
                <span className="text-slate-400">
                  Generate interactive presentations with structured slides.
                </span>
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg) => <MessageBubble key={msg._id} message={msg} />)
        )}

        {/* Thinking Indicator */}
        {isGenerating && (
          <div className="flex items-center gap-3 py-3 px-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(56,189,248,0.3)] animate-pulse">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="sky-glass rounded-2xl rounded-tl-none px-4 py-3 border border-sky-500/15 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              <span className="text-xs text-slate-300 font-medium">
                LangGraph agent reasoning & executing...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating Bottom Input Area */}
      <ChatInput />
    </div>
  );
};
