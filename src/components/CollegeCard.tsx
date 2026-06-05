"use client";

import React from "react";
import Link from "next/link";
import { Star, MapPin, Award, IndianRupee, TrendingUp, ChevronRight, GitCompare } from "lucide-react";
import useCompareStore from "@/store/useCompareStore";
import { useToast } from "@/context/ToastContext";

export interface CollegeCardProps {
  college: {
    id: string;
    name: string;
    slug: string;
    location: string;
    state: string;
    fees: number;
    rating: number;
    nirfRanking: number | null;
    image: string;
    ownershipType: string;
    averagePlacement: number;
    highestPackage: number;
  };
}

export default function CollegeCard({ college }: CollegeCardProps) {
  const { compareList, addToCompare, removeFromCompare } = useCompareStore();
  const { success, error } = useToast();

  const isCompared = compareList.some((c) => c.id === college.id);

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isCompared) {
      removeFromCompare(college.id);
      success(`Removed "${college.name}" from comparison.`);
    } else {
      const res = addToCompare({
        id: college.id,
        name: college.name,
        slug: college.slug,
        location: college.location,
        state: college.state,
        image: college.image,
        fees: college.fees,
        rating: college.rating,
        averagePlacement: college.averagePlacement,
        highestPackage: college.highestPackage,
        nirfRanking: college.nirfRanking,
        ownershipType: college.ownershipType,
      });

      if (res.success) {
        success(res.message);
      } else {
        error(res.message);
      }
    }
  };

  const formatCurrency = (val: number) => {
    if (val >= 100) return `₹${(val / 100).toFixed(1)} Cr`;
    if (val >= 1) return `₹${val.toFixed(1)} LPA`;
    return `₹${(val * 100000).toLocaleString()}`;
  };

  const formatFees = (val: number) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakhs/yr`;
    return `₹${val.toLocaleString()}/yr`;
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl glass-card hover-lift transition-all duration-300">
      
      {/* Top Banner / Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img
          src={college.image}
          alt={college.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        
        {/* Rating Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-xs font-bold text-slate-850 dark:text-white shadow-sm">
          <Star className="h-3.5 w-3.5 fill-slate-950 text-slate-950 dark:fill-white dark:text-white" />
          <span>{college.rating.toFixed(1)}</span>
        </div>

        {/* Ownership & Established Badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-sm text-[10px] font-bold text-white uppercase tracking-wider">
          <span>{college.ownershipType}</span>
        </div>

        {/* NIRF Rank overlay */}
        {college.nirfRanking && (
          <div className="absolute bottom-4 left-4 flex items-center gap-1 text-xs font-semibold text-white/90">
            <Award className="h-4 w-4 text-white" />
            <span>NIRF Rank #{college.nirfRanking}</span>
          </div>
        )}
      </div>

      {/* Card Info Details */}
      <div className="flex flex-1 flex-col p-5">
        
        {/* College Name & Location */}
        <div className="mb-4">
          <h3 className="line-clamp-2 text-md font-bold leading-snug text-slate-950 dark:text-white group-hover:text-primary transition-colors min-h-[44px]">
            <Link href={`/colleges/${college.slug}`}>{college.name}</Link>
          </h3>
          <div className="mt-2 flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{college.location}, {college.state}</span>
          </div>
        </div>

        {/* Academic and Placement Stats Grid */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 text-xs mb-5">
          <div>
            <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
              Yearly Fees
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-0.5 mt-0.5">
              <IndianRupee className="h-3.5 w-3.5 text-slate-500 shrink-0" />
              {college.fees >= 100000 ? `${(college.fees / 100000).toFixed(1)}L` : `${(college.fees / 1000).toFixed(0)}k`}
            </span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
              Avg Placement
            </span>
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="h-3.5 w-3.5 text-slate-900 dark:text-slate-400 shrink-0" />
              {formatCurrency(college.averagePlacement)}
            </span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="mt-auto flex items-center gap-2">
          {/* View Details */}
          <Link
            href={`/colleges/${college.slug}`}
            className="flex-1 flex items-center justify-center gap-1 px-4 py-2 text-xs font-semibold text-primary bg-primary-light hover:bg-primary/10 rounded-lg transition-colors text-center"
          >
            <span>View Details</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>

          {/* Compare Toggle */}
          <button
            onClick={handleCompareToggle}
            className={`px-3 py-2 rounded-lg border text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1 ${
              isCompared
                ? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900 shadow-sm"
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-800 dark:hover:text-white"
            }`}
            title={isCompared ? "Remove from comparison" : "Add to comparison"}
          >
            <GitCompare className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{isCompared ? "Added" : "Compare"}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
