import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request body" },
        { status: 400 }
      );
    }

    const { examName, rank } = body;

    // Validate inputs
    if (!examName || rank === undefined || rank === null) {
      return NextResponse.json(
        { success: false, error: "examName and rank are required fields" },
        { status: 400 }
      );
    }

    const parsedRank = parseInt(rank, 10);
    if (isNaN(parsedRank) || parsedRank <= 0) {
      return NextResponse.json(
        { success: false, error: "Rank must be a positive integer" },
        { status: 400 }
      );
    }

    // Query database for matching predictor rules
    const matchingRules = await db.predictorRule.findMany({
      where: {
        examName: {
          equals: examName
        },
        minRank: {
          lte: parsedRank
        },
        maxRank: {
          gte: parsedRank
        }
      },
      include: {
        college: {
          include: {
            courses: true,
            placements: true
          }
        }
      }
    });

    const recommendedColleges = matchingRules.map((rule) => {
      // Return college with cutoff details for display
      return {
        ...rule.college,
        cutoffDetails: {
          examName: rule.examName,
          minRank: rule.minRank,
          maxRank: rule.maxRank
        }
      };
    });

    // Sort recommended colleges by ranking or rating
    recommendedColleges.sort((a, b) => b.rating - a.rating);

    return NextResponse.json({
      success: true,
      data: recommendedColleges
    });
  } catch (error: any) {
    console.error("POST /api/predict error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
export async function GET() {
  // Support GET to fetch available exam names for form select dropdowns
  try {
    const exams = await db.predictorRule.groupBy({
      by: ["examName"]
    });

    return NextResponse.json({
      success: true,
      data: exams.map((e) => e.examName)
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
