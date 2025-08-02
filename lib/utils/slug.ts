/**
 * Generate a URL-friendly slug from a string
 * Handles Portuguese accented characters and special characters
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics (accents)
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '') // Remove any remaining special characters
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Check if a slug matches the expected format for a given text
 */
export function isSlugValid(text: string, slug: string): boolean {
  const expectedSlug = generateSlug(text);
  return expectedSlug === slug;
} 