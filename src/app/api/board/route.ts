import { NextResponse } from "next/server";
import { db } from "../../../../server/db";
import {
  jobApplications,
  columns,
  type JobApplication,
  type Column,
} from "../../../../server/db/schema";
import { asc, isNull } from "drizzle-orm";

// GET board data (columns with their job applications)
export async function GET() {
  try {
    const allColumns = await db
      .select()
      .from(columns)
      .orderBy(asc(columns.order));
    const allApplications = await db
      .select()
      .from(jobApplications)
      .where(isNull(jobApplications.deletedAt));

    // Organize applications by column
    // Convert UUIDs to strings for reliable comparison
    const boardData: Record<string, JobApplication[]> = {};

    // Initialize all columns with empty arrays
    for (const column of allColumns) {
      boardData[String(column.id)] = [];
    }

    // Group applications by column
    for (const app of allApplications) {
      const columnId = String(app.currentColumn);
      console.log("Column ID:", columnId);
      if (boardData[columnId]) {
        // Ensure currentColumn is a string in the response
        const appWithStringColumn = {
          ...app,
          currentColumn: String(app.currentColumn),
        };
        boardData[columnId].push(appWithStringColumn);
        console.log(`Added app ${app.id} to column ${columnId}`);
      } else {
        // If column doesn't exist, log a warning (orphaned application)
        console.warn(
          `Application ${app.id} references non-existent column ${columnId}`
        );
        console.warn(
          `Available columns:`,
          allColumns.map(c => ({ id: String(c.id), name: c.name }))
        );
        console.warn(
          `Application currentColumn:`,
          app.currentColumn,
          typeof app.currentColumn
        );
      }
    }

    // Debug logging
    console.log("Board data structure:", {
      columnsCount: allColumns.length,
      applicationsCount: allApplications.length,
      boardDataKeys: Object.keys(boardData),
      boardDataSizes: Object.entries(boardData).map(([key, apps]) => ({
        key,
        count: apps.length,
      })),
    });

    // Ensure column IDs are strings in the response
    const columnsWithStringIds = allColumns.map(col => ({
      ...col,
      id: String(col.id),
    }));

    return NextResponse.json({
      columns: columnsWithStringIds,
      applications: boardData,
    });
  } catch (error) {
    console.error("Error fetching board data:", error);
    return NextResponse.json(
      { error: "Failed to fetch board data" },
      { status: 500 }
    );
  }
}
