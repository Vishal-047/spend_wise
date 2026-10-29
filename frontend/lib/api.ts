export const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function api<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.error || 'Request failed');
  return payload;
}

export const money = (minor: number) => `₹${(minor / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
export const monthValue = (date = new Date()) => date.toISOString().slice(0, 7);
