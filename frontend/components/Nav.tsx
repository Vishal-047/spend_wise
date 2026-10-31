'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, WalletCards } from 'lucide-react';
import { useState } from 'react';

const links = [
  ['/dashboard', 'Dashboard'], ['/expenses', 'Expenses'], ['/transactions', 'Transactions'],
  ['/budgets', 'Budgets'], ['/categories', 'Categories'], ['/reports', 'Reports'], ['/settings', 'Settings'],
];

export default function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <nav aria-label="Primary navigation" className="mb-8 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold tracking-tight text-slate-900">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-600 text-white"><WalletCards size={17} /></span>
          SpendWise
        </Link>
        <button aria-expanded={open} aria-label={open ? 'Close navigation' : 'Open navigation'} className="rounded-lg p-2 text-slate-600 md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className={`${open ? 'flex' : 'hidden'} absolute left-4 right-4 top-20 z-10 flex-col gap-1 rounded-xl border border-slate-200 bg-white p-2 shadow-lg md:static md:flex md:flex-row md:items-center md:border-0 md:p-0 md:shadow-none`}>
          {links.map(([href, label]) => <Link key={href} href={href} onClick={() => setOpen(false)} className={`rounded-lg px-3 py-2 text-sm font-medium transition ${path === href ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>{label}</Link>)}
        </div>
      </div>
    </nav>
  );
}
