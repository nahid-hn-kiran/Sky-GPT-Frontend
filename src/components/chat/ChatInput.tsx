"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowUp, Paperclip, X, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { api } from "@/lib/api";
import { formatFileSize, parseUploadedFile, ParsedFile } from "@/lib/file-parser";
import { AgentSelector } from "./AgentSelector";

interface ChatInputProps {
  externalFile?: File | null;
  onClearExternalFile?: () => void;
}

export const ChatInput = ({ externalFile, onClearExternalFile }: ChatInputProps) => {
  const { sendMessage, isGenerating, activeConversation, setSelectedAgent } = useChat();
  const [content, setContent] = useState("");
  const [attachedFile, setAttachedFile] = useState<ParsedFile | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [content]);

  // Handle external drop file
  useEffect(() => {
    if (externalFile) {
      handleFileSelected(externalFile);
      if (onClearExternalFile) onClearExternalFile();
    }
  }, [externalFile]);

  // Process chosen file
  const handleFileSelected = async (file: File) => {
    setIsProcessingFile(true);
    try {
      const parsed = await parseUploadedFile(file);
      setAttachedFile(parsed);

      // If a document is attached, automatically index it into conversation memory
      if (!parsed.isImage && parsed.content.length > 20) {
        const convId = activeConversation?._id || "default-session";
        await api.agents.ingestDocument(convId, parsed.content, parsed.name);
        // Automatically switch agent to Document Analyst
        setSelectedAgent("pdf");
      }
    } catch (err) {
      console.error("[File processing failed]:", err);
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelected(file);
    }
    // reset input value so re-selecting same file triggers change
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async () => {
    if ((!content.trim() && !attachedFile) || isGenerating) return;

    let finalPrompt = content.trim();

    if (attachedFile) {
      if (attachedFile.isImage) {
        finalPrompt = `${finalPrompt}\n\n[Context: User attached image ${attachedFile.name}]`.trim();
      } else {
        finalPrompt = `${finalPrompt}\n\n(Referencing attached document: ${attachedFile.name})`.trim();
      }
    }

    setContent("");
    setAttachedFile(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    await sendMessage(finalPrompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4">
      {/* 1. Floating Agent Selector */}
      <AgentSelector />

      {/* 2. Chat Input Container */}
      <div className="relative mt-2 rounded-2xl border border-sky-500/20 bg-[#0d1527]/90 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] focus-within:border-sky-400/50 transition-all p-3">
        {/* Hidden file input supporting documents and images */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,.md,.json,.png,.jpg,.jpeg,.webp"
          onChange={handleInputChange}
          className="hidden"
        />

        {/* Attached File Preview Chip */}
        {attachedFile && (
          <div className="mb-2.5 flex items-center gap-2 p-2 rounded-xl bg-slate-900/90 border border-sky-500/30 w-fit max-w-full">
            {attachedFile.isImage ? (
              <div className="w-7 h-7 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-sky-500/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={attachedFile.previewUrl}
                  alt={attachedFile.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
            )}

            <div className="overflow-hidden pr-2">
              <p className="text-xs font-semibold text-slate-200 truncate max-w-[240px]">
                {attachedFile.name}
              </p>
              <p className="text-[10px] text-slate-400">
                {formatFileSize(attachedFile.size)} • Ready for analysis
              </p>
            </div>

            <button
              onClick={() => setAttachedFile(null)}
              className="p-1 text-slate-400 hover:text-white rounded-md transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Text Input Area */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            attachedFile
              ? `Ask a question about ${attachedFile.name}...`
              : "Ask SkyGPT anything, or attach a document or photo..."
          }
          disabled={isGenerating}
          className="w-full resize-none bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none max-h-40 overflow-y-auto leading-relaxed"
        />

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-between pt-2 mt-1 border-t border-sky-500/10">
          <div className="flex items-center gap-2">
            {/* Attachment Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isGenerating || isProcessingFile}
              title="Attach Document (.pdf, .txt, .md) or Image (.png, .jpg)"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-sky-300 hover:bg-slate-800/60 transition-colors text-xs font-medium cursor-pointer disabled:opacity-40"
            >
              {isProcessingFile ? (
                <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
              ) : (
                <Paperclip className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Attach</span>
            </button>

            <span className="text-[11px] text-slate-500 font-medium">
              Supports PDFs, Docs, Photos
            </span>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={(!content.trim() && !attachedFile) || isGenerating}
            className="p-2 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md cursor-pointer shrink-0"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
