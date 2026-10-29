'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [['/dashboard', 'Dashboard'], ['/expenses', 'Daily & monthly expenses'], ['/transactions', 'Transactions'], ['/budgets', 'Budgets'], ['/categories', 'Categories'], ['/reports', 'Reports'], ['/settings', 'Settings']];
export default function Nav() {
  const path = usePathname();
  return <nav className="flex flex-wrap gap-2" aria-label="Primary navigation">{links.map(([href, label]) => <Link key={href} href={href} className={`rounded-lg border px-3 py-2 text-sm ${path === href ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'bg-white'}`}>{label}</Link>)}</nav>;
}
