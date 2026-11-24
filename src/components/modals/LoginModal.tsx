"use client";

import React, { useState } from "react";
import { LogIn, X, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const { loginEmail, loginSocial } = useAuth();
  const [email, setEmail] = useState("admin@skygpt.com");
  const [password, setPassword] = useState("AdminSecurePassword123!");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await loginEmail(email.trim(), password);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-sky-500/25 bg-[#0b101c] p-6 shadow-2xl space-y-5"
      >
        <div className="flex items-center justify-between border-b border-sky-500/10 pb-3">
          <div className="flex items-center gap-2">
            <LogIn className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-bold text-slate-100">
              Sign In to SkyGPT
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-lg text-xs font-medium bg-red-950/60 text-red-300 border border-red-800/50">
            {errorMessage}
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleEmailLogin} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-sky-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-sky-400"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-semibold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In with Email</span>
            )}
          </button>
        </form>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-[#0b101c] px-2 text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
            Or OAuth 2.0
          </span>
          <div className="border-t border-slate-800 w-full" />
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => loginSocial("google")}
            className="py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs text-slate-200 font-medium transition-colors cursor-pointer"
          >
            Google
          </button>
          <button
            type="button"
            onClick={() => loginSocial("github")}
            className="py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs text-slate-200 font-medium transition-colors cursor-pointer"
          >
            GitHub
          </button>
        </div>
      </div>
    </div>
  );
};
