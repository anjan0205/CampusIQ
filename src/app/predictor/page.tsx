"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Sparkles, HelpCircle, GraduationCap, AlertCircle, RefreshCw } from "lucide-react";
import PredictorForm from "@/components/PredictorForm";
import CollegeCard from "@/components/CollegeCard";

export default function PredictorPage() {
  const [predictionParams, setPredictionParams] = useState<{ examName: string; rank: number } | null>(null);

  // Fetch available exam types for dropdown list dynamically
  const { data: examsData, isLoading: isLoadingExams } = useQuery({
    queryKey: ["available-exams"],
    queryFn: async () => {
      const res = await fetch("/api/predict");
      if (!res.ok) throw new Error("Failed to fetch available exams");
      return res.json();
    }
  });

  const availableExams = examsData?.data || ["JEE Main", "JEE Advanced", "NEET", "CAT"];

  // Mutation/fetch for rank predictions
  const {
    data: predictionData,
    mutate: runPrediction,
    isPending: isPredicting,
    error: predictionError
  } = useMutation({
    mutationFn: async ({ examName, rank }: { examName: string; rank: number }) => {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ examName, rank })
      });
      if (!res.ok) {
        throw new Error("Failed to generate college predictions");
      }
      return res.json();
    }
  });

  const handlePredict = (examName: string, rank: number) => {
    setPredictionParams({ examName, rank });
    runPrediction({ examName, rank });
  };

  const recommendedColleges = predictionData?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-slate-950 dark:text-white" />
          <span>Admission Predictor Tool</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Discover which elite colleges and streams match your entrance exam rank based on verified historical cutoff trends.
        </p>
      </div>

      {/* Predictor Form */}
      <div className="mb-12">
        <PredictorForm
          onPredict={handlePredict}
          isLoading={isPredicting}
          availableExams={availableExams}
        />
      </div>

      {/* Results Section */}
      {predictionParams && (
        <div className="space-y-8 border-t border-slate-200 dark:border-slate-800 pt-8 animate-fade-in">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Prediction Results for Rank #{predictionParams.rank} ({predictionParams.examName})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Found <span className="font-bold text-slate-800 dark:text-slate-200">{recommendedColleges.length}</span> matching colleges matching your cutoff threshold.
              </p>
            </div>
            
            <button
              onClick={() => handlePredict(predictionParams.examName, predictionParams.rank)}
              disabled={isPredicting}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-semibold text-slate-600 dark:text-slate-350 rounded-lg disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isPredicting ? "animate-spin" : ""}`} />
              <span>Re-run Analysis</span>
            </button>
          </div>

          {/* Error prediction state */}
          {predictionError && (
            <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6 text-center max-w-md mx-auto dark:border-red-950 dark:bg-slate-950/20">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-3" />
              <h3 className="font-bold text-red-900 dark:text-red-400">Analysis Failed</h3>
              <p className="text-xs text-red-700 dark:text-red-500 mt-2">
                We encountered an error processing cutoffs. Please check your network and try again.
              </p>
            </div>
          )}

          {/* Loader skeletons */}
          {isPredicting && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[400px]">
                  <div className="h-48 w-full shimmer" />
                  <div className="p-5 flex-grow flex flex-col gap-4">
                    <div className="h-6 w-3/4 rounded bg-slate-200 dark:bg-slate-850 shimmer" />
                    <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-850 shimmer" />
                    <div className="h-10 w-full rounded bg-slate-100 dark:bg-slate-900 shimmer mt-auto" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recommendations Empty State */}
          {!isPredicting && !predictionError && recommendedColleges.length === 0 && (
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 p-12 text-center max-w-lg mx-auto shadow-sm">
              <GraduationCap className="h-12 w-12 text-slate-400 dark:text-slate-650 mx-auto mb-4" />
              <h3 className="font-bold text-slate-950 dark:text-white text-lg">No Direct Matches Found</h3>
              <p className="text-sm text-slate-500 dark:text-slate-450 mt-2 leading-relaxed">
                Unfortunately, your rank falls outside the historical cutoff ranges for the colleges currently in our database for this exam. Try predicting with other exam types or browse our listings to find other matches.
              </p>
            </div>
          )}

          {/* Matches grid */}
          {!isPredicting && !predictionError && recommendedColleges.length > 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedColleges.map((college: any) => (
                  <div key={college.id} className="relative flex flex-col">
                    {/* Floating cutoff tag overlay */}
                    <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-md bg-slate-950 text-white text-[10px] font-bold shadow shadow-slate-900/30 uppercase tracking-wider">
                      Cutoff: {college.cutoffDetails.minRank}-{college.cutoffDetails.maxRank}
                    </div>
                    <CollegeCard college={college} />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Info Section */}
      <section className="mt-16 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto text-xs sm:text-sm text-slate-500 dark:text-slate-450">
        <h3 className="font-bold text-slate-900 dark:text-white mb-3 text-sm flex items-center gap-1.5">
          <HelpCircle className="h-4 w-4 text-slate-400" />
          <span>How does the Admissions Predictor work?</span>
        </h3>
        <p className="leading-relaxed">
          The predictor is driven by the <code>PredictorRule</code> database mapping which represents historical closing cutoffs for general candidates across core academic years. Enter your rank to retrieve matching profiles. Cutoffs fluctuate based on candidate options, seat capacities, and exam difficulties.
        </p>
      </section>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(1.5rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
