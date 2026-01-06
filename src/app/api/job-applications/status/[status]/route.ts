import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../../server/db";
import { jobApplications } from "../../../../../../server/db/schema";
import { eq } from "drizzle-orm";

// GET job applications by status
export async function GET(
  request: NextRequest,
  { params }: { params: { status: string } }
) {
  try {
    const { status } = params;
    const validStatuses = ["inMotion", "sentApps"];

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const applications = await db
      .select()
      .from(jobApplications)
      .where(eq(jobApplications.currentColumn, status as any));

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Error fetching job applications by status:", error);
    return NextResponse.json(
      { error: "Failed to fetch job applications" },
      { status: 500 }
    );
  }
}

