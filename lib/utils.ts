import slugifyLib from "slugify";

export function generateSlug(title: string): string {
  return slugifyLib(title, {
    lower: true,
    strict: true,
    trim: true,
  });
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateStr));
}

export function formatDateShort(dateStr: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateStr));
}

export function estimateReadTime(content: string): number {
  const wordsPerMinute = 220;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

export function extractExcerpt(markdown: string, maxLength = 160): string {
  // Remove markdown syntax to get plain text
  const plain = markdown
    .replace(/!\[.*?\]\(.*?\)/g, "") // images
    .replace(/\[.*?\]\(.*?\)/g, "$1") // links
    .replace(/#{1,6}\s+/g, "") // headings
    .replace(/[*_~`>#]/g, "") // formatting
    .replace(/\n+/g, " ")
    .trim();
  return truncateText(plain, maxLength);
}
