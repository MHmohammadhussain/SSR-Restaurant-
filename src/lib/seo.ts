const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export function absoluteUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return new URL(normalizedPath, siteUrl).toString();
}

export function getSiteUrl() {
  return siteUrl;
}
