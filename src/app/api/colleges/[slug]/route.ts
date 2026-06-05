import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export const runtime = "edge";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Slug parameter is required" },
        { status: 400 }
      );
    }

    const college = await db.college.findUnique({
      where: { slug },
      include: {
        courses: true,
        placements: true,
        reviews: true,
        predictorRules: true
      }
    });

    if (!college) {
      return NextResponse.json(
        { success: false, error: "College not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: college
    });
  } catch (error: any) {
    console.error(`GET /api/colleges/[slug] error for slug:`, error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
