import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../server/db";
import { recruiters } from "../../../../server/db/schema";

// GET all recruiters
export async function GET() {
  try {
    const allRecruiters = await db.select().from(recruiters);
    return NextResponse.json(allRecruiters);
  } catch (error) {
    console.error("Error fetching recruiters:", error);
    return NextResponse.json(
      { error: "Failed to fetch recruiters" },
      { status: 500 }
    );
  }
}

// POST create new recruiter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const [newRecruiter] = await db
      .insert(recruiters)
      .values({ name })
      .returning();

    return NextResponse.json(newRecruiter, { status: 201 });
  } catch (error) {
    console.error("Error creating recruiter:", error);
    return NextResponse.json(
      { error: "Failed to create recruiter" },
      { status: 500 }
    );
  }
}

