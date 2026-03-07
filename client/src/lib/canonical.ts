/**
 * Canonical URL helper for SEO
 * Generates canonical URLs for all pages to prevent duplicate content issues
 */

const BASE_URL = 'https://www.visiumtechnologies.com';

export function getCanonicalUrl(path: string): string {
  // Remove trailing slashes and ensure consistent formatting
  const cleanPath = path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
  return `${BASE_URL}${cleanPath}`;
}

/**
 * Get canonical URL from current location
 * Usage in components: const canonical = getCanonicalUrlFromLocation(location);
 */
export function getCanonicalUrlFromLocation(location: string): string {
  return getCanonicalUrl(location);
}
