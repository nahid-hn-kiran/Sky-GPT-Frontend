"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "../lib/api";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginEmail: (email: string, pass: string) => Promise<void>;
  loginSocial: (provider: "google" | "github" | "facebook") => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const session = await api.auth.getSession();
      if (session && session.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const loginEmail = async (email: string, pass: string) => {
    await api.auth.signInEmail(email, pass);
    await refreshSession();
  };

  const loginSocial = async (provider: "google" | "github" | "facebook") => {
    const res = await api.auth.signInSocial(provider);
    if (res.url) {
      window.location.href = res.url;
    }
  };

  const logout = async () => {
    await api.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        loginEmail,
        loginSocial,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
