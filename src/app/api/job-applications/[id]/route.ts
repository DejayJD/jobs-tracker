import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../server/db";
import { jobApplications } from "../../../../../server/db/schema";
import { eq } from "drizzle-orm";

// GET job application by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const application = await db
      .select()
      .from(jobApplications)
      .where(eq(jobApplications.id, params.id))
      .limit(1);

    if (application.length === 0) {
      return NextResponse.json(
        { error: "Job application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(application[0]);
  } catch (error) {
    console.error("Error fetching job application:", error);
    return NextResponse.json(
      { error: "Failed to fetch job application" },
      { status: 500 }
    );
  }
}

// PUT update job application
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      companyName,
      jobTitle,
      currentColumn,
      status,
      recruiterId,
      office,
      compensation,
      companySize,
      questions,
      pros,
      cons,
      vibeCheck,
      stage,
      source,
      logo,
    } = body;
    // Support both 'status' (legacy) and 'currentColumn' for backward compatibility
    const column = currentColumn !== undefined ? currentColumn : status;

    const updateData: any = { updatedAt: new Date() };

    if (companyName !== undefined) updateData.companyName = companyName;
    if (jobTitle !== undefined) updateData.jobTitle = jobTitle;
    if (column !== undefined) {
      const validColumns = ["inMotion", "sentApps"];
      if (!validColumns.includes(column)) {
        return NextResponse.json(
          { error: "Invalid currentColumn" },
          { status: 400 }
        );
      }
      updateData.currentColumn = column;
    }
    if (recruiterId !== undefined) updateData.recruiterId = recruiterId;
    if (office !== undefined) updateData.office = office;
    if (compensation !== undefined) updateData.compensation = compensation;
    if (companySize !== undefined) updateData.companySize = companySize;
    if (questions !== undefined) updateData.questions = questions;
    if (pros !== undefined) updateData.pros = pros;
    if (cons !== undefined) updateData.cons = cons;
    if (vibeCheck !== undefined) updateData.vibeCheck = vibeCheck;
    if (stage !== undefined) updateData.stage = stage;
    if (source !== undefined) updateData.source = source;
    if (logo !== undefined) updateData.logo = logo;

    const [updatedApplication] = await db
      .update(jobApplications)
      .set(updateData)
      .where(eq(jobApplications.id, params.id))
      .returning();

    if (!updatedApplication) {
      return NextResponse.json(
        { error: "Job application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error("Error updating job application:", error);
    return NextResponse.json(
      { error: "Failed to update job application" },
      { status: 500 }
    );
  }
}

// DELETE job application
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [deletedApplication] = await db
      .delete(jobApplications)
      .where(eq(jobApplications.id, params.id))
      .returning();

    if (!deletedApplication) {
      return NextResponse.json(
        { error: "Job application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Job application deleted successfully" });
  } catch (error) {
    console.error("Error deleting job application:", error);
    return NextResponse.json(
      { error: "Failed to delete job application" },
      { status: 500 }
    );
  }
}

