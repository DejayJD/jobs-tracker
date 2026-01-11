import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../../server/db";
import { jobApplications, columns } from "../../../../../../server/db/schema";
import { eq, isNull, and } from "drizzle-orm";

// GET job applications by column ID
export async function GET(
  request: NextRequest,
  { params }: { params: { status: string } }
) {
  try {
    const { status } = params;

    // Validate that the column exists
    const columnExists = await db
      .select()
      .from(columns)
      .where(eq(columns.id, status))
      .limit(1);

    if (columnExists.length === 0) {
      return NextResponse.json({ error: "Invalid column ID" }, { status: 400 });
    }

    const applications = await db
      .select()
      .from(jobApplications)
      .where(
        and(
          eq(jobApplications.currentColumn, status),
          isNull(jobApplications.deletedAt)
        )
      );

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Error fetching job applications by status:", error);
    return NextResponse.json(
      { error: "Failed to fetch job applications" },
      { status: 500 }
    );
  }
}
