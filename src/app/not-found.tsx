"use client";

import React from "react";
import Link from "next/link";
import { HelpCircle, ChevronRight, GraduationCap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto my-20 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-center shadow-xl backdrop-blur-md">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-6">
        <HelpCircle className="h-6 w-6 text-slate-900 dark:text-white" />
      </div>
      
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">404</h1>
      <h2 className="text-lg font-bold text-slate-850 dark:text-slate-200 mt-2">Page Not Found</h2>
      
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">
        Oops! The page you are looking for does not exist or has been moved. Use the options below to get back on track.
      </p>

      <div className="flex flex-col gap-3 mt-8">
        <Link
          href="/"
          className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-primary hover:bg-primary-hover text-white dark:text-slate-950 text-xs font-bold rounded-lg shadow hover-lift transition-all cursor-pointer"
        >
          <span>Go to Home</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
        
        <Link
          href="/colleges"
          className="w-full py-2.5 border border-slate-200 dark:border-slate-800 hover:border-slate-350 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg transition-colors cursor-pointer"
        >
          Browse College Directories
        </Link>
      </div>
    </div>
  );
}
