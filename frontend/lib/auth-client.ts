'use client';

export const TOKEN_COOKIE = 'erp_token';

export function getToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function setToken(token: string) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; expires=${expires}; SameSite=Lax`;
}

export function clearToken() {
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0`;
}

export async function clientLogin(email: string, password: string): Promise<{ accessToken: string; user: { id: string; email: string; fullName: string; role: string } }> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';
  const res = await fetch(`${base}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Login failed');
  }
  return res.json();
}
