import React from "react";
import Link from "next/link";
import { Search, Sparkles, GitCompare, Landmark, GraduationCap, ArrowRight, Star, TrendingUp, IndianRupee } from "lucide-react";
import db from "@/lib/db";
import CollegeCard from "@/components/CollegeCard";

async function getFeaturedColleges() {
  try {
    const featured = await db.college.findMany({
      take: 3,
      orderBy: {
        rating: "desc"
      }
    });
    return featured;
  } catch (error) {
    console.error("Failed to fetch featured colleges:", error);
    return [];
  }
}

export default async function HomePage() {
  const featuredColleges = await getFeaturedColleges();

  const stats = [
    { label: "Elite Institutions", value: "340+", icon: Landmark, color: "text-slate-900 bg-slate-100 dark:text-slate-100 dark:bg-slate-800" },
    { label: "Verified Courses", value: "500+", icon: GraduationCap, color: "text-slate-900 bg-slate-100 dark:text-slate-100 dark:bg-slate-800" },
    { label: "Entrance Exams", value: "4", icon: Sparkles, color: "text-slate-900 bg-slate-100 dark:text-slate-100 dark:bg-slate-800" },
    { label: "Verified Placements", value: "100%", icon: TrendingUp, color: "text-slate-900 bg-slate-100 dark:text-slate-100 dark:bg-slate-800" }
  ];

  const categories = [
    {
      title: "Engineering",
      count: "320+ Colleges",
      description: "Explore IITs, NITs, IIITs, and top private engineering programs.",
      href: "/colleges?course=Computer+Science",
      bgGradient: "from-neutral-800 to-neutral-950 border border-neutral-700/50"
    },
    {
      title: "Management",
      count: "10 Colleges",
      description: "Compare PGP/MBA programs at IIMs, FMS, and top business schools.",
      href: "/colleges?course=MBA",
      bgGradient: "from-neutral-900 to-neutral-950 border border-neutral-800"
    },
    {
      title: "Medical",
      count: "25 Colleges",
      description: "Find MBBS cutoffs and review stats for AIIMS, MAMC, and CMC.",
      href: "/colleges?course=MBBS",
      bgGradient: "from-neutral-700 to-neutral-900 border border-neutral-600/40"
    }
  ];

  return (
    <div className="w-full">
      {/* 1. Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.03),transparent_45%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-slate-200 mb-6 uppercase tracking-wider animate-pulse">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Next-Gen College Discovery</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1] mb-6">
            Find Your Dream College with{" "}
            <span className="bg-gradient-to-r from-slate-200 via-white to-slate-400 bg-clip-text text-transparent">
              CampusIQ
            </span>
          </h1>

          <p className="text-slate-400 text-md sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            CampusIQ simplifies college admissions. Search, compare fees and placement packages, read reviews, and predict colleges matching your entrance rank.
          </p>

          {/* Search Redirect Bar */}
          <div className="max-w-xl mx-auto mb-12">
            <form action="/colleges" method="GET" className="flex items-center p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-700/30 shadow-2xl">
              <div className="flex-1 flex items-center pl-3">
                <Search className="h-5 w-5 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  name="search"
                  placeholder="Search colleges by name (e.g. IIT Bombay)..."
                  className="w-full bg-transparent border-none outline-none py-2 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-500"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-200 dark:text-black text-white text-sm font-bold rounded-xl transition-all cursor-pointer hover-lift shrink-0"
              >
                Search
              </button>
            </form>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className={`p-2.5 rounded-xl ${stat.color} mb-3`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">{stat.value}</span>
                <span className="text-xs text-slate-400 mt-1">{stat.label}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 2. Featured Colleges Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Featured Top-Rated Colleges
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Explore some of the highest-rated institutions in the country based on student experience.
            </p>
          </div>
          <Link
            href="/colleges"
            className="flex items-center gap-1 text-sm font-bold text-primary hover:underline hover:gap-1.5 transition-all shrink-0 cursor-pointer"
          >
            <span>View All Colleges</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredColleges.map((college) => (
            <CollegeCard key={college.id} college={college} />
          ))}
        </div>
      </section>

      {/* 3. Stream Selection Section */}
      <section className="bg-slate-50 dark:bg-slate-950/40 py-16 border-y border-slate-100 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Browse by Academic Stream
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-lg mx-auto">
              Jump straight to your area of interest. Filtered down to key course categories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                href={cat.href}
                className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover-lift transition-all flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className={`h-2 w-12 rounded-full bg-gradient-to-r ${cat.bgGradient} mb-4`} />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold mt-1">{cat.count}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1 text-xs font-bold text-primary group-hover:gap-1.5 transition-all">
                  <span>Explore Stream</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Dual Call To Action Section (Predictor & Compare) */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Predictor CTA */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-950 text-white border border-neutral-800 shadow-xl flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-white/5 blur-2xl group-hover:scale-110 transition-transform duration-300" />
            <div>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 mb-4">
                <Sparkles className="h-5 w-5 text-slate-300" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">Admissions Predictor</h3>
              <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                Got your JEE, NEET, or CAT rank? Put it in our smart rank predictor tool to find out which IITs, NITs, or IIMs you are likely to qualify for.
              </p>
            </div>
            <Link
              href="/predictor"
              className="mt-8 inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-white text-slate-950 hover:bg-slate-100 text-xs font-bold rounded-lg hover-lift shadow-md transition-colors w-max cursor-pointer"
            >
              <span>Predict Colleges Now</span>
              <ArrowRight className="h-4 w-4 text-slate-950" />
            </Link>
          </div>

          {/* Compare CTA */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-neutral-950 to-black text-white border border-neutral-900 shadow-xl flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-white/5 blur-2xl group-hover:scale-110 transition-transform duration-300" />
            <div>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 mb-4">
                <GitCompare className="h-5 w-5 text-slate-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">Compare Side-by-Side</h3>
              <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                Undecided between multiple options? Add up to 3 colleges side-by-side to compare fees, placement packages, ratings, and locations easily.
              </p>
            </div>
            <Link
              href="/compare"
              className="mt-8 inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-white text-slate-950 hover:bg-slate-100 text-xs font-bold rounded-lg hover-lift shadow-md transition-colors w-max cursor-pointer"
            >
              <span>Start Comparison</span>
              <ArrowRight className="h-4 w-4 text-slate-950" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
