import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Building2,
  Earth,
  ExternalLink,
  FileSearch,
  LayoutDashboard,
  Radar,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Analytics', icon: LayoutDashboard, end: true },
  { to: '/browser', label: 'Tender Browser', icon: Earth, end: false },
  { to: '/tenders', label: 'Live Tenders', icon: FileSearch, end: false },
  { to: '/company', label: 'Company Profile', icon: Building2, end: false },
];

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500/15 ring-1 ring-emerald-400/40">
        <Radar className="h-5 w-5 text-emerald-400" />
      </div>
      <div className="leading-tight">
        <p className="font-display text-sm font-bold tracking-[0.22em] text-white">
          TENDER WATCH
        </p>
        <p className="text-[11px] text-slate-400">
          GSC LTD · Procurement Intelligence
        </p>
      </div>
    </div>
  );
}

function Nav({ vertical }: { vertical?: boolean }) {
  return (
    <nav
      className={
        vertical
          ? 'flex flex-col gap-1 px-3'
          : 'flex items-center gap-1 overflow-x-auto'
      }
    >
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            [
              'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors',
              isActive
                ? 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/30'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200',
            ].join(' ')
          }
        >
          <item.icon className="h-4 w-4 shrink-0" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-800/80 bg-slate-950/95 lg:flex">
        <div className="border-b border-slate-800/80 px-5 py-5">
          <Brand />
        </div>
        <div className="mt-4 flex-1">
          <Nav vertical />
        </div>
        <div className="border-t border-slate-800/80 p-4">
          <div className="mb-3 flex items-center gap-2 text-[11px] text-slate-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Live watchlist sync active
          </div>
          <a
            href="https://globeconcs.com/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs text-slate-300 ring-1 ring-slate-800 transition hover:text-emerald-300 hover:ring-emerald-400/40"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            globeconcs.com
          </a>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/95 backdrop-blur lg:hidden">
        <div className="px-4 pt-4 pb-2">
          <Brand />
        </div>
        <div className="px-2 pb-2">
          <Nav />
        </div>
      </header>

      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
