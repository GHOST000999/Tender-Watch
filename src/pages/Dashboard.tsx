import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity,
  AlarmClock,
  ArrowUpRight,
  CalendarClock,
  FileSearch,
  Globe,
  LoaderCircle,
  Map as MapIcon,
  MapPin,
  Newspaper,
  TriangleAlert,
} from 'lucide-react';
import { loadActivity, loadSources, loadTenders } from '../lib/api';
import { daysLeft, formatDate, formatDateTime, tenderStatus } from '../lib/format';
import { regionCounts, tenderScope } from '../lib/geo';
import type { ActivityItem, Source, Tender } from '../lib/types';

interface Stats {
  tenderSites: number;
  gazettes: number;
  openTenders: number;
  closingSoon: number;
  totalTenders: number;
  totalSources: number;
  byCategory: { category: string; count: number }[];
  upcoming: (Tender & { days_left: number })[];
}

export default function Dashboard() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [t, s, a] = await Promise.all([
          loadTenders(),
          loadSources(),
          loadActivity(),
        ]);
        setTenders(t.data);
        setSources(s.data);
        setActivity(a.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = useMemo<Stats | null>(() => {
    if (!tenders.length && !sources.length) return null;
    const categoryMap = new Map<string, number>();
    for (const t of tenders) {
      categoryMap.set(t.category, (categoryMap.get(t.category) ?? 0) + 1);
    }
    const byCategory = [...categoryMap.entries()]
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
    const open = tenders.filter((t) => tenderStatus(t.deadline) !== 'closed');
    const upcoming = [...open]
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 5)
      .map((t) => ({ ...t, days_left: Math.max(0, daysLeft(t.deadline)) }));
    return {
      tenderSites: sources.filter((s) => s.source_type === 'tender_site').length,
      gazettes: sources.filter((s) => s.source_type === 'gazette').length,
      openTenders: open.length,
      closingSoon: tenders.filter((t) => tenderStatus(t.deadline) === 'closing').length,
      totalTenders: tenders.length,
      totalSources: sources.length,
      byCategory,
      upcoming,
    };
  }, [tenders, sources]);

  const scopes = useMemo(() => tenders.map((t) => tenderScope(t)), [tenders]);
  const counts = useMemo(() => regionCounts(scopes), [scopes]);

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-slate-400">
        <LoaderCircle className="h-8 w-8 animate-spin text-emerald-400" />
        <p className="text-sm">Syncing procurement intelligence…</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <TriangleAlert className="h-8 w-8 text-amber-400" />
        <p className="text-sm text-slate-400">{error || 'Failed to load analytics'}</p>
      </div>
    );
  }

  const maxCategory = Math.max(1, ...stats.byCategory.map((c) => c.count));

  const cards = [
    {
      label: 'Tender sites watched',
      value: stats.tenderSites,
      sub: 'Portals & aggregators',
      icon: Globe,
      tint: 'text-emerald-400 bg-emerald-500/10 ring-emerald-400/30',
    },
    {
      label: 'Gazettes tracked',
      value: stats.gazettes,
      sub: 'Official publications',
      icon: Newspaper,
      tint: 'text-sky-400 bg-sky-500/10 ring-sky-400/30',
    },
    {
      label: 'Open tenders',
      value: stats.openTenders,
      sub: `${stats.totalTenders} total tracked`,
      icon: FileSearch,
      tint: 'text-violet-400 bg-violet-500/10 ring-violet-400/30',
    },
    {
      label: 'Closing in ≤ 7 days',
      value: stats.closingSoon,
      sub: 'Action required',
      icon: AlarmClock,
      tint: 'text-amber-400 bg-amber-500/10 ring-amber-400/30',
    },
  ];

  const regionRows = [
    {
      label: 'Kenya',
      hint: 'National & county',
      count: counts.kenya,
      icon: MapPin,
      bar: 'from-emerald-500 to-emerald-300',
      text: 'text-emerald-300',
    },
    {
      label: 'East Africa',
      hint: 'incl. Kenya, Uganda, Tanzania, Rwanda…',
      count: counts.east_africa,
      icon: MapIcon,
      bar: 'from-sky-500 to-sky-300',
      text: 'text-sky-300',
    },
    {
      label: 'Africa',
      hint: 'all continental opportunities',
      count: counts.africa,
      icon: Globe,
      bar: 'from-violet-500 to-violet-300',
      text: 'text-violet-300',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-emerald-400 uppercase">
            Analytics
          </p>
          <h1 className="font-display mt-1 text-2xl font-bold text-white sm:text-3xl">
            Procurement intelligence for GSC LTD
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Matching tenders across Globecon service lines — MIS, G2P payments,
            public finance & digital — from Kenya to the whole continent.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Live watchlist · {stats.totalSources} sources
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-400">{card.label}</p>
              <div
                className={`grid h-9 w-9 place-items-center rounded-lg ring-1 ${card.tint}`}
              >
                <card.icon className="h-4.5 w-4.5" />
              </div>
            </div>
            <p className="font-display mt-3 text-3xl font-bold text-white">
              {card.value}
            </p>
            <p className="mt-1 text-xs text-slate-500">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Tenders by service line */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-white">
                Tenders by service line
              </h2>
              <Link
                to="/tenders"
                className="flex items-center gap-1 text-xs font-medium text-emerald-400 hover:text-emerald-300"
              >
                View all <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            {stats.byCategory.length === 0 ? (
              <p className="text-sm text-slate-500">No tenders tracked yet.</p>
            ) : (
              <div className="space-y-4">
                {stats.byCategory.map((row) => (
                  <div key={row.category}>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-300">
                        {row.category}
                      </span>
                      <span className="text-slate-500">{row.count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(row.count / maxCategory) * 100}%` }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Regional coverage — new */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapIcon className="h-4 w-4 text-emerald-400" />
                <h2 className="font-display text-base font-semibold text-white">
                  Regional coverage
                </h2>
              </div>
              <Link
                to="/tenders"
                className="flex items-center gap-1 text-xs font-medium text-emerald-400 hover:text-emerald-300"
              >
                Filter tenders <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="space-y-4">
              {regionRows.map((row) => (
                <div key={row.label}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-medium text-slate-300">
                      <row.icon className={`h-3.5 w-3.5 ${row.text}`} />
                      {row.label}
                      <span className="font-normal text-slate-500">
                        — {row.hint}
                      </span>
                    </span>
                    <span className="text-slate-500">{row.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(row.count / Math.max(1, stats.totalTenders)) * 100}%`,
                      }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                      className={`h-full rounded-full bg-gradient-to-r ${row.bar}`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-slate-500">
              Opportunities are scoped Kenya → East Africa → Africa. Use the
              region filter on Live Tenders to drill down from the continent to
              national opportunities.
            </p>
          </div>

          {/* Next deadlines */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="mb-4 flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-amber-400" />
              <h2 className="font-display text-base font-semibold text-white">
                Next deadlines
              </h2>
            </div>
            {stats.upcoming.length === 0 ? (
              <p className="text-sm text-slate-500">No upcoming deadlines.</p>
            ) : (
              <ul className="divide-y divide-slate-800/80">
                {stats.upcoming.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-200">
                        {t.title}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {t.procurer} · {formatDate(t.deadline)}
                      </p>
                    </div>
                    <span
                      className={[
                        'shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold',
                        t.days_left <= 7
                          ? 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/30'
                          : 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/20',
                      ].join(' ')}
                    >
                      {t.days_left}d left
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Recent activity */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              <h2 className="font-display text-base font-semibold text-white">
                Recent activity
              </h2>
            </div>
            {activity.length === 0 ? (
              <p className="text-sm text-slate-500">No activity yet.</p>
            ) : (
              <ul className="space-y-4">
                {activity.slice(0, 8).map((item) => (
                  <li key={item.id} className="flex gap-3">
                    <span
                      className={[
                        'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                        item.action === 'source_added'
                          ? 'bg-emerald-400'
                          : item.action === 'source_removed'
                            ? 'bg-rose-400'
                            : 'bg-sky-400',
                      ].join(' ')}
                    />
                    <div className="min-w-0">
                      <p className="text-xs leading-relaxed text-slate-300">
                        {item.detail}
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-500">
                        {formatDateTime(item.created_at)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Expand the watchlist */}
          <div className="rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 to-slate-900/40 p-6">
            <h3 className="font-display text-sm font-semibold text-white">
              Expand the watchlist
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
              Add new tender portals or gazette editions to the Tender Browser
              and keep the whole team in sync.
            </p>
            <Link
              to="/browser"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Open Tender Browser <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
