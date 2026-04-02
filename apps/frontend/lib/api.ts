/**
 * Get the correct API base URL for server-side vs client-side requests
 * @param path - API path like '/api/categories'
 * @returns Full URL for server-side requests, relative path for client-side
 */
export function getApiUrl(path: string): string {
  // Server-side: use full backend URL
  if (typeof window === 'undefined') {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
    return `${backendUrl}${path}`;
  }
  
  // Client-side: use relative path (goes through Next.js rewrites)
  return path;
}

/**
 * Fetch wrapper that handles server/client URL resolution
 */
export async function apiFetch(path: string, options?: RequestInit) {
  const url = getApiUrl(path);
  return fetch(url, options);
}