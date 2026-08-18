import { Earth, Globe, Map, MapPin } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SCOPE_LABEL, type GeoScope } from '../lib/geo';

const STYLES: Record<GeoScope, { cls: string; icon: LucideIcon }> = {
  kenya: {
    cls: 'bg-emerald-500/10 text-emerald-300 ring-emerald-400/25',
    icon: MapPin,
  },
  east_africa: {
    cls: 'bg-sky-500/10 text-sky-300 ring-sky-400/25',
    icon: Map,
  },
  africa: {
    cls: 'bg-violet-500/10 text-violet-300 ring-violet-400/25',
    icon: Globe,
  },
  global: {
    cls: 'bg-slate-700/40 text-slate-300 ring-slate-600/40',
    icon: Earth,
  },
};

export default function ScopeBadge({ scope }: { scope: GeoScope }) {
  const style = STYLES[scope];
  const Icon = style.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${style.cls}`}
      title={`Geographic scope: ${SCOPE_LABEL[scope]}`}
    >
      <Icon className="h-3 w-3" />
      {SCOPE_LABEL[scope]}
    </span>
  );
}
