import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../server/db";
import { recruiters } from "../../../../../server/db/schema";
import { eq } from "drizzle-orm";

// GET recruiter by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const recruiter = await db
      .select()
      .from(recruiters)
      .where(eq(recruiters.id, params.id))
      .limit(1);

    if (recruiter.length === 0) {
      return NextResponse.json(
        { error: "Recruiter not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(recruiter[0]);
  } catch (error) {
    console.error("Error fetching recruiter:", error);
    return NextResponse.json(
      { error: "Failed to fetch recruiter" },
      { status: 500 }
    );
  }
}

// PUT update recruiter
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const [updatedRecruiter] = await db
      .update(recruiters)
      .set({ name, updatedAt: new Date() })
      .where(eq(recruiters.id, params.id))
      .returning();

    if (!updatedRecruiter) {
      return NextResponse.json(
        { error: "Recruiter not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedRecruiter);
  } catch (error) {
    console.error("Error updating recruiter:", error);
    return NextResponse.json(
      { error: "Failed to update recruiter" },
      { status: 500 }
    );
  }
}

// DELETE recruiter
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [deletedRecruiter] = await db
      .delete(recruiters)
      .where(eq(recruiters.id, params.id))
      .returning();

    if (!deletedRecruiter) {
      return NextResponse.json(
        { error: "Recruiter not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Recruiter deleted successfully" });
  } catch (error) {
    console.error("Error deleting recruiter:", error);
    return NextResponse.json(
      { error: "Failed to delete recruiter" },
      { status: 500 }
    );
  }
}

