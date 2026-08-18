import { Globe, Map, MapPin, Radar } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { RegionFilterValue } from '../lib/geo';

export interface RegionOption {
  value: RegionFilterValue;
  label: string;
  icon: LucideIcon;
  hint: string;
}

/**
 * The geographic drill-down offered across Tender Watch:
 * All regions → Africa → East Africa → Kenya.
 */
export const REGION_OPTIONS: RegionOption[] = [
  {
    value: 'all',
    label: 'All regions',
    icon: Radar,
    hint: 'Everything tracked, including global opportunities',
  },
  {
    value: 'africa',
    label: 'Africa',
    icon: Globe,
    hint: 'Africa-wide, East African and Kenya opportunities',
  },
  {
    value: 'east_africa',
    label: 'East Africa',
    icon: Map,
    hint: 'East African opportunities, including Kenya',
  },
  {
    value: 'kenya',
    label: 'Kenya',
    icon: MapPin,
    hint: 'Kenya-only opportunities',
  },
];

interface RegionFilterProps {
  value: RegionFilterValue;
  onChange: (value: RegionFilterValue) => void;
  counts?: Partial<Record<RegionFilterValue, number>>;
  className?: string;
}

export default function RegionFilter({
  value,
  onChange,
  counts,
  className = '',
}: RegionFilterProps) {
  return (
    <div
      className={`flex flex-wrap items-center gap-1.5 ${className}`}
      role="group"
      aria-label="Filter by region"
    >
      {REGION_OPTIONS.map((option) => {
        const active = value === option.value;
        const Icon = option.icon;
        const count = counts?.[option.value];
        return (
          <button
            key={option.value}
            type="button"
            title={option.hint}
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={[
              'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition',
              active
                ? 'border-emerald-400/50 bg-emerald-500/15 text-emerald-300 shadow-sm shadow-emerald-500/20'
                : 'border-slate-700 bg-slate-900/60 text-slate-400 hover:border-slate-500 hover:text-slate-200',
            ].join(' ')}
          >
            <Icon className="h-3.5 w-3.5" />
            {option.label}
            {count !== undefined && (
              <span
                className={[
                  'rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums',
                  active
                    ? 'bg-emerald-400/20 text-emerald-200'
                    : 'bg-slate-800 text-slate-500',
                ].join(' ')}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
