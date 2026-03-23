"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Failed to login. Please check your credentials.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="antialiased selection:bg-zinc-800 selection:text-white flex min-h-screen items-center justify-center overflow-hidden text-zinc-100 bg-black pt-6 pr-6 pb-6 pl-6 relative">
      <style dangerouslySetInnerHTML={{ __html: `
        body {
            font-family: 'Inter', sans-serif;
        }
        /* Hide scrollbar for clean look */
        ::-webkit-scrollbar {
            display: none;
        }
      `}} />


      {/* Centered Glass Login Container */}
      <div className="w-full max-w-[420px] relative z-10 bg-zinc-900/50 backdrop-blur-2xl ring-1 ring-white/10 shadow-[0_8px_40px_rgb(0,0,0,0.4)] rounded-3xl p-8 sm:p-10">
          
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="flex text-zinc-950 bg-white w-8 h-8 rounded shadow-sm items-center justify-center">
            <Icon icon="solar:rocket-linear" strokeWidth="1.5" className="text-lg" />
          </div>
          <span style={{ fontFamily: "'Outfit', sans-serif" }} className="font-semibold tracking-tighter text-xl text-white uppercase">Galaxy Boosts</span>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-white">Log in to your account</h1>
          <p className="mt-2 text-sm text-zinc-400">Enter your credentials to access your store.</p>
        </div>

        {/* Form */}
        <div className="mt-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-md text-center">
                {error}
              </div>
            )}
              
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300">Email address</label>
              <div className="mt-1.5 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <Icon icon="solar:letter-linear" strokeWidth="1.5" className="text-lg" />
                </div>
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  autoComplete="email" 
                  required 
                  className="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-sm text-white ring-1 ring-inset ring-white/10 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-white shadow-sm transition-all duration-200 bg-zinc-950/50 backdrop-blur-sm focus:bg-zinc-900 disabled:opacity-50" 
                  placeholder="admin@galaxyboosts.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300">Password</label>
              <div className="mt-1.5 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <Icon icon="solar:lock-password-linear" strokeWidth="1.5" className="text-lg" />
                </div>
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  autoComplete="current-password" 
                  required 
                  className="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-sm text-white ring-1 ring-inset ring-white/10 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-white shadow-sm transition-all duration-200 bg-zinc-950/50 backdrop-blur-sm focus:bg-zinc-900 disabled:opacity-50" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Options Row */}
            <div className="flex items-center justify-between mt-4">
              {/* Custom Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center w-4 h-4">
                  <input id="remember-me" name="remember-me" type="checkbox" className="peer sr-only" disabled={isLoading} />
                  <div className="w-4 h-4 border border-zinc-700 rounded peer-checked:bg-white peer-checked:border-white transition-all duration-200 bg-zinc-950/50 backdrop-blur-sm"></div>
                  <Icon icon="solar:check-read-linear" strokeWidth="1.5" className="absolute text-zinc-950 text-xs opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-200" />
                </div>
                <span className="text-sm text-zinc-400 group-hover:text-white transition-colors duration-200">Remember me</span>
              </label>

              <div className="text-sm">
                <a href="#" className="font-medium text-zinc-400 hover:text-white transition-colors duration-200">Forgot password?</a>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isLoading}
                className="flex w-full justify-center items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-zinc-950 shadow-sm hover:bg-zinc-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Sign in"}
                {!isLoading && <Icon icon="solar:arrow-right-linear" strokeWidth="1.5" className="text-base" />}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-white/10"></div>
            </div>
          </div>

          {/* SSO Buttons */}
          <div className="mt-6 grid grid-cols-2 gap-3">
          </div>
        </div>
      </div>
    </div>
  );
}
