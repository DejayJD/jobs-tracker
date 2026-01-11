import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../server/db";
import { jobApplications, columns } from "../../../../server/db/schema";
import { eq, isNull } from "drizzle-orm";
import { searchCompanyLogo } from "../../../lib/logo-search";

// GET all job applications (excluding soft-deleted)
export async function GET() {
  try {
    const allApplications = await db
      .select()
      .from(jobApplications)
      .where(isNull(jobApplications.deletedAt));
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
      status: legacyStatus,
      office,
      compensation,
      companySize,
      notes,
      status,
      nextInterviewDate,
      nextInterviewType,
      vibeCheck,
      source,
      logo,
    } = body;
    // Support both 'status' (legacy) and 'currentColumn' for backward compatibility
    const column = currentColumn || legacyStatus;

    if (!companyName || !column) {
      return NextResponse.json(
        { error: "Company name and currentColumn are required" },
        { status: 400 }
      );
    }

    // Validate that the column exists in the database
    const columnExists = await db
      .select()
      .from(columns)
      .where(eq(columns.id, column))
      .limit(1);

    if (columnExists.length === 0) {
      return NextResponse.json(
        { error: "Invalid currentColumn - column does not exist" },
        { status: 400 }
      );
    }

    // Fetch company logo if not explicitly provided
    let logoUrl = logo || null;
    if (!logo && companyName) {
      try {
        const fetchedLogo = await searchCompanyLogo(companyName);
        if (fetchedLogo) {
          logoUrl = fetchedLogo;
        }
      } catch (error) {
        // Log error but don't fail the creation
        console.error("Failed to fetch company logo:", error);
      }
    }

    const [newApplication] = await db
      .insert(jobApplications)
      .values({
        companyName,
        jobTitle,
        currentColumn: column as any,
        office: office || null,
        compensation: compensation || null,
        companySize: companySize || null,
        notes: notes || null,
        status: status || null,
        nextInterviewDate: nextInterviewDate
          ? new Date(nextInterviewDate)
          : null,
        nextInterviewType: nextInterviewType || null,
        vibeCheck: vibeCheck || null,
        source: source || null,
        logo: logoUrl,
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
