"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Grid, List, Search, SlidersHorizontal, BookOpen, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import FilterSidebar from "@/components/FilterSidebar";
import CollegeCard from "@/components/CollegeCard";

// Custom hook to debounce filter changes
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function CollegesPage() {
  // Filters state
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    course: "",
    maxFees: "",
    ownershipType: "",
    sortBy: "rating",
    minRating: "",
    page: 1
  });

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Debounce search string only to prevent API abuse
  const debouncedSearch = useDebounce(filters.search, 400);

  // Fetch colleges list using TanStack Query
  const { data, isLoading, error } = useQuery({
    queryKey: [
      "colleges",
      debouncedSearch,
      filters.location,
      filters.course,
      filters.maxFees,
      filters.ownershipType,
      filters.sortBy,
      filters.page
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (debouncedSearch) queryParams.append("search", debouncedSearch);
      if (filters.location) queryParams.append("location", filters.location);
      if (filters.course) queryParams.append("course", filters.course);
      if (filters.maxFees) queryParams.append("maxFees", filters.maxFees);
      if (filters.ownershipType) queryParams.append("ownershipType", filters.ownershipType);
      if (filters.sortBy) queryParams.append("sortBy", filters.sortBy);
      queryParams.append("page", filters.page.toString());
      queryParams.append("limit", "9"); // 9 items per page

      const res = await fetch(`/api/colleges?${queryParams.toString()}`);
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    }
  });

  // Automatically reset page to 1 when search parameters change (except page changes)
  useEffect(() => {
    setFilters((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearch, filters.location, filters.course, filters.maxFees, filters.ownershipType, filters.sortBy]);

  const colleges = data?.data || [];
  const pagination = data?.pagination || { page: 1, limit: 9, totalCount: 0, totalPages: 1 };
  
  // Available metadata for filters list
  const availableLocations = data?.metadata?.locations || [];
  const availableStates = data?.metadata?.states || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Explore Colleges
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Compare rankings, placement reports, fees, and reviews for top universities.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Sidebar Filters Column (Desktop) */}
        <div className="w-full lg:w-80 shrink-0 hidden lg:block sticky top-24">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            availableLocations={availableLocations}
            availableStates={availableStates}
            isLoading={isLoading}
          />
        </div>

        {/* Mobile Filter Trigger Button */}
        <div className="w-full lg:hidden flex gap-3 mb-4">
          <button
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters & Sorting</span>
          </button>
        </div>

        {/* Mobile Filters Drawer Overlay */}
        {isMobileFiltersOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm lg:hidden flex justify-end">
            <div className="w-80 bg-white dark:bg-slate-950 h-full overflow-y-auto p-4 flex flex-col relative animate-slide-in-right">
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                Close (X)
              </button>
              <div className="mt-8">
                <FilterSidebar
                  filters={filters}
                  setFilters={setFilters}
                  availableLocations={availableLocations}
                  availableStates={availableStates}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        )}

        {/* Listing Results Grid Column */}
        <div className="flex-1 w-full">
          
          {/* Top Bar showing Count and Sort */}
          <div className="flex items-center justify-between mb-6 text-sm text-slate-500 dark:text-slate-400">
            <span>
              Showing <span className="font-bold text-slate-800 dark:text-slate-200">{colleges.length}</span> of{" "}
              <span className="font-bold text-slate-800 dark:text-slate-200">{pagination.totalCount}</span> colleges
            </span>
          </div>

          {/* Loading Skeletons */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[400px]">
                  <div className="h-48 w-full shimmer" />
                  <div className="p-5 flex-1 flex flex-col gap-4">
                    <div className="h-6 w-3/4 rounded bg-slate-200 dark:bg-slate-800 shimmer" />
                    <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-800 shimmer" />
                    <div className="h-12 w-full rounded-xl bg-slate-100 dark:bg-slate-900 shimmer mt-2" />
                    <div className="h-10 w-full rounded-lg bg-slate-200 dark:bg-slate-800 shimmer mt-auto" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6 text-center max-w-md mx-auto my-12 dark:border-red-950 dark:bg-slate-950/20">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-3" />
              <h3 className="font-bold text-red-900 dark:text-red-400">Error Loading Colleges</h3>
              <p className="text-xs text-red-700 dark:text-red-500 mt-2">
                We encountered an issue fetching college listings. Please refresh or try again.
              </p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && colleges.length === 0 && (
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 p-12 text-center max-w-lg mx-auto my-12 shadow-sm">
              <BookOpen className="h-12 w-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">No Colleges Found</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                We couldn't find any institutions matching your search criteria. Try modifying your filters, widening the fees range, or searching for other keywords.
              </p>
              <button
                onClick={() =>
                  setFilters({
                    search: "",
                    location: "",
                    course: "",
                    maxFees: "",
                    ownershipType: "",
                    sortBy: "rating",
                    minRating: "",
                    page: 1
                  })
                }
                className="mt-6 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white dark:text-slate-950 text-xs font-bold rounded-lg cursor-pointer hover-lift shadow"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Colleges Grid */}
          {!isLoading && !error && colleges.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {colleges.map((college: any) => (
                <CollegeCard key={college.id} college={college} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {!isLoading && !error && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12 border-t border-slate-250/60 dark:border-slate-800/60 pt-6">
              <button
                onClick={() => setFilters((prev) => ({ ...prev, page: Math.max(prev.page - 1, 1) }))}
                disabled={filters.page === 1}
                className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-350 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-850 disabled:opacity-50 disabled:pointer-events-none cursor-pointer transition-colors shadow-sm"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Back</span>
              </button>

              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Page <span className="font-bold text-slate-800 dark:text-slate-200">{filters.page}</span> of{" "}
                <span className="font-bold text-slate-800 dark:text-slate-200">{pagination.totalPages}</span>
              </span>

              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: Math.min(prev.page + 1, pagination.totalPages) }))
                }
                disabled={filters.page === pagination.totalPages}
                className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-350 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-850 disabled:opacity-50 disabled:pointer-events-none cursor-pointer transition-colors shadow-sm"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

        </div>

      </div>

      <style jsx global>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
