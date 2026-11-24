"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  language?: string;
  code: string;
}

export const CodeBlock = ({ language = "typescript", code }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-sky-500/20 bg-[#06090e] shadow-lg">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-sky-500/10 text-xs font-mono text-slate-400">
        <span className="text-sky-400 font-semibold uppercase">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs font-mono leading-relaxed text-slate-200">
        <code>{code}</code>
      </pre>
    </div>
  );
};
