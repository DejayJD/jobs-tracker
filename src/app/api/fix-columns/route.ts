import { NextResponse } from "next/server";
import { db } from "../../../../server/db";
import { jobApplications, columns } from "../../../../server/db/schema";
import { eq, asc, isNull, and } from "drizzle-orm";

// Fix endpoint to update applications with old enum values to proper column UUIDs
export async function POST() {
  try {
    const allColumns = await db
      .select()
      .from(columns)
      .orderBy(asc(columns.order));
    const allApplications = await db
      .select()
      .from(jobApplications)
      .where(isNull(jobApplications.deletedAt));

    // Find applications with old enum values (strings instead of UUIDs)
    const appsWithOldValues = allApplications.filter(app => {
      const currentColumn = String(app.currentColumn);
      // Check if it's not a valid UUID format (UUIDs have dashes and are 36 chars)
      return !currentColumn.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      );
    });

    if (appsWithOldValues.length === 0) {
      return NextResponse.json({
        message: "No applications need fixing",
        fixed: 0,
      });
    }

    // Map old enum values to column IDs
    // "inMotion" -> first column (order 0) - typically "In Motion" or "Early Stage"
    // "sentApps" -> second column (order 1) - typically "Sent Apps"
    const inMotionColumn = allColumns.find(c => c.order === 0);
    const sentAppsColumn = allColumns.find(c => c.order === 1);

    if (!inMotionColumn || !sentAppsColumn) {
      return NextResponse.json(
        { error: "Could not find required columns. Need at least 2 columns." },
        { status: 400 }
      );
    }

    const mapping: Record<string, string> = {
      inMotion: inMotionColumn.id,
      sentApps: sentAppsColumn.id,
    };

    let fixed = 0;
    const results = [];

    for (const app of appsWithOldValues) {
      const oldValue = String(app.currentColumn);
      const newColumnId = mapping[oldValue];

      if (newColumnId) {
        await db
          .update(jobApplications)
          .set({ currentColumn: newColumnId })
          .where(
            and(
              eq(jobApplications.id, app.id),
              isNull(jobApplications.deletedAt)
            )
          );

        results.push({
          appId: app.id,
          companyName: app.companyName,
          oldValue,
          newColumnId,
          newColumnName:
            oldValue === "inMotion" ? inMotionColumn.name : sentAppsColumn.name,
        });
        fixed++;
      } else {
        results.push({
          appId: app.id,
          companyName: app.companyName,
          oldValue,
          error: "No mapping found for this value",
        });
      }
    }

    return NextResponse.json({
      message: `Fixed ${fixed} application(s)`,
      fixed,
      results,
    });
  } catch (error) {
    console.error("Error fixing columns:", error);
    return NextResponse.json(
      { error: "Failed to fix columns", details: String(error) },
      { status: 500 }
    );
  }
}
