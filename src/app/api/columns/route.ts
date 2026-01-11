import { NextResponse } from "next/server";
import { db } from "../../../../server/db";
import { columns, type Column, type NewColumn } from "../../../../server/db/schema";
import { asc } from "drizzle-orm";

// GET all columns
export async function GET() {
  try {
    const allColumns = await db.select().from(columns).orderBy(asc(columns.order));
    return NextResponse.json(allColumns);
  } catch (error) {
    console.error("Error fetching columns:", error);
    return NextResponse.json(
      { error: "Failed to fetch columns" },
      { status: 500 }
    );
  }
}

// POST create a new column
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Column name is required" },
        { status: 400 }
      );
    }

    // Get the maximum order value to place new column at the end
    const existingColumns = await db.select().from(columns);
    const maxOrder = existingColumns.length > 0
      ? Math.max(...existingColumns.map((col) => col.order))
      : -1;

    const newColumn: NewColumn = {
      name,
      order: maxOrder + 1,
    };

    const [createdColumn] = await db
      .insert(columns)
      .values(newColumn)
      .returning();

    return NextResponse.json(createdColumn, { status: 201 });
  } catch (error) {
    console.error("Error creating column:", error);
    return NextResponse.json(
      { error: "Failed to create column" },
      { status: 500 }
    );
  }
}

