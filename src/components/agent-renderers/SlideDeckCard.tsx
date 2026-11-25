"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Presentation,
  Download,
  Loader2,
} from "lucide-react";
import pptxgen from "pptxgenjs";

interface Slide {
  slideNumber?: number;
  title: string;
  bullets?: string[];
  speakerNotes?: string;
}

interface SlideDeckProps {
  title?: string;
  slides: Slide[];
}

export const SlideDeckCard = ({
  title = "Presentation Deck",
  slides,
}: SlideDeckProps) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  if (!slides || slides.length === 0) return null;

  const currentSlide = slides[currentIdx];

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
  };

  // Generate real PowerPoint .pptx file
  const handleExportPPTX = async () => {
    try {
      setIsExporting(true);
      const pres = new pptxgen();

      // Set Presentation Properties
      pres.title = title;
      pres.layout = "LAYOUT_16x9";

      // Loop through slides and build pages with elegant dark theme
      slides.forEach((s) => {
        const slide = pres.addSlide();

        // Dark background
        slide.background = { color: "070B14" };

        // Slide Title (Sky Blue)
        slide.addText(s.title, {
          x: 0.8,
          y: 0.8,
          w: "85%",
          h: 0.8,
          fontSize: 26,
          bold: true,
          color: "38BDF8",
          fontFace: "Arial",
        });

        // Bullet Points
        if (s.bullets && s.bullets.length > 0) {
          const bulletItems = s.bullets.map((b) => ({
            text: b,
            options: {
              bullet: true,
              fontSize: 15,
              color: "E2E8F0",
              breakLine: true,
            },
          }));

          slide.addText(bulletItems, {
            x: 0.8,
            y: 1.8,
            w: "85%",
            h: 3.5,
            lineSpacing: 28,
            fontFace: "Arial",
          });
        }

        // Speaker Notes
        if (s.speakerNotes) {
          slide.addNotes(s.speakerNotes);
        }
      });

      // Save and trigger browser download
      const safeTitle = title.replace(/[^a-zA-Z0-9_-]/g, "_");
      await pres.writeFile({ fileName: `${safeTitle}.pptx` });
    } catch (err) {
      console.error("[Failed to export PPTX]:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="my-4 rounded-2xl overflow-hidden border border-indigo-500/30 bg-gradient-to-br from-[#0c1322] to-[#121c33] shadow-xl">
      {/* Header bar with Export Button */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-indigo-500/20 bg-slate-950/60">
        <div className="flex items-center gap-2 overflow-hidden">
          <Presentation className="w-4 h-4 text-indigo-400 shrink-0" />
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider truncate">
            {title}
          </h4>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportPPTX}
            disabled={isExporting}
            title="Download as PowerPoint (.pptx)"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-600/80 hover:bg-indigo-500 text-white text-[11px] font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isExporting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>Export .pptx</span>
          </button>

          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Slide {currentIdx + 1} of {slides.length}
          </span>
        </div>
      </div>

      {/* Slide Canvas */}
      <div className="p-6 min-h-[220px] flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-sky-200 mb-4 tracking-tight">
            {currentSlide.title}
          </h3>

          {currentSlide.bullets && currentSlide.bullets.length > 0 && (
            <ul className="space-y-2 mb-4">
              {currentSlide.bullets.map((bullet, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-slate-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 shrink-0" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Speaker Notes */}
        {currentSlide.speakerNotes && (
          <div className="mt-4 p-3 rounded-lg bg-slate-900/70 border border-slate-800 text-xs text-slate-400 italic">
            <strong className="not-italic text-slate-300">
              Speaker Notes:{" "}
            </strong>
            {currentSlide.speakerNotes}
          </div>
        )}
      </div>

      {/* Slide Navigation Footer */}
      <div className="flex items-center justify-between px-5 py-2.5 border-t border-indigo-500/10 bg-slate-950/40">
        <button
          onClick={handlePrev}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        {/* Dot Indicators */}
        <div className="flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIdx(i)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                currentIdx === i
                  ? "w-5 bg-sky-400"
                  : "w-1.5 bg-slate-700 hover:bg-slate-600"
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
