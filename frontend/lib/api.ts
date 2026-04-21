import { API_BASE_URL, INTERNAL_API_BASE_URL } from './constants';

const TOKEN_COOKIE = 'erp_token';

function resolveBaseUrl() {
  return typeof window === 'undefined' ? INTERNAL_API_BASE_URL : API_BASE_URL;
}

function getServerToken(): string | null {
  if (typeof window !== 'undefined') return null;
  try {
    // Next.js server-side: use next/headers (dynamic import to avoid client errors)
    const { cookies } = require('next/headers');
    const jar = cookies();
    return jar.get(TOKEN_COOKIE)?.value ?? null;
  } catch {
    return null;
  }
}

function getClientToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function getToken(): string | null {
  return typeof window === 'undefined' ? getServerToken() : getClientToken();
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const authHeader: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await fetch(`${resolveBaseUrl()}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  list:    (endpoint: string)                     => apiFetch<any[]>(`/${endpoint}`),
  get:     (endpoint: string, id: string)         => apiFetch<any>(`/${endpoint}/${id}`),
  getOne:  (endpoint: string)                     => apiFetch<any>(`/${endpoint}`),
  create:  (endpoint: string, body: unknown)      => apiFetch<any>(`/${endpoint}`, { method: 'POST', body: JSON.stringify(body) }),
  update:  (endpoint: string, id: string, body: unknown) => apiFetch<any>(`/${endpoint}/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  put:     (endpoint: string, body: unknown)      => apiFetch<any>(`/${endpoint}`, { method: 'PUT', body: JSON.stringify(body) }),
  postDocument: (endpoint: string, id: string)    => apiFetch<any>(`/${endpoint}/${id}/post`, { method: 'POST', body: JSON.stringify({}) }),
};
