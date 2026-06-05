import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Star, MapPin, Calendar, Building, Maximize2, IndianRupee, TrendingUp, Award, AwardIcon, GraduationCap, ChevronLeft } from "lucide-react";
import db from "@/lib/db";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate dynamic SEO metadata
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const college = await db.college.findUnique({
    where: { slug }
  });

  if (!college) {
    return {
      title: "College Not Found | CampusIQ",
      description: "The requested college profile could not be found."
    };
  }

  return {
    title: `${college.name} - Fees, Placements, Cutoffs & Reviews | CampusIQ`,
    description: `Read detailed information about ${college.name} at ${college.location}. Find fees structures, courses, average packages, and authentic reviews.`
  };
}

async function getCollegeDetails(slug: string) {
  try {
    const college = await db.college.findUnique({
      where: { slug },
      include: {
        courses: true,
        placements: true,
        reviews: true
      }
    });
    return college;
  } catch (error) {
    console.error("Error fetching college details:", error);
    return null;
  }
}

export default async function CollegeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const college = await getCollegeDetails(slug);

  if (!college) {
    notFound();
  }

  const formatCurrency = (val: number) => {
    if (val >= 100) return `₹${(val / 100).toFixed(1)} Cr`;
    return `₹${val.toFixed(1)} LPA`;
  };

  const formatFees = (val: number) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakhs/yr`;
    return `₹${val.toLocaleString()}/yr`;
  };

  // Get primary placement record if available
  const placementInfo = college.placements[0] || {
    averagePackage: college.averagePlacement,
    highestPackage: college.highestPackage,
    placementPercentage: 90
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Back to listings button */}
      <div className="mb-6">
        <Link
          href="/colleges"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-primary transition-colors cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Colleges</span>
        </Link>
      </div>

      {/* 1. Header Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-card border mb-8">
        <div className="h-64 sm:h-80 md:h-96 w-full relative">
          <img
            src={college.image}
            alt={college.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
            {/* Badges */}
            <div className="flex flex-wrap gap-2.5 mb-4">
              <span className="px-3 py-1 rounded-lg bg-primary text-white text-xs font-bold uppercase tracking-wider">
                {college.ownershipType}
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/20 backdrop-blur-sm text-white text-xs font-bold">
                Est. {college.establishedYear}
              </span>
              {college.nirfRanking && (
                <span className="px-3 py-1 rounded-lg bg-slate-950 text-white text-xs font-bold flex items-center gap-1">
                  <Award className="h-3.5 w-3.5 fill-white" />
                  NIRF Rank #{college.nirfRanking}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              {college.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-300">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                <span>{college.location}, {college.state}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-white text-white shrink-0" />
                <span className="font-bold text-white">{college.rating.toFixed(1)}</span>
                <span>({college.reviews.length} Reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Content Layout (Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Detail Sections (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section A: Overview */}
          <section id="overview" className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-950 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Overview
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {college.description}
            </p>

            {/* Quick Facts Card Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 flex flex-col items-center text-center">
                <Calendar className="h-5 w-5 text-slate-400 mb-2" />
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Established</span>
                <span className="text-sm font-bold text-slate-850 dark:text-slate-200 mt-1">{college.establishedYear}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 flex flex-col items-center text-center">
                <Building className="h-5 w-5 text-slate-400 mb-2" />
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Ownership</span>
                <span className="text-sm font-bold text-slate-850 dark:text-slate-200 mt-1">{college.ownershipType}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 flex flex-col items-center text-center">
                <Maximize2 className="h-5 w-5 text-slate-400 mb-2" />
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Campus Size</span>
                <span className="text-sm font-bold text-slate-850 dark:text-slate-200 mt-1">{college.campusSize}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 flex flex-col items-center text-center">
                <Star className="h-5 w-5 text-slate-400 mb-2" />
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Rating</span>
                <span className="text-sm font-bold text-slate-850 dark:text-slate-200 mt-1">{college.rating.toFixed(1)} / 5</span>
              </div>
            </div>
          </section>

          {/* Section B: Courses & Fees */}
          <section id="courses" className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-950 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Courses & Fees
            </h2>
            
            <div className="space-y-4">
              {college.courses.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center"
                >
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-md">
                      {c.courseName}
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-450">
                      <span>Duration: {c.duration}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>Eligibility: {c.eligibility}</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Annual Fees</span>
                    <span className="text-md font-extrabold text-slate-900 dark:text-white flex items-center gap-0.5 mt-0.5">
                      <IndianRupee className="h-4 w-4 text-slate-500" />
                      {c.fees >= 100000 ? `${(c.fees / 100000).toFixed(2)} Lakhs` : c.fees.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section C: Placements */}
          <section id="placements" className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-950 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Placement Stats
            </h2>

            {/* Custom SVG Placement Package comparison bars */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-900 space-y-6">
              
              <div className="grid grid-cols-3 gap-4 text-center pb-4 border-b border-slate-200 dark:border-slate-900">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Average Package</span>
                  <span className="text-md sm:text-lg font-bold text-slate-900 dark:text-white mt-1 block">
                    {formatCurrency(placementInfo.averagePackage)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Highest Package</span>
                  <span className="text-md sm:text-lg font-bold text-slate-900 dark:text-white mt-1 block">
                    {formatCurrency(placementInfo.highestPackage)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Placement Ratio</span>
                  <span className="text-md sm:text-lg font-bold text-slate-850 dark:text-slate-200 mt-1 block">
                    {placementInfo.placementPercentage}%
                  </span>
                </div>
              </div>

              {/* Package Comparison chart bar */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Compensation Package comparison (LPA)
                </h4>
                
                {/* Average package progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-600 dark:text-slate-350">Average Package</span>
                    <span className="font-bold text-slate-900 dark:text-slate-200">{placementInfo.averagePackage} LPA</span>
                  </div>
                  <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-900 dark:bg-slate-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((placementInfo.averagePackage / 150) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Highest package progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-600 dark:text-slate-350">Highest Package</span>
                    <span className="font-bold text-slate-900 dark:text-slate-200">{placementInfo.highestPackage} LPA</span>
                  </div>
                  <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-500 dark:bg-slate-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((placementInfo.highestPackage / 150) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 italic mt-3 text-center">
                  * Note: Package metrics represent general industry postings. Actual compensation varies per stream.
                </p>
              </div>

            </div>
          </section>

          {/* Section D: Reviews */}
          <section id="reviews" className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-950 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Student Reviews ({college.reviews.length})
            </h2>

            <div className="space-y-6">
              {college.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary-light flex items-center justify-center font-bold text-xs text-primary dark:bg-slate-800 dark:text-slate-200">
                        {rev.studentName.charAt(0)}
                      </div>
                      <span className="text-sm font-semibold text-slate-850 dark:text-slate-200">
                        {rev.studentName}
                      </span>
                    </div>
                    
                    {/* Star rating */}
                    <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200">
                      <Star className="h-3 w-3 fill-slate-950 text-slate-950 dark:fill-white dark:text-white shrink-0" />
                      <span>{rev.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-350 leading-relaxed pl-1">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Right Side: Sticky Facts Card (1/3 width) */}
        <div className="space-y-6 sticky top-24">
          
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <h3 className="text-md font-bold text-slate-950 dark:text-white border-b pb-3">
              Key Admissions Info
            </h3>

            {/* Price tag */}
            <div className="flex items-center justify-between border-b pb-4">
              <span className="text-xs text-slate-500 font-medium">Average Fees</span>
              <div className="text-right">
                <span className="text-md font-extrabold text-slate-900 dark:text-white flex items-center justify-end gap-0.5">
                  <IndianRupee className="h-4.5 w-4.5 text-slate-400" />
                  {formatFees(college.fees)}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Varies by program selection</span>
              </div>
            </div>

            {/* Placement stats summary */}
            <div className="flex items-center justify-between border-b pb-4">
              <span className="text-xs text-slate-500 font-medium">Average Package</span>
              <div className="text-right">
                <span className="text-md font-extrabold text-slate-900 dark:text-white flex items-center justify-end gap-0.5">
                  <TrendingUp className="h-4.5 w-4.5 text-slate-400" />
                  {formatCurrency(college.averagePlacement)}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Lakhs Per Annum</span>
              </div>
            </div>

            {/* Quick specifications */}
            <ul className="space-y-3.5 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex justify-between">
                <span>Location</span>
                <span className="font-semibold text-slate-850 dark:text-slate-200">{college.location}</span>
              </li>
              <li className="flex justify-between">
                <span>State</span>
                <span className="font-semibold text-slate-850 dark:text-slate-200">{college.state}</span>
              </li>
              <li className="flex justify-between">
                <span>Established Year</span>
                <span className="font-semibold text-slate-850 dark:text-slate-200">{college.establishedYear}</span>
              </li>
              <li className="flex justify-between">
                <span>Ownership Type</span>
                <span className="font-semibold text-slate-850 dark:text-slate-200">{college.ownershipType}</span>
              </li>
            </ul>

            {/* Navigation helpers to sections */}
            <div className="flex flex-col gap-2 pt-2 border-t">
              <a
                href="#courses"
                className="w-full text-center py-2.5 border border-slate-200 dark:border-slate-800 hover:border-primary text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 hover:text-primary transition-colors cursor-pointer"
              >
                View Course Structure
              </a>
              <a
                href="#placements"
                className="w-full text-center py-2.5 bg-primary hover:bg-primary-hover text-white dark:text-slate-950 text-xs font-bold rounded-lg shadow hover-lift transition-all cursor-pointer"
              >
                Placement Reports
              </a>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
