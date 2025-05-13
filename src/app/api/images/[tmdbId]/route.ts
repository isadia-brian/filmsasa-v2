// app/api/images/[tmdbId]/route.ts
import { db } from "@/drizzle/";
import { carouselFilms } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { tmdbId: string } },
) {
  try {
    const { tmdbId } = await params;
    const [film] = await db
      .select({ backdropImage: carouselFilms.backdropImage })
      .from(carouselFilms)
      .where(eq(carouselFilms.tmdbId, parseInt(tmdbId)));

    if (!film?.backdropImage) {
      return new NextResponse("Image not found", { status: 404 });
    }

    return new NextResponse(film.backdropImage, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
}
