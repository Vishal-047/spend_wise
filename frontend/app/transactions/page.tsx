'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Nav from '../../components/Nav';
import { api, API, money } from '../../lib/api';

export default function Transactions() {
  const [items, setItems] = useState<any[]>([]);
  const [filters, setFilters] = useState({ search: '', type: '', from: '', to: '' });
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>({ pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams({ page: String(page), limit: '15', ...filters });
      const response = await api(`/transactions?${query}`);
      setItems(response.data.items);
      setMeta(response.data);
    } catch (requestError: any) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [page, filters.search, filters.type, filters.from, filters.to]);

  async function remove(id: string, description: string) {
    if (!confirm(`Delete "${description}" permanently?`)) return;
    try {
      await api(`/transactions/${id}`, { method: 'DELETE' });
      setMessage('Transaction deleted.');
      await load();
    } catch (requestError: any) {
      setError(requestError.message);
    }
  }

  return (
    <main className="page-shell">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="mb-4 text-slate-500">Search and manage every money movement.</p>
        <Nav />
      </header>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
        <div>
          <p className="font-semibold text-emerald-900">Need to record a transaction?</p>
          <p className="text-sm text-emerald-700">Use the daily expenses form to add income or expenses.</p>
        </div>
        <Link href="/expenses" className="btn-primary">Add expense</Link>
      </div>

      <div className="card mb-4 grid gap-3 md:grid-cols-4">
        <input className="input" placeholder="Search description or notes" value={filters.search} onChange={(event) => { setPage(1); setFilters({ ...filters, search: event.target.value }); }} />
        <select className="input" value={filters.type} onChange={(event) => { setPage(1); setFilters({ ...filters, type: event.target.value }); }}>
          <option value="">All types</option>
          <option value="expense">Expenses</option>
          <option value="income">Income</option>
        </select>
        <input className="input" type="date" aria-label="From date" value={filters.from} onChange={(event) => { setPage(1); setFilters({ ...filters, from: event.target.value }); }} />
        <input className="input" type="date" aria-label="To date" value={filters.to} onChange={(event) => { setPage(1); setFilters({ ...filters, to: event.target.value }); }} />
      </div>

      {message && <p className="mb-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>}
      {error && <p className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

      <div className="card overflow-auto">
        {loading ? <p className="text-slate-500">Loading transactions…</p> : items.length ? (
          <table className="w-full min-w-[760px] text-left">
            <thead><tr className="border-b text-sm text-slate-500"><th className="p-3">Date</th><th>Description</th><th>Type</th><th>Category</th><th>Payment</th><th>Amount</th><th className="text-right">Actions</th></tr></thead>
            <tbody>{items.map((transaction) => (
              <tr className="border-b last:border-0" key={transaction._id}>
                <td className="p-3">{new Date(transaction.transactionDate).toLocaleDateString()}</td>
                <td className="font-medium">{transaction.description}</td>
                <td><span className={`status-pill ${transaction.type === 'income' ? 'status-income' : 'status-expense'}`}>{transaction.type}</span></td>
                <td>{transaction.category?.name || '—'}</td>
                <td className="capitalize">{transaction.paymentMethod.replace('_', ' ')}</td>
                <td className={transaction.type === 'income' ? 'font-semibold text-emerald-600' : 'font-semibold text-rose-600'}>{transaction.type === 'income' ? '+' : '-'}{money(transaction.amountMinor)}</td>
                <td className="text-right"><div className="flex justify-end gap-2">
                  <Link href={`/expenses?edit=${transaction._id}`} className="action-button action-edit" aria-label={`Edit ${transaction.description}`}>Edit</Link>
                  <button className="action-button action-delete" onClick={() => remove(transaction._id, transaction.description)} aria-label={`Delete ${transaction.description}`}>Delete</button>
                </div></td>
              </tr>
            ))}</tbody>
          </table>
        ) : <div className="py-8 text-center"><p className="font-medium text-slate-700">No transactions match your filters.</p><p className="mt-1 text-sm text-slate-500">Try clearing a filter or add a new expense.</p></div>}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <button className="page-button" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
        <span>Page {page} of {meta.pages || 1}</span>
        <button className="page-button" disabled={page >= (meta.pages || 1)} onClick={() => setPage(page + 1)}>Next</button>
      </div>
      <a className="mt-4 inline-block text-sm font-semibold text-emerald-700 hover:text-emerald-800" href={`${API}/transactions/export`}>Download CSV export</a>
    </main>
  );
}
