"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Moon, GitCompare, GraduationCap, Menu, X } from "lucide-react";
import useCompareStore from "@/store/useCompareStore";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";

export default function Navbar() {
  const pathname = usePathname();
  const { compareList } = useCompareStore();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoaded, isSignedIn } = useAuth();

  // Load and apply theme preference
  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark" || 
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
    
    setIsDarkMode(isDark);
    if (isDark) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.body.classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.body.classList.add("dark-theme");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Colleges", href: "/colleges" },
    { label: "Rank Predictor", href: "/predictor" },
    { label: "Compare", href: "/compare" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-nav border-b transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-90 transition-opacity">
            <GraduationCap className="h-7 w-7 text-slate-950 dark:text-white" />
            <span className="text-slate-950 dark:text-white font-extrabold tracking-tight">
              CampusIQ
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-slate-950 dark:hover:text-white ${
                    isActive
                      ? "text-slate-950 dark:text-white border-b-2 border-slate-950 dark:border-white py-1"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Utility Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Compare Badge */}
            <Link
              href="/compare"
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-250 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors"
            >
              <GitCompare className="h-4 w-4" />
              <span>Compare</span>
              {compareList.length > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-950 text-[10px] font-bold">
                  {compareList.length}
                </span>
              )}
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300 shrink-0"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Auth controls */}
            {isLoaded && !isSignedIn && (
              <SignInButton mode="modal">
                <button className="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white dark:bg-white dark:hover:bg-slate-200 dark:text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm shrink-0">
                  Sign In
                </button>
              </SignInButton>
            )}
            {isLoaded && isSignedIn && (
              <div className="flex items-center shrink-0">
                <UserButton />
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3 flex flex-col gap-3">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-100 dark:bg-slate-800 text-primary"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="h-[1px] bg-slate-100 dark:bg-slate-800 my-1" />
          <Link
            href="/compare"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
          >
            <span className="flex items-center gap-2">
              <GitCompare className="h-4 w-4" />
              Compare Colleges
            </span>
            {compareList.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-950 text-xs font-semibold">
                {compareList.length}
              </span>
            )}
          </Link>

          <div className="h-[1px] bg-slate-100 dark:bg-slate-800 my-1" />
          
          {isLoaded && !isSignedIn && (
            <SignInButton mode="modal">
              <button className="w-full text-center py-2 bg-slate-900 hover:bg-black text-white dark:bg-white dark:hover:bg-slate-200 dark:text-slate-950 text-sm font-bold rounded-lg transition-colors cursor-pointer shadow-sm">
                Sign In
              </button>
            </SignInButton>
          )}
          {isLoaded && isSignedIn && (
            <div className="flex items-center gap-3 px-3 py-1">
              <UserButton />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">My Account</span>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
