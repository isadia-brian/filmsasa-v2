import { getTmdbTrending } from "../actions/tmdb";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(await getTmdbTrending());
}
