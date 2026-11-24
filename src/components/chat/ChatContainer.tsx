"use client";

import React, { useEffect, useRef, useState } from "react";
import { Sparkles, Bot, UploadCloud } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";

export const ChatContainer = () => {
  const { activeConversation, isGenerating, setSelectedAgent } = useChat();
  const [isDragging, setIsDragging] = useState(false);
  const [droppedFile, setDroppedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = activeConversation?.messages || [];

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  // Drag and drop listeners
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setDroppedFile(file);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="flex-1 flex flex-col h-full overflow-hidden bg-transparent relative"
    >
      {/* Sleek Frosted Drag-and-Drop Overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-[#070b14]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 border-2 border-dashed border-sky-400 rounded-2xl m-4 animate-in fade-in duration-200">
          <div className="w-16 h-16 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(56,189,248,0.3)]">
            <UploadCloud className="w-8 h-8 animate-bounce" />
          </div>
          <h3 className="text-lg font-bold text-slate-100 mb-1">
            Drop your file here
          </h3>
          <p className="text-sm text-slate-400">
            Upload PDFs, documents, notes, or images to analyze with SkyGPT
          </p>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-6 py-6 space-y-2">
        {messages.length === 0 ? (
          /* Empty State / Welcome Screen */
          <div className="h-full flex flex-col items-center justify-center text-center px-4 py-8 max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-[0_0_30px_rgba(56,189,248,0.4)] mb-4">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight mb-2">
              SkyGPT Assistant
            </h2>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Your autonomous AI companion. Choose a specialized mode below, attach a file, or ask any question.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
              <button
                onClick={() => setSelectedAgent("search")}
                className="p-3.5 rounded-xl sky-glass border border-sky-500/15 hover:border-sky-400/40 transition-all text-left group cursor-pointer"
              >
                <span className="font-bold text-sky-400 block mb-1 group-hover:text-sky-300">
                  🔍 Live Web Research
                </span>
                <span className="text-xs text-slate-400">
                  Search live breaking news, current events, and facts with citations.
                </span>
              </button>

              <button
                onClick={() => setSelectedAgent("coding")}
                className="p-3.5 rounded-xl sky-glass border border-sky-500/15 hover:border-sky-400/40 transition-all text-left group cursor-pointer"
              >
                <span className="font-bold text-blue-400 block mb-1 group-hover:text-blue-300">
                  💻 Code Specialist
                </span>
                <span className="text-xs text-slate-400">
                  Write, debug, refactor, and review code with complexity analysis.
                </span>
              </button>

              <button
                onClick={() => setSelectedAgent("pdf")}
                className="p-3.5 rounded-xl sky-glass border border-sky-500/15 hover:border-sky-400/40 transition-all text-left group cursor-pointer"
              >
                <span className="font-bold text-teal-400 block mb-1 group-hover:text-teal-300">
                  📄 Document Analysis
                </span>
                <span className="text-xs text-slate-400">
                  Attach contracts, PDFs, or policies to ask specific questions.
                </span>
              </button>

              <button
                onClick={() => setSelectedAgent("ppt")}
                className="p-3.5 rounded-xl sky-glass border border-sky-500/15 hover:border-sky-400/40 transition-all text-left group cursor-pointer"
              >
                <span className="font-bold text-violet-400 block mb-1 group-hover:text-violet-300">
                  📊 Slide Deck Maker
                </span>
                <span className="text-xs text-slate-400">
                  Turn ideas or outlines into interactive presentation slides.
                </span>
              </button>
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
                SkyGPT is thinking...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating Bottom Input Area */}
      <ChatInput
        externalFile={droppedFile}
        onClearExternalFile={() => setDroppedFile(null)}
      />
    </div>
  );
};
