"use client";

import React from "react";
import Link from "next/link";
import { Star, MapPin, Award, Trash2, X, Plus, ExternalLink, IndianRupee } from "lucide-react";
import { CollegeCompare } from "@/store/useCompareStore";

interface CompareTableProps {
  colleges: (CollegeCompare & {
    courses?: { courseName: string; duration: string; fees: number }[];
    placements?: { averagePackage: number; highestPackage: number; placementPercentage: number }[];
    reviews?: { studentName: string; rating: number; comment: string }[];
  })[];
  onRemove: (id: string) => void;
}

export default function CompareTable({ colleges, onRemove }: CompareTableProps) {
  
  const formatCurrency = (val: number) => {
    if (val >= 100) return `₹${(val / 100).toFixed(1)} Cr`;
    if (val >= 1) return `₹${val.toFixed(1)} LPA`;
    return `₹${(val * 100000).toLocaleString()}`;
  };

  const formatFees = (val: number) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} Lakhs`;
    return `₹${val.toLocaleString()}`;
  };

  const comparisonRows = [
    {
      label: "NIRF Ranking",
      value: (col: any) =>
        col.nirfRanking ? (
          <span className="inline-flex items-center gap-1 font-bold text-slate-900 dark:text-slate-200">
            <Award className="h-4 w-4 shrink-0 text-slate-600 dark:text-slate-400" />
            Rank #{col.nirfRanking}
          </span>
        ) : (
          <span className="text-slate-400">Unranked</span>
        )
    },
    {
      label: "Rating",
      value: (col: any) => (
        <span className="inline-flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200">
          <Star className="h-4 w-4 fill-slate-950 text-slate-950 dark:fill-white dark:text-white shrink-0" />
          {col.rating.toFixed(1)} / 5.0
        </span>
      )
    },
    {
      label: "Annual Tuition Fees",
      value: (col: any) => (
        <span className="font-bold text-slate-850 dark:text-slate-200 flex items-center gap-0.5">
          <IndianRupee className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          {formatFees(col.fees)}
        </span>
      )
    },
    {
      label: "Average Package",
      value: (col: any) => (
        <span className="font-bold text-slate-900 dark:text-white">
          {formatCurrency(col.averagePlacement)}
        </span>
      )
    },
    {
      label: "Highest Package",
      value: (col: any) => (
        <span className="font-bold text-slate-900 dark:text-white">
          {formatCurrency(col.highestPackage)}
        </span>
      )
    },
    {
      label: "Ownership",
      value: (col: any) => <span className="font-medium text-slate-700 dark:text-slate-350">{col.ownershipType}</span>
    },
    {
      label: "Location",
      value: (col: any) => (
        <span className="inline-flex items-start gap-1 text-slate-600 dark:text-slate-400 text-xs">
          <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
          <span>{col.location}, {col.state}</span>
        </span>
      )
    },
    {
      label: "Courses Offered",
      value: (col: any) => (
        <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1">
          {col.courses && col.courses.length > 0 ? (
            col.courses.map((c: any, idx: number) => (
              <div
                key={idx}
                className="text-xs bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800 text-left"
              >
                <div className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{c.courseName}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{c.duration} • {formatFees(c.fees)}/yr</div>
              </div>
            ))
          ) : (
            <span className="text-slate-400">No courses listed</span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-xl">
      <table className="w-full border-collapse text-sm">
        
        {/* Table Header */}
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800">
            {/* First empty column */}
            <th className="p-6 text-left font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-xs w-64 min-w-[200px]">
              Features Matrix
            </th>
            
            {/* College header columns */}
            {colleges.map((col) => (
              <th
                key={col.id}
                className="p-6 text-center border-l border-slate-250/60 dark:border-slate-800/60 min-w-[280px]"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="relative h-20 w-32 rounded-lg overflow-hidden border dark:border-slate-800 shadow-sm">
                    <img
                      src={col.image}
                      alt={col.name}
                      className="h-full w-full object-cover"
                    />
                    <button
                      onClick={() => onRemove(col.id)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/60 hover:bg-red-600 text-white transition-colors"
                      title="Remove College"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <h3 className="font-bold text-sm text-slate-950 dark:text-white line-clamp-2 px-2 text-center max-w-[220px]">
                      {col.name}
                    </h3>
                    <Link
                      href={`/colleges/${col.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline mt-2"
                    >
                      <span>Profile</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </th>
            ))}

            {/* Empty slots for visual help */}
            {colleges.length < 3 &&
              Array.from({ length: 3 - colleges.length }).map((_, idx) => (
                <th
                  key={idx}
                  className="p-6 text-center border-l border-slate-200/50 dark:border-slate-800/50 min-w-[280px] bg-slate-50/20 dark:bg-slate-950/10"
                >
                  <Link
                    href="/colleges"
                    className="flex flex-col items-center justify-center border-2 border-dashed border-slate-250 dark:border-slate-800 rounded-2xl p-8 hover:border-primary group transition-colors min-h-[140px] text-slate-400 dark:text-slate-600"
                  >
                    <Plus className="h-8 w-8 mb-2 text-slate-350 dark:text-slate-700 group-hover:text-primary transition-colors" />
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">
                      Add College
                    </span>
                  </Link>
                </th>
              ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {comparisonRows.map((row, idx) => (
            <tr
              key={idx}
              className={`${
                idx % 2 === 0 ? "bg-slate-50/40 dark:bg-slate-950/20" : ""
              } border-b border-slate-200/60 dark:border-slate-850/60 hover:bg-slate-100/30 dark:hover:bg-slate-800/10 transition-colors`}
            >
              {/* Row Label */}
              <td className="p-4 font-semibold text-slate-800 dark:text-slate-300 border-r border-slate-200/50 dark:border-slate-850/50">
                {row.label}
              </td>

              {/* College values */}
              {colleges.map((col) => (
                <td
                  key={col.id}
                  className="p-4 text-center border-l border-slate-200/60 dark:border-slate-850/60"
                >
                  {row.value(col)}
                </td>
              ))}

              {/* Empty columns slots */}
              {colleges.length < 3 &&
                Array.from({ length: 3 - colleges.length }).map((_, i) => (
                  <td
                    key={i}
                    className="p-4 text-center border-l border-slate-200/60 dark:border-slate-850/60 bg-slate-50/10 dark:bg-slate-950/5 text-slate-350 dark:text-slate-750 font-medium italic text-xs"
                  >
                    Empty slot
                  </td>
                ))}
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}
