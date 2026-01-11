import { NextResponse } from "next/server";
import { db } from "../../../../server/db";
import { jobApplications, columns } from "../../../../server/db/schema";
import { isNull } from "drizzle-orm";

// Debug endpoint to check data integrity
export async function GET() {
  // Show which database URL is being used (without password)
  const connectionUrl =
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL;

  const maskedUrl = connectionUrl
    ? connectionUrl.replace(/:[^:@]+@/, ":****@") // Mask password
    : "NOT SET";
  try {
    const allColumns = await db.select().from(columns);
    const allApplications = await db
      .select()
      .from(jobApplications)
      .where(isNull(jobApplications.deletedAt));

    const columnMap = new Map(allColumns.map(c => [String(c.id), c.name]));

    const diagnostics = {
      columns: allColumns.map(c => ({
        id: String(c.id),
        name: c.name,
        order: c.order,
      })),
      applications: allApplications.map(app => ({
        id: app.id,
        companyName: app.companyName,
        currentColumn: app.currentColumn,
        currentColumnString: String(app.currentColumn),
        columnName: columnMap.get(String(app.currentColumn)) || "NOT FOUND",
        matchesColumn: columnMap.has(String(app.currentColumn)),
      })),
      summary: {
        totalColumns: allColumns.length,
        totalApplications: allApplications.length,
        applicationsWithValidColumns: allApplications.filter(app =>
          columnMap.has(String(app.currentColumn))
        ).length,
        applicationsWithInvalidColumns: allApplications.filter(
          app => !columnMap.has(String(app.currentColumn))
        ).length,
      },
    };

    return NextResponse.json({
      ...diagnostics,
      connectionInfo: {
        usingUrl: maskedUrl,
        envVars: {
          hasPostgresUrlNonPooling: !!process.env.POSTGRES_URL_NON_POOLING,
          hasPostgresUrl: !!process.env.POSTGRES_URL,
          hasDatabaseUrl: !!process.env.DATABASE_URL,
        },
      },
    });
  } catch (error) {
    console.error("Error in debug endpoint:", error);
    return NextResponse.json(
      { error: "Failed to fetch debug data", details: String(error) },
      { status: 500 }
    );
  }
}
