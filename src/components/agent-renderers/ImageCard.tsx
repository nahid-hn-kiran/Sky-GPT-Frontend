"use client";

import React, { useState } from "react";
import { Download, ExternalLink, Maximize2, X, Check, Loader2 } from "lucide-react";

interface ImageCardProps {
  src: string;
  alt?: string;
}

export const ImageCard = ({ src, alt = "Generated Visual" }: ImageCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // Directly download image to disk
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsDownloading(true);
      const res = await fetch(src);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `skygpt-image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
    } catch (err) {
      console.error("[Image Download Error]:", err);
      // Fallback: open image in new tab if CORS prevents blob download
      window.open(src, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <div className="relative group my-4 max-w-lg rounded-2xl overflow-hidden border border-sky-400/25 bg-slate-900/60 shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-all">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="w-full h-auto object-cover rounded-xl transition-transform duration-300 group-hover:scale-[1.01]"
          loading="lazy"
        />

        {/* Floating Action Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
          <span className="text-xs font-medium text-slate-200 truncate pr-2">
            {alt}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              title="Download Image"
              className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-sky-600 text-white transition-colors cursor-pointer flex items-center gap-1 text-xs"
            >
              {isDownloading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : downloaded ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Fullscreen Preview */}
            <button
              onClick={() => setIsOpen(true)}
              title="Fullscreen Preview"
              className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-sky-600 text-white transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            {/* Open Original Link */}
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              title="Open Original"
              className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-sky-600 text-white transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div
            className="relative max-w-4xl max-h-[90vh] overflow-hidden flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Modal Toolbar */}
            <div className="w-full flex items-center justify-end gap-2 mb-2">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-sky-500/30 text-white hover:bg-sky-600 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
              >
                {isDownloading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : downloaded ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-[80vh] rounded-xl object-contain shadow-2xl border border-sky-500/20"
            />
          </div>
        </div>
      )}
    </>
  );
};
