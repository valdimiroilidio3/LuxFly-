import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/db";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects({ publishedOnly: true });
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/empresa`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    { url: `${site.url}/projetos`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/servicos`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    { url: `${site.url}/contacto`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${site.url}/privacidade`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site.url}/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site.url}/termos`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  return [
    ...staticRoutes,
    ...projects.map((p) => ({
      url: `${site.url}/projetos/${p.slug}`,
      lastModified: new Date(p.createdAt),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
