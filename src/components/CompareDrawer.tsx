"use client";

import React from "react";
import Link from "next/link";
import { GitCompare, X, Trash2, ArrowRight } from "lucide-react";
import useCompareStore from "@/store/useCompareStore";

export default function CompareDrawer() {
  const { compareList, removeFromCompare, clearCompare } = useCompareStore();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-md animate-slide-up transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left Info Column */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <GitCompare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                Compare Colleges ({compareList.length} of 3)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Compare placements, fees, rating, and rankings side-by-side.
              </p>
            </div>
          </div>

          {/* Middle: Selected College Mini Cards */}
          <div className="flex flex-wrap justify-center items-center gap-3 my-2 md:my-0">
            {compareList.map((col) => (
              <div
                key={col.id}
                className="flex items-center gap-2 pl-2 pr-1.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors shadow-sm"
              >
                <img
                  src={col.image}
                  alt={col.name}
                  className="h-6 w-8 rounded object-cover"
                />
                <span className="truncate max-w-[120px] sm:max-w-[180px]">{col.name}</span>
                <button
                  onClick={() => removeFromCompare(col.id)}
                  className="p-0.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  title="Remove from comparison"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}

            {compareList.length < 3 && (
              <div className="hidden lg:flex items-center justify-center border border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-2 h-9 text-slate-400 dark:text-slate-500 text-xs font-medium px-4">
                Add {3 - compareList.length} more
              </div>
            )}
          </div>

          {/* Right: Actions Column */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={clearCompare}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear</span>
            </button>
            
            <Link
              href="/compare"
              className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white dark:text-slate-950 text-xs font-bold rounded-lg hover-lift shadow-md transition-colors w-full md:w-auto text-center"
            >
              <span>Compare Now</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

        </div>
      </div>

      <style jsx global>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
