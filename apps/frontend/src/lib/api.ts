const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

export function getStoredAccessToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem('clarix.accessToken');
}

export function clearStoredAccessToken() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem('clarix.accessToken');
  window.localStorage.removeItem('clarix.workspaceId');
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getStoredAccessToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const data = (await response.json()) as { message?: string | string[] };
      if (typeof data.message === 'string') {
        message = data.message;
      } else if (Array.isArray(data.message)) {
        message = data.message.join(', ');
      }
    } catch {
      // Ignore non-JSON responses and keep the fallback message.
    }

    throw new ApiError(message, response.status);
  }

  return (await response.json()) as T;
}
