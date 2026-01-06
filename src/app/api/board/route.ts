import { NextResponse } from "next/server";
import { db } from "../../../../server/db";
import {
  jobApplications,
  type JobApplication,
} from "../../../../server/db/schema";

// GET board data (job applications organized by status)
export async function GET() {
  try {
    const allApplications = await db.select().from(jobApplications);

    // Organize applications by status
    const boardData = {
      inMotion: allApplications
        .filter((app: JobApplication) => app.currentColumn === "inMotion")
        .map((app: JobApplication) => ({
          id: app.id,
          title: app.companyName,
          subtitle: app.jobTitle || undefined,
          icon: "company",
        })),
      sentApps: allApplications
        .filter((app: JobApplication) => app.currentColumn === "sentApps")
        .map((app: JobApplication) => ({
          id: app.id,
          title: app.companyName,
          subtitle: app.jobTitle || undefined,
          icon: "company",
        })),
    };

    return NextResponse.json(boardData);
  } catch (error) {
    console.error("Error fetching board data:", error);
    return NextResponse.json(
      { error: "Failed to fetch board data" },
      { status: 500 }
    );
  }
}
