import { NextRequest, NextResponse } from "next/server";
import { searchCompanyLogo } from "../../../lib/logo-search";

// GET logo for a company
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const companyName = searchParams.get("companyName");

    if (!companyName) {
      return NextResponse.json(
        { error: "companyName parameter is required" },
        { status: 400 }
      );
    }

    const logoUrl = await searchCompanyLogo(companyName);

    return NextResponse.json({ logo: logoUrl });
  } catch (error) {
    console.error("Error searching for logo:", error);
    return NextResponse.json(
      { error: "Failed to search for logo" },
      { status: 500 }
    );
  }
}

