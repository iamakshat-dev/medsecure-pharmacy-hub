import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Boxes,
  ClipboardCheck,
  PackageCheck,
  ShieldCheck,
  Snowflake,
  Sparkles,
  TrendingUp,
  Truck,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const performanceData = {
  verified: [
    { label: 'Jan', value: 1320 },
    { label: 'Feb', value: 1480 },
    { label: 'Mar', value: 1410 },
    { label: 'Apr', value: 1660 },
    { label: 'May', value: 1745 },
    { label: 'Jun', value: 1690 },
    { label: 'Jul', value: 1880 },
  ],
  issued: [
    { label: 'Jan', value: 780 },
    { label: 'Feb', value: 910 },
    { label: 'Mar', value: 860 },
    { label: 'Apr', value: 1110 },
    { label: 'May', value: 1260 },
    { label: 'Jun', value: 1185 },
    { label: 'Jul', value: 1390 },
  ],
};

const highlights = [
  {
    title: 'Authenticated Packs',
    value: '12,840',
    note: '+12.5% this month',
    status: 'Chain stable',
    icon: ShieldCheck,
    accent: 'text-primary',
    bar: 'bg-primary',
  },
  {
    title: 'Live Inventory Units',
    value: '8,212',
    note: 'Healthy spread across 46 SKUs',
    status: 'Inventory healthy',
    icon: Boxes,
    accent: 'text-emerald-400',
    bar: 'bg-emerald-400',
  },
  {
    title: 'Dispatches Today',
    value: '284',
    note: '18 routes closed before noon',
    status: 'On schedule',
    icon: Truck,
    accent: 'text-cyan-400',
    bar: 'bg-cyan-400',
  },
  {
    title: 'Critical Alerts',
    value: '04',
    note: '2 low stock, 2 cold-chain review',
    status: 'Needs attention',
    icon: AlertTriangle,
    accent: 'text-rose-400',
    bar: 'bg-rose-400',
  },
];

const activityFeed = [
  {
    title: 'Batch BAT-2026-007 verified',
    description: 'DOLO 650 passed QR seal, invoice, and distributor signature checks.',
    time: '14:20 IST',
    tone: 'success',
  },
  {
    title: 'Cold-chain alert acknowledged',
    description: 'Storage cabinet C-14 briefly crossed 7.8°C and is back within range.',
    time: '12:05 IST',
    tone: 'warning',
  },
  {
    title: 'Inventory reconciliation complete',
    description: 'Morning count closed with zero mismatch in analgesics and antibiotics.',
    time: '10:10 IST',
    tone: 'neutral',
  },
  {
    title: 'Distributor route synchronized',
    description: 'North cluster dispatch manifests synced from MedDist Hub in 43 seconds.',
    time: '08:45 IST',
    tone: 'success',
  },
];

const watchlist = [
  { name: 'Amoxicillin 250mg', batch: 'BAT-2026-002', stock: 10, status: 'Restock today' },
  { name: 'Cetirizine 10mg', batch: 'BAT-2026-004', stock: 3, status: 'Near outage' },
  { name: 'Omeprazole 20mg', batch: 'BAT-2026-006', stock: 45, status: 'Monitor closely' },
];

