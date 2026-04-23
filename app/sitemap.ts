import { MetadataRoute } from "next";
import { getAllPublishedSlugs } from "@/lib/queries/posts";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://blog.scalevyn.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Uses admin client (no cookies), so this can be statically generated
  const slugs = await getAllPublishedSlugs();

  const postEntries: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...postEntries,
  ];
}
