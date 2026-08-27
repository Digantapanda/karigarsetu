/**
 * Turns a craftsman's name into a URL-friendly slug, e.g.
 * "Diganta Panda" -> "diganta-panda".
 * The caller is responsible for appending a disambiguator
 * (e.g. "-12345") if the base slug is already taken.
 */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function withDisambiguator(baseSlug: string): string {
  const suffix = Math.floor(10000 + Math.random() * 90000); // 5-digit suffix
  return `${baseSlug}-${suffix}`;
}