export default function Dashboard() {
  const [activeMetric, setActiveMetric] = useState<'verified' | 'issued'>('verified');

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
        <div className="relative overflow-hidden rounded-[30px] border border-white/8 bg-card/80 p-8 shadow-card">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.14),transparent_28%)]" />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-primary/20 bg-primary/10 px-3 py-1 text-primary" variant="outline">
                Pharmacy Operations
              </Badge>
              <Badge className="border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-emerald-400" variant="outline">
                99.2% compliance uptime
              </Badge>
            </div>

            <div className="mt-5 max-w-2xl">
              <h2 className="text-4xl font-bold leading-tight text-foreground">
                A cleaner command center for pharmacy stock, trust checks, and distributor flow.
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                This dashboard turns the sample inspiration into MedSecure&apos;s real use case:
                authenticated medicine movement, live shelf pressure, and actionable cold-chain risk.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                asChild
                className="h-12 rounded-2xl border-0 px-5 text-sm font-semibold shadow-[0_18px_40px_-18px_rgba(45,212,191,0.65)]"
              >
                <Link to="/dashboard/inventory">
                  Review inventory
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-2xl border-white/10 bg-white/[0.03] px-5 text-sm"
              >
                <Link to="/dashboard/authentication">Open verification desk</Link>
              </Button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/8 bg-background/50 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  Verified today
                </p>
                <p className="mt-2 text-2xl font-bold text-foreground">184 batches</p>
                <p className="mt-1 text-sm text-primary">+18 from yesterday</p>
              </div>
              <div className="rounded-3xl border border-white/8 bg-background/50 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  Incoming routes
                </p>
                <p className="mt-2 text-2xl font-bold text-foreground">07 active</p>
                <p className="mt-1 text-sm text-cyan-400">Next ETA 18 minutes</p>
              </div>
              <div className="rounded-3xl border border-white/8 bg-background/50 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  Pending interventions
                </p>
                <p className="mt-2 text-2xl font-bold text-foreground">02 urgent</p>
                <p className="mt-1 text-sm text-rose-400">Cold room + restock</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <div className="rounded-[30px] border border-white/8 bg-card/80 p-6 shadow-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  Today&apos;s trust snapshot
                </p>
                <h3 className="mt-2 text-2xl font-bold text-foreground">Shelf-to-patient integrity intact</h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <BadgeCheck className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border border-white/8 bg-background/45 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Serial scans cleared</span>
                  <span className="font-semibold text-foreground">96.8%</span>
                </div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-background/45 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Audit trail freshness</span>
                  <span className="font-semibold text-primary">2 min ago</span>
                </div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-background/45 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Counterfeit cases</span>
                  <span className="font-semibold text-rose-400">0 escalated</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/8 bg-card/80 p-6 shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Ops recommendation</p>
                <p className="text-xs text-muted-foreground">Generated from live stock trend</p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-muted-foreground">
              Prioritize replenishment for analgesics before tonight&apos;s dispatch window and run
              verification on fresh BAT-2026-007 receipts before shelving.
            </p>

            <Button asChild variant="ghost" className="mt-4 px-0 text-primary hover:bg-transparent">
              <Link to="/dashboard/tracking">
                Review route detail
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {highlights.map((item) => (
          <div
            key={item.title}
            className="rounded-[28px] border border-white/8 bg-card/80 p-6 shadow-card transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] ${item.accent}`}>
                <item.icon className="h-5 w-5" />
              </div>
              <Badge className="border-white/8 bg-white/[0.03] px-3 py-1 text-muted-foreground" variant="outline">
                {item.status}
              </Badge>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">{item.title}</p>
            <p className="mt-2 text-4xl font-bold text-foreground">{item.value}</p>
            <p className={`mt-2 text-sm ${item.accent}`}>{item.note}</p>

            <div className="mt-6 h-1.5 rounded-full bg-white/5">
              <div className={`h-1.5 rounded-full ${item.bar}`} style={{ width: '58%' }} />
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-[32px] border border-white/8 bg-card/80 p-6 shadow-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Monthly operations performance
              </p>
              <h3 className="mt-2 text-3xl font-bold text-foreground">
                Verification and issue velocity
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Compare authenticated packs with issued medicine movement across the current cycle.
              </p>
            </div>

            <div className="inline-flex rounded-2xl border border-white/8 bg-background/45 p-1">
              <button
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                  activeMetric === 'verified'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveMetric('verified')}
              >
                Verified units
              </button>
              <button
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                  activeMetric === 'issued'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveMetric('issued')}
              >
                Stock issued
              </button>
            </div>
          </div>

          <div className="mt-8 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData[activeMetric]}>
                <defs>
                  <linearGradient id="opsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid rgba(148, 163, 184, 0.15)',
                    borderRadius: '18px',
                    color: 'hsl(var(--card-foreground))',
                  }}
                />
                <Area
                  dataKey="value"
                  type="monotone"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  fill="url(#opsFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/8 bg-card/80 p-6 shadow-card">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Recent activity
              </p>
              <h3 className="mt-2 text-3xl font-bold text-foreground">Audit feed</h3>
            </div>
            <ClipboardCheck className="h-5 w-5 text-primary" />
          </div>

          <div className="mt-6 space-y-5">
            {activityFeed.map((item, index) => {
              const dotColor =
                item.tone === 'success'
                  ? 'bg-emerald-400'
                  : item.tone === 'warning'
                    ? 'bg-rose-400'
                    : 'bg-cyan-400';

              return (
                <div key={item.title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`mt-1 h-3.5 w-3.5 rounded-full ${dotColor}`} />
                    {index < activityFeed.length - 1 && <div className="mt-2 h-full w-px bg-white/8" />}
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-background/45 p-4">
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {item.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <Button asChild variant="outline" className="mt-6 h-12 w-full rounded-2xl border-white/10 bg-white/[0.03]">
            <Link to="/dashboard/authentication">View verification queue</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[32px] border border-white/8 bg-card/80 p-6 shadow-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-primary">Priority batch spotlight</p>
              <h3 className="mt-3 text-3xl font-bold text-foreground">DOLO 650 replenishment lane</h3>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                Fast-moving analgesic inventory is healthy right now, but tonight&apos;s route demand
                will consume 32% of available shelf stock. Reserve one replenishment lot before
                dispatch closure.
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <PackageCheck className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[0.82fr_1.18fr]">
            <div className="relative overflow-hidden rounded-[28px] border border-primary/10 bg-[linear-gradient(180deg,rgba(16,185,129,0.18),rgba(8,17,26,0.8))] p-6">
              <div className="absolute -right-10 top-6 h-24 w-24 rounded-full bg-cyan-400/20 blur-2xl" />
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/10 bg-black/20 text-primary">
                  <PackageCheck className="h-10 w-10" />
                </div>
                <p className="mt-6 text-xs uppercase tracking-[0.25em] text-primary">
                  Trusted batch
                </p>
                <p className="mt-2 text-lg font-semibold text-foreground">BAT-2026-007</p>
                <p className="mt-2 text-sm text-muted-foreground">Verified 3 times since intake</p>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="rounded-2xl border border-white/8 bg-background/45 px-4 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current shelf units</span>
                  <span className="font-semibold text-foreground">1,000</span>
                </div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-background/45 px-4 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Projected route demand</span>
                  <span className="font-semibold text-cyan-400">320 units tonight</span>
                </div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-background/45 px-4 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Verification confidence</span>
                  <span className="font-semibold text-primary">98.9%</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild className="h-12 rounded-2xl px-5">
                  <Link to="/dashboard/inventory">Restock plan</Link>
                </Button>
                <Button asChild variant="outline" className="h-12 rounded-2xl border-white/10 bg-white/[0.03] px-5">
                  <Link to="/dashboard/authentication">Run verification</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/8 bg-card/80 p-6 shadow-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Risk and integrity watch
              </p>
              <h3 className="mt-2 text-3xl font-bold text-foreground">Cold-chain and stock watchlist</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Critical SKUs and environmental controls that need pharmacist attention.
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">
              <Snowflake className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/8 bg-background/45 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Vault temperature</p>
              <p className="mt-2 text-3xl font-bold text-cyan-400">4.2°C</p>
              <p className="mt-1 text-sm text-muted-foreground">Stable for the last 6 hours</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-background/45 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Access level</p>
              <p className="mt-2 text-3xl font-bold text-primary">Class A</p>
              <p className="mt-1 text-sm text-muted-foreground">2 pharmacists on active proximity</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {watchlist.map((item) => (
              <div
                key={item.batch}
                className="flex flex-col gap-3 rounded-2xl border border-white/8 bg-background/45 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.name}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {item.batch}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground">{item.stock} units</span>
                  <Badge className="border-rose-400/20 bg-rose-400/10 px-3 py-1 text-rose-400" variant="outline">
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-2xl border border-primary/15 bg-primary/8 px-4 py-4 text-sm text-primary">
            <TrendingUp className="h-4 w-4" />
            Inventory demand trend indicates antibiotics will spike again after 18:00.
          </div>
        </div>
      </section>
    </div>
  );
}
