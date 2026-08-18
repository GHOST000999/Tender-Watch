import { useState } from 'react';
import { Globe, LoaderCircle, Newspaper, Plus, X } from 'lucide-react';
import { addSource } from '../lib/api';
import { SCOPE_LABEL, sourceScope } from '../lib/geo';
import type { NewSourceInput, Source, SourceType } from '../lib/types';

export const SOURCE_CATEGORIES = [
  'Government Portal',
  'Aggregator',
  'ICT & Technology',
  'County Government',
  'Development Partner',
  'Government Gazette',
  'Private Sector',
  'Other',
];

const INPUT_CLS =
  'w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20';

interface AddSourceModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: (source: Source) => void;
}

export default function AddSourceModal({
  open,
  onClose,
  onSaved,
}: AddSourceModalProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [sourceType, setSourceType] = useState<SourceType>('tender_site');
  const [category, setCategory] = useState('Government Portal');
  const [country, setCountry] = useState('Kenya');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const previewScope = sourceScope({
    country,
    name,
    description: notes,
  });

  const reset = () => {
    setName('');
    setUrl('');
    setSourceType('tender_site');
    setCategory('Government Portal');
    setCountry('Kenya');
    setNotes('');
    setError('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (!name.trim()) return setError('Source name is required.');
    const candidate = url.trim();
    if (!candidate) return setError('URL is required.');
    const normalised = /^https?:\/\//i.test(candidate)
      ? candidate
      : `https://${candidate}`;
    if (!/^https?:\/\/.+\..+/.test(normalised)) {
      return setError('Please enter a valid URL.');
    }
    setSaving(true);
    try {
      const input: NewSourceInput = {
        name: name.trim(),
        url: candidate,
        source_type: sourceType,
        category,
        country: country.trim() || 'Kenya',
        description: notes.trim(),
      };
      const { source } = await addSource(input);
      reset();
      onSaved(source);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add source');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-black/50">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold text-white">
              Add to watchlist
            </h3>
            <p className="mt-0.5 text-xs text-slate-400">
              Track a new tender website or government gazette.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {([
              { value: 'tender_site', label: 'Tender Site', icon: Globe },
              { value: 'gazette', label: 'Gazette', icon: Newspaper },
            ] as const).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setSourceType(option.value);
                  if (option.value === 'gazette') {
                    setCategory('Government Gazette');
                  } else if (category === 'Government Gazette') {
                    setCategory('Government Portal');
                  }
                }}
                className={[
                  'flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition',
                  sourceType === option.value
                    ? 'border-emerald-400/60 bg-emerald-500/10 text-emerald-300'
                    : 'border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600',
                ].join(' ')}
              >
                <option.icon className="h-4 w-4" />
                {option.label}
              </button>
            ))}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">
              Source name *
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
                sourceType === 'gazette'
                  ? 'e.g. Kenya Gazette — Vol. CXXVIII No. 42'
                  : 'e.g. Nairobi County Tenders'
              }
              className={INPUT_CLS}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">
              {sourceType === 'gazette'
                ? 'Gazette link (URL or PDF) *'
                : 'Tender site link *'}
            </label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://…"
              className={INPUT_CLS}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={INPUT_CLS}
              >
                {SOURCE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                Country
              </label>
              <input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. Kenya, Uganda…"
                className={INPUT_CLS}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300">Region scope:</span>
            <span className="font-semibold text-emerald-300">
              {SCOPE_LABEL[previewScope]}
            </span>
            <span className="text-slate-500">
              — set by country; used by the Africa / East Africa / Kenya filters
            </span>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="What should the team watch for on this source?"
              className={`${INPUT_CLS} resize-none`}
            />
          </div>

          {error && (
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
            >
              {saving ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {saving ? 'Adding…' : 'Add source'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
