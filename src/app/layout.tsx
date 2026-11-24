import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkyGPT — Multi-Agent AI Platform",
  description: "Autonomous Multi-Agent AI Platform powered by LangGraph, Better Auth, and Google Gemini.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#070b14] text-slate-100 sky-bg-ambient selection:bg-sky-500/30 selection:text-sky-200">
        {children}
      </body>
    </html>
  );
}
