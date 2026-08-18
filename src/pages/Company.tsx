import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  BadgeCheck,
  Building2,
  ClipboardCheck,
  Database,
  ExternalLink,
  Globe,
  Landmark,
  Mail,
  MapPin,
  MonitorSmartphone,
  Phone,
  Server,
  Wallet,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SERVICE_LINES = [
  {
    icon: Database,
    title: 'MIS & Social Protection Systems',
    desc: 'Design and implementation of management information systems, beneficiary registries and social protection platforms.',
  },
  {
    icon: Wallet,
    title: 'G2P Payment Systems',
    desc: 'Government-to-person payment digitisation, reconciliation, assurance and last-mile delivery support.',
  },
  {
    icon: Landmark,
    title: 'Public Finance Solutions',
    desc: 'PFM analytics, budgeting, reporting and accountability platforms for public institutions.',
  },
  {
    icon: MonitorSmartphone,
    title: 'Web Design & SEO',
    desc: 'Corporate websites, citizen portals and digital communication with search-optimised delivery.',
  },
  {
    icon: ClipboardCheck,
    title: 'Research, Monitoring & Evaluation',
    desc: 'Programme evaluations, registry data validation, impact studies and MEL systems.',
  },
  {
    icon: Server,
    title: 'ICT Support & Infrastructure',
    desc: 'Helpdesk services, network administration, systems integration and technical support.',
  },
];

const STATS = [
  { value: '10+', label: 'Years of experience' },
  { value: '30+', label: 'Countries served' },
  { value: '6', label: 'Service lines' },
  { value: 'Nairobi', label: 'Headquarters' },
];

export default function Company() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-emerald-500/15 via-slate-900/60 to-slate-950 p-8 sm:p-10">
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-300">
              <BadgeCheck className="h-3.5 w-3.5" /> Verified bidder profile
            </span>
            <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[11px] font-medium text-slate-400">
              GSC LTD
            </span>
          </div>
          <h1 className="font-display max-w-2xl text-3xl leading-tight font-bold text-white sm:text-4xl">
            GlobeCon Convergence Solutions
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            A Nairobi-headquartered technology and consulting firm delivering
            MIS and social protection systems, G2P payment solutions, public
            finance platforms and digital services — with over a decade of
            projects across 30+ countries.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="https://globeconcs.com/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              <Globe className="h-4 w-4" /> globeconcs.com
            </a>
            <Link
              to="/browser"
              className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-emerald-400/40 hover:text-emerald-300"
            >
              Open Tender Browser <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 text-center"
          >
            <p className="font-display text-2xl font-bold text-emerald-300">
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Service lines */}
      <div className="mt-10">
        <h2 className="font-display text-lg font-semibold text-white">
          Service lines
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Tenders on the watchlist are matched against these Globecon
          capabilities.
        </p>
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {SERVICE_LINES.map((line) => (
            <div
              key={line.title}
              className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-5 transition hover:border-emerald-400/30"
            >
              <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-400/25 transition group-hover:bg-emerald-500/20">
                <line.icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">{line.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                {line.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
        <h2 className="font-display text-lg font-semibold text-white">
          Contact & tender correspondence
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <a
            href="mailto:info@globeconcs.com"
            className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3.5 transition hover:border-emerald-400/30"
          >
            <Mail className="h-4 w-4 shrink-0 text-emerald-400" />
            <div className="min-w-0">
              <p className="text-[11px] text-slate-500">General enquiries</p>
              <p className="truncate text-xs font-medium text-slate-200">
                info@globeconcs.com
              </p>
            </div>
          </a>
          <a
            href="mailto:md@globeconcs.com"
            className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3.5 transition hover:border-emerald-400/30"
          >
            <Mail className="h-4 w-4 shrink-0 text-sky-400" />
            <div className="min-w-0">
              <p className="text-[11px] text-slate-500">Managing Director</p>
              <p className="truncate text-xs font-medium text-slate-200">
                md@globeconcs.com
              </p>
            </div>
          </a>
          <a
            href="tel:+254725275610"
            className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3.5 transition hover:border-emerald-400/30"
          >
            <Phone className="h-4 w-4 shrink-0 text-emerald-400" />
            <div>
              <p className="text-[11px] text-slate-500">Phone</p>
              <p className="text-xs font-medium text-slate-200">
                +254 725 275 610
              </p>
            </div>
          </a>
          <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3.5">
            <MapPin className="h-4 w-4 shrink-0 text-amber-400" />
            <div>
              <p className="text-[11px] text-slate-500">Headquarters</p>
              <p className="text-xs font-medium text-slate-200">
                Nairobi, Kenya
              </p>
            </div>
          </div>
        </div>
        <p className="mt-5 flex items-center gap-2 text-[11px] text-slate-500">
          <Building2 className="h-3 w-3" />
          Full company profile and project portfolio available at
          globeconcs.com
          <ExternalLink className="h-3 w-3" />
        </p>
      </div>
    </motion.div>
  );
}
