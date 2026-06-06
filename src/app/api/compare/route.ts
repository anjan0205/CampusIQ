import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

// export const runtime = "edge"; // Commented out for Vercel deployment

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idsParam = searchParams.get("ids");

    if (!idsParam) {
      return NextResponse.json({
        success: true,
        data: []
      });
    }

    const ids = idsParam.split(",").map(id => id.trim()).filter(Boolean);

    if (ids.length === 0) {
      return NextResponse.json({
        success: true,
        data: []
      });
    }

    const colleges = await db.college.findMany({
      where: {
        id: {
          in: ids
        }
      },
      include: {
        courses: true,
        placements: true,
        reviews: true
      }
    });

    // Maintain the order of IDs as passed by the client
    const orderedColleges = ids
      .map(id => colleges.find(c => c.id === id))
      .filter((c): c is NonNullable<typeof c> => !!c);

    return NextResponse.json({
      success: true,
      data: orderedColleges
    });
  } catch (error: any) {
    console.error("GET /api/compare error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
