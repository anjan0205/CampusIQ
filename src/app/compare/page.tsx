"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { GitCompare, ArrowRight, BookOpen, Trash2, AlertCircle } from "lucide-react";
import useCompareStore from "@/store/useCompareStore";
import CompareTable from "@/components/CompareTable";
import { useToast } from "@/context/ToastContext";

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useCompareStore();
  const { success } = useToast();

  const collegeIds = compareList.map((c) => c.id);

  // Fetch full details of the compared colleges using TanStack Query
  const { data, isLoading, error } = useQuery({
    queryKey: ["compare-details", collegeIds],
    queryFn: async () => {
      if (collegeIds.length === 0) return { success: true, data: [] };
      const res = await fetch(`/api/compare?ids=${collegeIds.join(",")}`);
      if (!res.ok) {
        throw new Error("Failed to fetch comparison details");
      }
      return res.json();
    },
    enabled: collegeIds.length > 0
  });

  const detailedColleges = data?.data || [];

  const handleRemove = (id: string) => {
    const colName = compareList.find(c => c.id === id)?.name || "College";
    removeFromCompare(id);
    success(`Removed "${colName}" from comparison.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <GitCompare className="h-8 w-8 text-primary" />
            <span>Compare Colleges</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Analyze fees structure, rating, reviews, and average placements side-by-side.
          </p>
        </div>

        {compareList.length > 0 && (
          <button
            onClick={() => {
              clearCompare();
              success("Cleared comparison list.");
            }}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 hover:border-red-300 hover:text-red-600 rounded-lg text-xs font-semibold text-slate-500 dark:text-slate-450 bg-white/50 dark:bg-slate-900/50 transition-colors shrink-0 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear Comparison</span>
          </button>
        )}
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 p-8 bg-white dark:bg-slate-900">
          <div className="flex justify-between items-center gap-4 mb-6">
            <div className="h-6 w-36 rounded bg-slate-200 dark:bg-slate-800 shimmer" />
            <div className="flex gap-4">
              <div className="h-20 w-32 rounded bg-slate-200 dark:bg-slate-800 shimmer" />
              <div className="h-20 w-32 rounded bg-slate-200 dark:bg-slate-800 shimmer" />
              <div className="h-20 w-32 rounded bg-slate-200 dark:bg-slate-800 shimmer" />
            </div>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-10 w-full rounded bg-slate-100 dark:bg-slate-900 shimmer" />
            ))}
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6 text-center max-w-md mx-auto my-12 dark:border-red-950 dark:bg-slate-950/20">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-3" />
          <h3 className="font-bold text-red-900 dark:text-red-400">Error Loading Comparison</h3>
          <p className="text-xs text-red-700 dark:text-red-500 mt-2">
            Failed to query college details for comparison. Please refresh the page.
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && compareList.length === 0 && (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 p-16 text-center max-w-xl mx-auto my-12 shadow-sm">
          <GitCompare className="h-14 w-14 text-slate-400 dark:text-slate-650 mx-auto mb-5" />
          <h3 className="font-bold text-slate-900 dark:text-white text-lg">No Colleges Selected for Comparison</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
            You haven't added any colleges to compare. Browse our college lists, add up to 3 institutions of interest, and compare their courses, fees structures, and package reports side-by-side.
          </p>
          <Link
            href="/colleges"
            className="mt-8 inline-flex items-center justify-center gap-1.5 px-6 py-3 bg-primary hover:bg-primary-hover text-white dark:text-slate-950 text-xs font-bold rounded-lg cursor-pointer hover-lift shadow transition-all"
          >
            <span>Explore Colleges</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Comparison Matrix Grid */}
      {!isLoading && !error && compareList.length > 0 && (
        <div className="space-y-6">
          <CompareTable
            colleges={detailedColleges.length > 0 ? detailedColleges : compareList}
            onRemove={handleRemove}
          />
          
          <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50 text-xs text-slate-500">
            <span>* Comparison table includes verified data from historical student listings.</span>
            <Link href="/colleges" className="text-primary font-bold hover:underline">
              Add more colleges
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
