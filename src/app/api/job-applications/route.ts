import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../server/db";
import { jobApplications } from "../../../../server/db/schema";

// GET all job applications
export async function GET() {
  try {
    const allApplications = await db.select().from(jobApplications);
    return NextResponse.json(allApplications);
  } catch (error) {
    console.error("Error fetching job applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch job applications" },
      { status: 500 }
    );
  }
}

// POST create new job application
export async function POST(request: NextRequest) {
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
    const column = currentColumn || status;

    if (!companyName || !column) {
      return NextResponse.json(
        { error: "Company name and currentColumn are required" },
        { status: 400 }
      );
    }

    const validColumns = ["inMotion", "sentApps"];
    if (!validColumns.includes(column)) {
      return NextResponse.json(
        { error: "Invalid currentColumn" },
        { status: 400 }
      );
    }

    const [newApplication] = await db
      .insert(jobApplications)
      .values({
        companyName,
        jobTitle,
        currentColumn: column as any,
        recruiterId: recruiterId || null,
        office: office || null,
        compensation: compensation || null,
        companySize: companySize || null,
        questions: questions || null,
        pros: pros || null,
        cons: cons || null,
        vibeCheck: vibeCheck || null,
        stage: stage || null,
        source: source || null,
        logo: logo || null,
      })
      .returning();

    return NextResponse.json(newApplication, { status: 201 });
  } catch (error) {
    console.error("Error creating job application:", error);
    return NextResponse.json(
      { error: "Failed to create job application" },
      { status: 500 }
    );
  }
}

