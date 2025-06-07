import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/movies", "/series", "/kids"],
      disallow: "/admin/*",
    },
    sitemap: "https://filmsasa.vercel.app/sitemap.xml",
  };
}
