import { NextRequest, NextResponse } from "next/server";

import { searchContent } from "@/features/tmdb/server/actions/films";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query") ?? "";

  return NextResponse.json(await searchContent(query));
}
