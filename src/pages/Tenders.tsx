import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarClock,
  ExternalLink,
  FileSearch,
  LoaderCircle,
  MapPin,
  Search,
  TriangleAlert,
} from 'lucide-react';
import { loadTenders } from '../lib/api';
import { daysLeft, formatDate, tenderStatus } from '../lib/format';
import type { TenderStatus } from '../lib/format';
import {
  matchesRegion,
  regionCounts,
  tenderScope,
  type RegionFilterValue,
} from '../lib/geo';
import type { Tender } from '../lib/types';
import RegionFilter from '../components/RegionFilter';
import ScopeBadge from '../components/ScopeBadge';

const STATUS_META: Record<TenderStatus, { label: string; cls: string }> = {
  open: {
    label: 'Open',
    cls: 'bg-emerald-500/10 text-emerald-300 ring-emerald-400/25',
  },
  closing: {
    label: 'Closing soon',
    cls: 'bg-amber-500/15 text-amber-300 ring-amber-400/30',
  },
  closed: {
    label: 'Closed',
    cls: 'bg-slate-700/40 text-slate-400 ring-slate-600/40',
  },
};

export default function Tenders() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [region, setRegion] = useState<RegionFilterValue>('all');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await loadTenders();
        setTenders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tenders');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(tenders.map((t) => t.category))).sort(),
    [tenders],
  );

  const counts = useMemo(
    () => regionCounts(tenders.map((t) => tenderScope(t))),
    [tenders],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return tenders.filter((t) => {
      const liveStatus = tenderStatus(t.deadline);
      if (category !== 'all' && t.category !== category) return false;
      if (status !== 'all' && liveStatus !== status) return false;
      if (!matchesRegion(tenderScope(t), region)) return false;
      return (
        t.title.toLowerCase().includes(q) ||
        t.procurer.toLowerCase().includes(q) ||
        t.ref_number.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    });
  }, [tenders, search, category, status, region]);

  const openCount = tenders.filter(
    (t) => tenderStatus(t.deadline) !== 'closed',
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-emerald-400 uppercase">
            Live Tenders
          </p>
          <h1 className="font-display mt-1 text-2xl font-bold text-white sm:text-3xl">
            Opportunities matching GSC LTD
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {openCount} open of {tenders.length} tracked — filtered for
            Globecon service lines.
          </p>
        </div>
      </div>

      {/* Region filter — Africa / East Africa / Kenya */}
      <div className="mb-4 rounded-2xl border border-slate-800 bg-slate-900/50 px-4 py-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="text-[11px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
            Region
          </span>
          <RegionFilter value={region} onChange={setRegion} counts={counts} />
          <span className="ml-auto hidden text-xs text-slate-500 md:block">
            {filtered.length} of {tenders.length} opportunities shown
          </span>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_200px_170px]">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, procurer, reference…"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2.5 pr-3 pl-9 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-emerald-400/60"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-emerald-400/60"
        >
          <option value="all">All service lines</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-emerald-400/60"
        >
          <option value="all">All statuses</option>
          <option value="open">Open</option>
          <option value="closing">Closing soon</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {loading ? (
        <div className="flex h-[40vh] flex-col items-center justify-center gap-3 text-slate-400">
          <LoaderCircle className="h-7 w-7 animate-spin text-emerald-400" />
          <p className="text-sm">Fetching tracked tenders…</p>
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          <TriangleAlert className="h-4 w-4" /> {error}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex h-[40vh] flex-col items-center justify-center gap-3 text-center">
          <FileSearch className="h-9 w-9 text-slate-700" />
          <p className="text-sm text-slate-500">
            No tenders match your filters.
            {region !== 'all' && (
              <button
                onClick={() => setRegion('all')}
                className="mt-2 block text-emerald-400 hover:text-emerald-300"
              >
                Clear region filter
              </button>
            )}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {filtered.map((t) => {
            const liveStatus = tenderStatus(t.deadline);
            const meta = STATUS_META[liveStatus];
            const days = daysLeft(t.deadline);
            const scope = tenderScope(t);
            return (
              <article
                key={t.id}
                className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/50 p-5 transition hover:border-slate-700"
              >
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${meta.cls}`}
                  >
                    {meta.label}
                  </span>
                  <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-300">
                    {t.category}
                  </span>
                  <ScopeBadge scope={scope} />
                  <span className="ml-auto font-mono text-[11px] text-slate-500">
                    {t.ref_number}
                  </span>
                </div>
                <h2 className="font-display text-base leading-snug font-semibold text-white">
                  {t.title}
                </h2>
                <p className="mt-1.5 text-sm font-medium text-slate-400">
                  {t.procurer}
                </p>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">
                  {t.description}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-800 pt-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <CalendarClock className="h-3.5 w-3.5 text-amber-400" />
                    {formatDate(t.deadline)}
                    {liveStatus !== 'closed' && (
                      <span
                        className={
                          liveStatus === 'closing'
                            ? 'font-semibold text-amber-300'
                            : 'text-emerald-300'
                        }
                      >
                        · {days}d left
                      </span>
                    )}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-500" /> {t.region}
                  </span>
                  <a
                    href={t.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-auto flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 font-medium text-slate-200 transition hover:bg-emerald-500/15 hover:text-emerald-300"
                  >
                    View on {t.source_name}{' '}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
