'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

type Mode = 'login' | 'register';

export default function Home() {
  const [mode, setMode] = useState<Mode>('login');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await fetch(`${API}/auth/${mode}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        setError(payload?.error || 'Unable to continue. Please check your details.');
        return;
      }

      router.push('/dashboard');
    } catch {
      setError(
        'The API is unavailable. Start MongoDB and the backend, then try again.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  function switchMode() {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
  }

  return (
    <main className="grid min-h-screen place-items-center p-6">
      <section className="card w-full max-w-md">
        <div className="mb-8">
          <p className="font-bold text-emerald-600">SPENDWISE</p>
          <h1 className="mt-2 text-3xl font-bold">Your money, clearly understood.</h1>
          <p className="mt-2 text-slate-500">
            Track income, spending and monthly budgets in one calm workspace.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === 'register' && (
            <input
              className="w-full rounded-lg border p-3"
              placeholder="Display name"
              required
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
          )}
          <input
            className="w-full rounded-lg border p-3"
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
          <input
            className="w-full rounded-lg border p-3"
            type="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
          {mode === 'register' && (
            <input
              className="w-full rounded-lg border p-3"
              type="password"
              placeholder="Confirm password"
              required
              value={form.passwordConfirmation}
              onChange={(event) =>
                setForm({ ...form, passwordConfirmation: event.target.value })
              }
            />
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            className="w-full rounded-lg bg-emerald-600 p-3 font-semibold text-white disabled:opacity-60"
            disabled={submitting}
          >
            {submitting ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <button className="mt-5 text-sm text-slate-500" onClick={switchMode}>
          {mode === 'login'
            ? 'New to SpendWise? Create an account'
            : 'Already have an account? Sign in'}
        </button>
      </section>
    </main>
  );
}
