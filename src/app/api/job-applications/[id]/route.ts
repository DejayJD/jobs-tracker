import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../server/db";
import { jobApplications, columns } from "../../../../../server/db/schema";
import { eq, isNull, and } from "drizzle-orm";
import { searchCompanyLogo } from "../../../../lib/logo-search";

// GET job application by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const application = await db
      .select()
      .from(jobApplications)
      .where(
        and(
          eq(jobApplications.id, resolvedParams.id),
          isNull(jobApplications.deletedAt)
        )
      )
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
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const body = await request.json();
    const {
      companyName,
      jobTitle,
      currentColumn,
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

    const updateData: any = { updatedAt: new Date() };

    // Check if companyName is being updated
    let shouldFetchLogo = false;
    if (companyName !== undefined) {
      updateData.companyName = companyName;
      // Only fetch logo if logo is not explicitly provided in the request
      // and companyName is actually changing
      if (logo === undefined) {
        // Get the current application to check if companyName is actually changing
        const currentApplication = await db
          .select()
          .from(jobApplications)
          .where(
            and(
              eq(jobApplications.id, resolvedParams.id),
              isNull(jobApplications.deletedAt)
            )
          )
          .limit(1);

        if (currentApplication.length > 0) {
          const currentCompanyName = currentApplication[0].companyName;
          // Only fetch logo if the company name is actually changing
          if (currentCompanyName !== companyName) {
            shouldFetchLogo = true;
          }
        } else {
          // New application or not found - fetch logo anyway
          shouldFetchLogo = true;
        }
      }
    }

    if (jobTitle !== undefined) updateData.jobTitle = jobTitle;
    if (currentColumn !== undefined) {
      // Validate that the column exists in the database
      const columnExists = await db
        .select()
        .from(columns)
        .where(eq(columns.id, currentColumn))
        .limit(1);

      if (columnExists.length === 0) {
        return NextResponse.json(
          { error: "Invalid currentColumn - column does not exist" },
          { status: 400 }
        );
      }
      updateData.currentColumn = currentColumn;
    }
    if (office !== undefined) updateData.office = office;
    if (compensation !== undefined) updateData.compensation = compensation;
    if (companySize !== undefined) updateData.companySize = companySize;
    if (notes !== undefined) updateData.notes = notes;
    if (status !== undefined) updateData.status = status;
    if (nextInterviewDate !== undefined) {
      updateData.nextInterviewDate = nextInterviewDate
        ? new Date(nextInterviewDate)
        : null;
    }
    if (nextInterviewType !== undefined)
      updateData.nextInterviewType = nextInterviewType;
    if (vibeCheck !== undefined) updateData.vibeCheck = vibeCheck;
    if (source !== undefined) updateData.source = source;
    if (logo !== undefined) updateData.logo = logo;

    // Fetch company logo if company name was updated and logo wasn't explicitly provided
    if (shouldFetchLogo && companyName) {
      try {
        const logoUrl = await searchCompanyLogo(companyName);
        if (logoUrl) {
          updateData.logo = logoUrl;
        }
      } catch (error) {
        // Log error but don't fail the update
        console.error("Failed to fetch company logo:", error);
      }
    }

    const [updatedApplication] = await db
      .update(jobApplications)
      .set(updateData)
      .where(
        and(
          eq(jobApplications.id, resolvedParams.id),
          isNull(jobApplications.deletedAt)
        )
      )
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

// DELETE job application (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const [deletedApplication] = await db
      .update(jobApplications)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(jobApplications.id, resolvedParams.id),
          isNull(jobApplications.deletedAt)
        )
      )
      .returning();

    if (!deletedApplication) {
      return NextResponse.json(
        { error: "Job application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Job application deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting job application:", error);
    return NextResponse.json(
      { error: "Failed to delete job application" },
      { status: 500 }
    );
  }
}
