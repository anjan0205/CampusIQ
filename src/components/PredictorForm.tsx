"use client";

import React, { useState } from "react";
import { Search, Sparkles, Award, ArrowRight } from "lucide-react";
import { useToast } from "@/context/ToastContext";

interface PredictorFormProps {
  onPredict: (examName: string, rank: number) => void;
  isLoading: boolean;
  availableExams: string[];
}

export default function PredictorForm({ onPredict, isLoading, availableExams }: PredictorFormProps) {
  const [examName, setExamName] = useState("");
  const [rank, setRank] = useState("");
  const { error } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!examName) {
      error("Please select an entrance exam.");
      return;
    }

    if (!rank) {
      error("Please enter your exam rank.");
      return;
    }

    const parsedRank = parseInt(rank, 10);
    if (isNaN(parsedRank) || parsedRank <= 0) {
      error("Please enter a valid positive rank number.");
      return;
    }

    onPredict(examName, parsedRank);
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl glass-card border p-8 shadow-2xl relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-slate-500/5 blur-2xl" />
      <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-slate-500/5 blur-2xl" />

      {/* Form Header */}
      <div className="text-center mb-8 relative">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-3">
          <Sparkles className="h-5 w-5 text-slate-900 dark:text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Where can you get admission?
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
          Enter your entrance exam and rank to predict high-probability college options based on historical cutoff trends.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 relative">
        
        {/* 1. Exam Name */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Select Entrance Exam
          </label>
          <div className="relative">
            <Award className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 py-3 pl-10 pr-4 text-sm text-slate-800 dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
            >
              <option value="" className="bg-white dark:bg-slate-950">-- Choose Exam --</option>
              {availableExams.map((exam) => (
                <option key={exam} value={exam} className="bg-white dark:bg-slate-950">
                  {exam}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2. Rank Input */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Enter Your Rank (General Rank / Common Rank List)
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="number"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              placeholder="e.g. 2500"
              min="1"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 py-3 pl-10 pr-4 text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-black hover:bg-neutral-900 dark:bg-white dark:hover:bg-neutral-200 dark:text-black text-white font-bold text-sm rounded-xl hover-lift shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Analyzing Cutoffs...</span>
            </span>
          ) : (
            <>
              <span>Predict Colleges</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

      </form>
    </div>
  );
}
