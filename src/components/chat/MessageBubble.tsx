"use client";

import React, { useMemo } from "react";
import { marked } from "marked";
import { User as UserIcon, Bot, Sparkles } from "lucide-react";
import { Message } from "@/types";
import { cn } from "@/lib/utils";
import { CodeBlock } from "../agent-renderers/CodeBlock";
import { ImageCard } from "../agent-renderers/ImageCard";
import { SlideDeckCard } from "../agent-renderers/SlideDeckCard";

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === "user";

  // 1. Check if the message contains structured presentation JSON
  const slideDeckData = useMemo(() => {
    if (isUser) return null;
    const jsonMatch = message.content.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (parsed.slides && Array.isArray(parsed.slides)) {
          return parsed;
        }
      } catch {
        // Not a slide deck
      }
    }
    return null;
  }, [message.content, isUser]);

  // 2. Check if the message contains an image URL (markdown or direct)
  const imageUrl = useMemo(() => {
    if (isUser) return null;
    const imgMatch = message.content.match(/!\[.*?\]\((https?:\/\/.*?)\)/);
    if (imgMatch && imgMatch[1]) {
      return imgMatch[1];
    }
    const directMatch = message.content.match(/(https:\/\/image\.pollinations\.ai\/prompt\/[^\s)]+)/);
    if (directMatch && directMatch[1]) {
      return directMatch[1];
    }
    return null;
  }, [message.content, isUser]);

  // 3. Render general Markdown content safely
  const renderedHtml = useMemo(() => {
    if (isUser) return null;
    // Configure marked for clean inline rendering
    return marked.parse(message.content, { async: false }) as string;
  }, [message.content, isUser]);

  return (
    <div
      className={cn(
        "flex w-full gap-3 py-4 px-2 sm:px-4 transition-colors",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      {/* Bot Icon */}
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(56,189,248,0.3)] mt-0.5">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Message Card */}
      <div
        className={cn(
          "max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-gradient-to-br from-sky-600 to-blue-700 text-white rounded-tr-none shadow-md"
            : "sky-glass text-slate-100 rounded-tl-none border border-sky-500/15",
        )}
      >
        {/* Assistant Header: Agent used tag */}
        {!isUser && message.agentUsed && (
          <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-sky-500/10">
            <Sparkles className="w-3 h-3 text-sky-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
              {message.agentUsed} Agent
            </span>
          </div>
        )}

        {/* User Content */}
        {isUser && <p className="whitespace-pre-wrap">{message.content}</p>}

        {/* AI Assistant Content */}
        {!isUser && (
          <div className="space-y-3">
            {/* If PPT Agent generated a deck */}
            {slideDeckData && (
              <SlideDeckCard
                title={slideDeckData.title}
                slides={slideDeckData.slides}
              />
            )}

            {/* If Image Agent generated an image */}
            {imageUrl && <ImageCard src={imageUrl} />}

            {/* Standard Markdown Body */}
            <div
              className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent"
              dangerouslySetInnerHTML={{ __html: renderedHtml || "" }}
            />
          </div>
        )}
      </div>

      {/* User Icon */}
      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
          <UserIcon className="w-4 h-4 text-sky-400" />
        </div>
      )}
    </div>
  );
};
