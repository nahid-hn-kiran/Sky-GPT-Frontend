"use client";

import React, { useState } from "react";
import { AppProviders } from "@/context";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { DocIngestModal } from "@/components/modals/DocIngestModal";
import { LoginModal } from "@/components/modals/LoginModal";

const SkyGPTApp = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#070b14] text-slate-100 sky-bg-ambient">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          onOpenDocModal={() => setDocModalOpen(true)}
          onOpenLoginModal={() => setLoginModalOpen(true)}
        />

        {/* Center Chat Feed + Bottom Input */}
        <ChatContainer />
      </div>

      {/* 3. Floating Modals */}
      <DocIngestModal
        isOpen={docModalOpen}
        onClose={() => setDocModalOpen(false)}
      />

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </div>
  );
};

export default function Home() {
  return (
    <AppProviders>
      <SkyGPTApp />
    </AppProviders>
  );
}
