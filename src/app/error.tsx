"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw, ChevronRight } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an analytics service
    console.error("ErrorBoundary caught an issue:", error);
  }, [error]);

  return (
    <div className="max-w-md mx-auto my-20 p-8 rounded-3xl border border-red-200 dark:border-red-950 bg-white/70 dark:bg-slate-900/70 text-center shadow-xl backdrop-blur-md">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900 mb-6">
        <AlertTriangle className="h-6 w-6 text-red-500" />
      </div>
      
      <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Something went wrong!</h1>
      <p className="text-sm text-slate-500 dark:text-slate-405 mt-3 leading-relaxed">
        An unexpected error occurred during rendering. If the issue persists, please try refreshing or return to the main dashboard.
      </p>

      <div className="flex flex-col gap-3 mt-8">
        <button
          onClick={() => reset()}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-primary hover:bg-primary-hover text-white dark:text-slate-950 text-xs font-bold rounded-lg shadow hover-lift transition-all cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Try Again</span>
        </button>
        
        <Link
          href="/"
          className="w-full py-2.5 border border-slate-200 dark:border-slate-800 hover:border-slate-350 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg transition-colors cursor-pointer"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
