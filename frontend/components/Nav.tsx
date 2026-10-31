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
    <nav aria-label="Primary navigation" className="app-nav">
      <div className="app-nav-inner">
        <Link href="/dashboard" className="flex items-center gap-3 font-bold tracking-tight text-slate-900">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white shadow-sm"><WalletCards size={19} /></span>
          <span className="text-lg">SpendWise</span>
        </Link>
        <button aria-expanded={open} aria-label={open ? 'Close navigation' : 'Open navigation'} className="nav-menu-button" onClick={() => setOpen(!open)}>
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
        <div className={`app-nav-links ${open ? 'is-open' : ''}`}>
          <p className="nav-section-label">Workspace</p>
          {links.map(([href, label]) => <Link key={href} href={href} onClick={() => setOpen(false)} className={`nav-link ${path === href ? 'is-active' : ''}`}>{label}</Link>)}
        </div>
      </div>
    </nav>
  );
}
