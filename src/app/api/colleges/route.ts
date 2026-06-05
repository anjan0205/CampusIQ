import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const location = searchParams.get("location") || "";
    const state = searchParams.get("state") || "";
    const maxFees = searchParams.get("maxFees") ? parseFloat(searchParams.get("maxFees")!) : null;
    const course = searchParams.get("course") || "";
    const minRating = searchParams.get("minRating") ? parseFloat(searchParams.get("minRating")!) : null;
    const ownershipType = searchParams.get("ownershipType") || "";
    const sortBy = searchParams.get("sortBy") || "rating"; // "rating", "fees", "placement", "nirf"
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "9", 10);

    const where: any = {};

    // Search by name (case-insensitive contains)
    if (search) {
      where.name = {
        contains: search
      };
    }

    // Filter by location or state (case-insensitive contains)
    if (location) {
      where.OR = [
        { location: { contains: location } },
        { state: { contains: location } }
      ];
    }
    
    if (state) {
      where.state = {
        contains: state
      };
    }

    // Filter by maximum fees
    if (maxFees !== null) {
      where.fees = {
        lte: maxFees
      };
    }

    // Filter by minimum rating
    if (minRating !== null) {
      where.rating = {
        gte: minRating
      };
    }

    // Filter by ownership type (Public/Private)
    if (ownershipType) {
      where.ownershipType = ownershipType;
    }

    // Filter by course name
    if (course) {
      where.courses = {
        some: {
          courseName: {
            contains: course
          }
        }
      };
    }

    // Sorting logic
    let orderBy: any = { rating: "desc" };
    if (sortBy === "rating") {
      orderBy = { rating: "desc" };
    } else if (sortBy === "fees") {
      orderBy = { fees: "asc" };
    } else if (sortBy === "placement") {
      orderBy = { averagePlacement: "desc" };
    } else if (sortBy === "nirf") {
      // In SQLite/Prisma, sorting by nullable fields puts nulls first or last.
      // We will sort by nirfRanking ascending but filter out nulls or accept default behavior.
      orderBy = { nirfRanking: "asc" };
    }

    const skip = (page - 1) * limit;

    const [colleges, totalCount] = await Promise.all([
      db.college.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          courses: true,
          placements: true,
          reviews: {
            take: 2 // return top 2 reviews for cards if needed
          }
        }
      }),
      db.college.count({ where })
    ]);

    // Gather some metadata for filter sidebar selections dynamically
    const locations = await db.college.groupBy({
      by: ["location"],
      _count: { id: true }
    });

    const states = await db.college.groupBy({
      by: ["state"],
      _count: { id: true }
    });

    return NextResponse.json({
      success: true,
      data: colleges,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      },
      metadata: {
        locations: locations.map(l => l.location),
        states: states.map(s => s.state)
      }
    });
  } catch (error: any) {
    console.error("GET /api/colleges error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
