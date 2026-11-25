"use client";

import React, { useMemo, useState } from "react";
import { marked } from "marked";
import {
  User as UserIcon,
  Bot,
  Sparkles,
  Download,
  FileText,
  Loader2,
  Check,
  Copy,
  ExternalLink,
} from "lucide-react";
import { jsPDF } from "jspdf";
import { Message } from "@/types";
import { cn } from "@/lib/utils";
import { ImageCard } from "../agent-renderers/ImageCard";
import { SlideDeckCard } from "../agent-renderers/SlideDeckCard";

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === "user";
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfExported, setPdfExported] = useState(false);
  const [copied, setCopied] = useState(false);

  // Copy assistant response text to clipboard
  const handleCopyText = async () => {
    try {
      // Strip markdown code fences or raw JSON for clean clipboard pasting
      const textToCopy = message.content;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("[Copy text failed]:", err);
    }
  };

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

  // 2. Check if the message contains an image URL
  const imageUrl = useMemo(() => {
    if (isUser) return null;
    const imgMatch = message.content.match(/!\[.*?\]\((https?:\/\/.*?)\)/);
    if (imgMatch && imgMatch[1]) {
      return imgMatch[1];
    }
    const directMatch = message.content.match(
      /(https:\/\/image\.pollinations\.ai\/prompt\/[^\s)]+)/,
    );
    if (directMatch && directMatch[1]) {
      return directMatch[1];
    }
    return null;
  }, [message.content, isUser]);

  // 3. Render general Markdown content safely
  const renderedHtml = useMemo(() => {
    if (isUser) return null;
    return marked.parse(message.content, { async: false }) as string;
  }, [message.content, isUser]);

  // Export response as a styled PDF document
  const handleExportPDF = async () => {
    try {
      setIsExportingPdf(true);
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Header branding
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(2, 132, 199); // Sky blue
      doc.text("SkyGPT AI Report", 14, 20);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text(
        `Generated on ${new Date().toLocaleString()} • ${message.agentUsed || "SkyGPT"} Agent`,
        14,
        26,
      );

      // Dividing line
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.4);
      doc.line(14, 30, 196, 30);

      // Clean plain text body from markdown
      const cleanText = message.content
        .replace(/```[\s\S]*?```/g, "[Code Block]")
        .replace(/#+\s/g, "")
        .replace(/\*\*/g, "")
        .replace(/\[(.*?)\]\(.*?\)/g, "$1");

      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42); // Dark slate
      const splitText = doc.splitTextToSize(cleanText, 180);
      doc.text(splitText, 14, 38);

      // Save PDF
      doc.save("skygpt-response.pdf");
      setPdfExported(true);
      setTimeout(() => setPdfExported(false), 2000);
    } catch (err) {
      console.error("[PDF Export Error]:", err);
    } finally {
      setIsExportingPdf(false);
    }
  };

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
        {/* Assistant Header: Agent used tag & Actions (Copy, Export PDF) */}
        {!isUser && (
          <div className="flex items-center justify-between gap-1.5 mb-2 pb-1.5 border-b border-sky-500/10">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-sky-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                {message.agentUsed || "SkyGPT"} Agent
              </span>
            </div>

            {/* Micro Action Buttons */}
            <div className="flex items-center gap-1.5">
              {/* Copy Response Button */}
              <button
                onClick={handleCopyText}
                title="Copy Response"
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-sky-300 transition-colors cursor-pointer px-1.5 py-0.5 rounded hover:bg-sky-500/10"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              {/* One-Click PDF Export */}
              <button
                onClick={handleExportPDF}
                disabled={isExportingPdf}
                title="Download Response as PDF"
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-sky-300 transition-colors cursor-pointer px-1.5 py-0.5 rounded hover:bg-sky-500/10"
              >
                {isExportingPdf ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : pdfExported ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Saved</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-3 h-3" />
                    <span>PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* User Attached Image (if user uploaded an image) */}
        {isUser && message.imageUrl && (
          <div className="mb-2 max-w-xs rounded-xl overflow-hidden border border-white/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={message.imageUrl}
              alt="Uploaded context"
              className="w-full h-auto object-cover max-h-48"
            />
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
