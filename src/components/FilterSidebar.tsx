"use client";

import React from "react";
import { Search, IndianRupee, RotateCcw, Filter, MapPin, Award, BookOpen } from "lucide-react";

interface FilterSidebarProps {
  filters: {
    search: string;
    location: string;
    course: string;
    maxFees: string;
    ownershipType: string;
    sortBy: string;
    minRating: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  availableLocations: string[];
  availableStates: string[];
  isLoading?: boolean;
}

export default function FilterSidebar({
  filters,
  setFilters,
  availableLocations,
  availableStates,
  isLoading = false
}: FilterSidebarProps) {
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev: any) => ({
      ...prev,
      [name]: value,
      page: 1 // reset to first page on filter change
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      location: "",
      course: "",
      maxFees: "",
      ownershipType: "",
      sortBy: "rating",
      minRating: "",
      page: 1
    });
  };

  const courseOptions = [
    { label: "All Courses", value: "" },
    { label: "B.Tech Computer Science (CSE)", value: "Computer Science" },
    { label: "B.Tech Electrical/Electronics", value: "Electrical" },
    { label: "MBA (Management)", value: "MBA" },
    { label: "MBBS (Medicine)", value: "MBBS" },
    { label: "Bachelor of Design", value: "Design" }
  ];

  const feeRanges = [
    { label: "Any Fees", value: "" },
    { label: "Under ₹50k / yr", value: "50000" },
    { label: "Under ₹2 Lakhs / yr", value: "200000" },
    { label: "Under ₹5 Lakhs / yr", value: "500000" },
    { label: "Under ₹10 Lakhs / yr", value: "1000000" }
  ];

  // Merge location cities and states uniquely for autocomplete list
  const mergedLocations = Array.from(new Set([...availableLocations, ...availableStates])).sort();

  return (
    <aside className="w-full flex flex-col gap-6 p-6 rounded-2xl glass-card border">
      
      {/* Sidebar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Filter Colleges</h2>
        </div>
        <button
          onClick={resetFilters}
          className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-primary transition-colors cursor-pointer"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>

      <div className="h-[1px] bg-slate-200 dark:bg-slate-800" />

      {/* 1. Search Box */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Search College
        </label>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleInputChange}
            placeholder="Type college name..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 py-2.5 pl-10 pr-4 text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>
      </div>

      {/* 2. Course Selection */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Course
        </label>
        <div className="relative">
          <BookOpen className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <select
            name="course"
            value={filters.course}
            onChange={handleInputChange}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 py-2.5 pl-10 pr-4 text-sm text-slate-800 dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
          >
            {courseOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-950">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Location Selector */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Location / State
        </label>
        <div className="relative">
          <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <select
            name="location"
            value={filters.location}
            onChange={handleInputChange}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 py-2.5 pl-10 pr-4 text-sm text-slate-800 dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
          >
            <option value="" className="bg-white dark:bg-slate-950">All Locations</option>
            {mergedLocations.map((loc) => (
              <option key={loc} value={loc} className="bg-white dark:bg-slate-950">
                {loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Ownership Type */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Ownership
        </label>
        <div className="flex gap-2">
          {["", "Public", "Private"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() =>
                setFilters((prev: any) => ({
                  ...prev,
                  ownershipType: type,
                  page: 1
                }))
              }
              className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                filters.ownershipType === type
                  ? "bg-primary border-primary text-white dark:text-slate-950 font-bold"
                  : "border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900"
              }`}
            >
              {type === "" ? "All" : type}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Max Fees Dropdown */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Max Annual Fees
        </label>
        <div className="relative">
          <IndianRupee className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <select
            name="maxFees"
            value={filters.maxFees}
            onChange={handleInputChange}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 py-2.5 pl-10 pr-4 text-sm text-slate-800 dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
          >
            {feeRanges.map((range) => (
              <option key={range.value} value={range.value} className="bg-white dark:bg-slate-950">
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 6. Sorting Selection */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Sort By
        </label>
        <div className="relative">
          <Award className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleInputChange}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 py-2.5 pl-10 pr-4 text-sm text-slate-800 dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
          >
            <option value="rating" className="bg-white dark:bg-slate-950">Highest Rating</option>
            <option value="fees" className="bg-white dark:bg-slate-950">Lowest Fees First</option>
            <option value="placement" className="bg-white dark:bg-slate-950">Best Average Placements</option>
            <option value="nirf" className="bg-white dark:bg-slate-950">NIRF Ranking (Top First)</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
