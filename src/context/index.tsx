"use client";

import React from "react";
import { AuthProvider } from "./AuthContext";
import { ChatProvider } from "./ChatContext";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <ChatProvider>{children}</ChatProvider>
    </AuthProvider>
  );
};
