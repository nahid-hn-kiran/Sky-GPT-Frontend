"use client";

import React, { useState } from "react";
import { FileUp, X, Check, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { useChat } from "@/context/ChatContext";

interface DocIngestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocIngestModal = ({ isOpen, onClose }: DocIngestModalProps) => {
  const { activeConversation } = useChat();
  const [fileName, setFileName] = useState("company-policy.txt");
  const [content, setContent] = useState(
    `SkyGPT Remote Work Policy 2026:
All core engineering team members are allowed up to 4 days of remote work per week.
Annual learning stipend is $3,000 per engineer for AI certifications and conferences.
Health insurance covers 100% of dental, vision, and wellness subscriptions.`,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleIngest = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    setStatusMessage(null);

    const convId = activeConversation?._id || "default-session";

    try {
      const res = await api.agents.ingestDocument(convId, content.trim(), fileName);
      setStatusMessage(
        `Successfully indexed ${res.chunkCount} chunks into Vector Store!`,
      );
      setTimeout(() => {
        onClose();
        setStatusMessage(null);
      }, 1800);
    } catch (err: any) {
      setStatusMessage(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-sky-500/25 bg-[#0b101c] p-6 shadow-2xl space-y-4"
      >
        <div className="flex items-center justify-between border-b border-sky-500/10 pb-3">
          <div className="flex items-center gap-2">
            <FileUp className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-bold text-slate-100">
              Document & RAG Ingestion Sandbox
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Embed text excerpts or policy documentation using Google{" "}
          <code className="text-sky-300 font-mono">text-embedding-004</code>.
          The <strong>PDF / Doc Agent</strong> will query these chunks via cosine
          similarity.
        </p>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">
            Document Identifier / Name
          </label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-sky-400"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">
            Document Content (Markdown / Plain Text)
          </label>
          <textarea
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none focus:border-sky-400 resize-none leading-relaxed"
          />
        </div>

        {statusMessage && (
          <div
            className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
              statusMessage.startsWith("Error")
                ? "bg-red-950/60 text-red-300 border border-red-800/50"
                : "bg-emerald-950/60 text-emerald-300 border border-emerald-800/50"
            }`}
          >
            {!statusMessage.startsWith("Error") && (
              <Check className="w-4 h-4 shrink-0 text-emerald-400" />
            )}
            <span>{statusMessage}</span>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-sky-500/10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleIngest}
            disabled={isSubmitting || !content.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-xs font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Embedding Chunks...</span>
              </>
            ) : (
              <span>Index in Vector Store</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
