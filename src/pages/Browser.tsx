import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BadgeCheck,
  Globe,
  Link2,
  LoaderCircle,
  Map,
  MonitorPlay,
  Newspaper,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  TriangleAlert,
} from 'lucide-react';
import { loadSources, removeSource } from '../lib/api';
import { hostname } from '../lib/format';
import {
  matchesRegion,
  regionCounts,
  sourceScope,
  type RegionFilterValue,
} from '../lib/geo';
import type { Source, SourceType } from '../lib/types';
import AddSourceModal from '../components/AddSourceModal';
import RegionFilter from '../components/RegionFilter';

type TypeFilter = 'all' | SourceType;

const TYPE_TABS: { value: TypeFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'tender_site', label: 'Tender sites' },
  { value: 'gazette', label: 'Gazettes' },
];

export default function Browser() {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<Source | null>(null);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [region, setRegion] = useState<RegionFilterValue>('all');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [iframeLoading, setIframeLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setError('');
      const { data } = await loadSources();
      setSources(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sources');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!selected && sources.length > 0) {
      setSelected(sources[0]);
      setIframeLoading(true);
    }
  }, [sources, selected]);

  const counts = useMemo(
    () => regionCounts(sources.map((s) => sourceScope(s))),
    [sources],
  );

  const visible = useMemo(() => {
    const q = search.toLowerCase();
    return sources.filter((s) => {
      if (typeFilter !== 'all' && s.source_type !== typeFilter) return false;
      if (!matchesRegion(sourceScope(s), region)) return false;
      return (
        s.name.toLowerCase().includes(q) ||
        s.url.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.country.toLowerCase().includes(q)
      );
    });
  }, [sources, typeFilter, region, search]);

  const choose = (source: Source) => {
    setSelected(source);
    setReloadKey((k) => k + 1);
    setIframeLoading(true);
  };

  const handleSaved = async (saved: Source) => {
    setModalOpen(false);
    const latest = await refresh();
    const current = latest.find((s) => s.id === saved.id) || saved;
    setSelected(current);
    setReloadKey((k) => k + 1);
    setIframeLoading(true);
    setTypeFilter('all');
    setRegion('all');
  };

  const handleRemove = async (source: Source) => {
    if (!window.confirm(`Remove "${source.name}" from the watchlist?`)) return;
    try {
      await removeSource(source);
      const latest = await refresh();
      if (selected?.id === source.id) {
        const next = latest.find((s) => s.id !== source.id) || null;
        setSelected(next);
        if (next) setIframeLoading(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove source');
    }
  };

  const copyLink = async () => {
    if (!selected) return;
    try {
      await navigator.clipboard.writeText(selected.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  const reloadPreview = () => {
    setReloadKey((k) => k + 1);
    setIframeLoading(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-emerald-400 uppercase">
            Tender Browser
          </p>
          <h1 className="font-display mt-1 text-2xl font-bold text-white sm:text-3xl">
            Watchlist & source browser
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Browse tracked tender portals and gazettes — or add a new source
            link for the team.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
        >
          <Plus className="h-4 w-4" /> Add source
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-300">
          <TriangleAlert className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
        {/* Watchlist panel */}
        <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/50">
          <div className="border-b border-slate-800 p-3">
            <div className="relative mb-3">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search sources…"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 pr-3 pl-9 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-emerald-400/60"
              />
            </div>
            <div className="flex gap-1 rounded-lg bg-slate-950/60 p-1">
              {TYPE_TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setTypeFilter(tab.value)}
                  className={[
                    'flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition',
                    typeFilter === tab.value
                      ? 'bg-slate-800 text-emerald-300'
                      : 'text-slate-500 hover:text-slate-300',
                  ].join(' ')}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {/* Region filter */}
            <div className="mt-3">
              <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
                <Map className="h-3 w-3" /> Region
              </p>
              <RegionFilter
                value={region}
                onChange={setRegion}
                counts={counts}
              />
            </div>
          </div>

          <div className="max-h-[320px] flex-1 overflow-y-auto p-2 lg:max-h-[calc(100vh-330px)]">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-500">
                <LoaderCircle className="h-5 w-5 animate-spin text-emerald-400" />
                Loading sources…
              </div>
            ) : visible.length === 0 ? (
              <div className="py-10 text-center text-sm text-slate-500">
                No sources match. Add one with “Add source”.
              </div>
            ) : (
              <ul className="space-y-1">
                {visible.map((source) => {
                  const active = selected?.id === source.id;
                  const Icon = source.source_type === 'gazette' ? Newspaper : Globe;
                  return (
                    <li key={source.id} className="group relative">
                      <button
                        onClick={() => choose(source)}
                        className={[
                          'w-full rounded-xl border px-3 py-2.5 text-left transition',
                          active
                            ? 'border-emerald-400/40 bg-emerald-500/10'
                            : 'border-transparent hover:border-slate-700 hover:bg-slate-800/50',
                        ].join(' ')}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={[
                              'grid h-8 w-8 shrink-0 place-items-center rounded-lg',
                              source.source_type === 'gazette'
                                ? 'bg-sky-500/10 text-sky-400'
                                : 'bg-emerald-500/10 text-emerald-400',
                            ].join(' ')}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="flex items-center gap-1.5 truncate text-sm font-medium text-slate-200">
                              <span className="truncate">{source.name}</span>
                              {source.verified && (
                                <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                              )}
                            </p>
                            <p className="truncate text-[11px] text-slate-500">
                              {source.country} · {source.category}
                            </p>
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleRemove(source)}
                        aria-label={`Remove ${source.name}`}
                        className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1.5 text-slate-600 opacity-0 transition group-hover:opacity-100 hover:bg-rose-500/10 hover:text-rose-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Preview panel */}
        <div className="flex min-h-[520px] flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 lg:min-h-[calc(100vh-240px)]">
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 bg-slate-900/80 px-3 py-2.5">
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-700/80 bg-slate-950/70 px-3 py-1.5">
              <MonitorPlay className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
              <span className="truncate text-xs text-slate-300">
                {selected ? selected.url : 'Select a source'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={reloadPreview}
                disabled={!selected}
                title="Reload"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-40"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                onClick={copyLink}
                disabled={!selected}
                title="Copy link"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-40"
              >
                {copied ? (
                  <BadgeCheck className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Link2 className="h-4 w-4" />
                )}
              </button>
              <a
                href={selected?.url || '#'}
                target="_blank"
                rel="noreferrer"
                title="Open in new tab"
                className={[
                  'flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition',
                  selected
                    ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30 hover:bg-emerald-500/25'
                    : 'pointer-events-none text-slate-600',
                ].join(' ')}
              >
                <Globe className="h-3.5 w-3.5" /> New tab
              </a>
            </div>
          </div>

          <div className="relative flex-1 bg-slate-950">
            {selected ? (
              <>
                {iframeLoading && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-slate-950">
                    <LoaderCircle className="h-7 w-7 animate-spin text-emerald-400" />
                    <p className="text-xs text-slate-500">
                      Loading {hostname(selected.url)}…
                    </p>
                  </div>
                )}
                <iframe
                  key={`${selected.id}-${reloadKey}`}
                  src={selected.url}
                  title={selected.name}
                  onLoad={() => setIframeLoading(false)}
                  className="h-full min-h-[460px] w-full border-0 bg-white"
                  referrerPolicy="no-referrer"
                />
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
                <Globe className="h-10 w-10 text-slate-700" />
                <p className="text-sm text-slate-500">
                  Select a source from the watchlist to preview it here.
                </p>
              </div>
            )}
          </div>

          <div className="flex items-start gap-2 border-t border-slate-800 bg-slate-900/80 px-4 py-2.5">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
            <p className="text-[11px] leading-relaxed text-slate-500">
              Some portals block in-app embedding for security. If a page
              appears blank, use
              <span className="text-slate-300"> “New tab”</span> to open it
              directly. Gazette PDFs usually render inline.
            </p>
          </div>
        </div>
      </div>

      <AddSourceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
      />
    </motion.div>
  );
}
