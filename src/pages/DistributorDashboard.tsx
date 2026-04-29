import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Clock3,
  PackageCheck,
  Route,
  ShoppingCart,
  ThermometerSnowflake,
  Truck,
  Warehouse,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const throughputData = [
  { month: 'Jan', orders: 48 },
  { month: 'Feb', orders: 62 },
  { month: 'Mar', orders: 55 },
  { month: 'Apr', orders: 78 },
  { month: 'May', orders: 94 },
  { month: 'Jun', orders: 71 },
  { month: 'Jul', orders: 58 },
  { month: 'Aug', orders: 46 },
];

const statCards = [
  {
    title: 'Total Orders',
    value: '342',
    note: '+12% from last month',
    status: 'Order volume rising',
    icon: ShoppingCart,
    accent: 'text-primary',
    bar: 'bg-primary',
  },
  {
    title: 'Pending Release',
    value: '18',
    note: '6 need approval within 30 min',
    status: 'Needs attention',
    icon: Clock3,
    accent: 'text-amber-400',
    bar: 'bg-amber-400',
  },
  {
    title: 'In Transit',
    value: '27',
    note: '8 arriving today',
    status: 'Fleet moving',
    icon: Truck,
    accent: 'text-cyan-400',
    bar: 'bg-cyan-400',
  },
  {
    title: 'Delivered',
    value: '297',
    note: '99.4% success rate',
    status: 'Service stable',
    icon: CheckCircle2,
    accent: 'text-emerald-400',
    bar: 'bg-emerald-400',
  },
];

const recentActivity = [
  {
    title: 'Order accepted',
    detail: 'City Pharmacy · ID #MS-9942 released for pick and pack.',
    time: '2 min ago',
    tone: 'success',
  },
  {
    title: 'Order dispatched',
    detail: 'HealthPlus Store · ID #MS-9811 left the north warehouse.',
    time: '45 min ago',
    tone: 'neutral',
  },
  {
    title: 'Delivered successfully',
    detail: 'St. Jude Medical received cold-chain lot #MS-9755.',
    time: '3 hrs ago',
    tone: 'success',
  },
  {
    title: 'System backup complete',
    detail: 'Automated warehouse synchronization closed with no drift.',
    time: 'Yesterday',
    tone: 'muted',
  },
];

const inventoryHealth = [
  { label: 'Critical care medications', value: 88, tone: 'bg-primary' },
  { label: 'Surgical supplies', value: 62, tone: 'bg-emerald-400' },
  { label: 'PPE and hygiene', value: 34, tone: 'bg-rose-400' },
];

export default function DistributorDashboard() {
  const [selectedYear] = useState('Year 2026');

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="relative overflow-hidden rounded-[30px] border border-white/8 bg-card/80 p-8 shadow-card">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.12),transparent_28%)]" />

          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-primary/20 bg-primary/10 px-3 py-1 text-primary" variant="outline">
                Distributor Dashboard
              </Badge>
              <Badge className="border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-cyan-400" variant="outline">
                24 active high-priority routes
              </Badge>
            </div>

            <div className="mt-5 max-w-2xl">
              <h2 className="text-4xl font-bold leading-tight text-foreground">
                Real-time supply chain control for pharmacy orders, corridors, and cold-chain delivery.
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                This version is built for MedSecure distributors: faster order release, route clarity,
                pharmacy-level SLA tracking, and inventory pressure at warehouse level.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="h-12 rounded-2xl px-5 text-sm font-semibold">
                <Link to="/distributor/orders">
                  Open order queue
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-2xl border-white/10 bg-white/[0.03] px-5 text-sm"
              >
                <Link to="/distributor/tracking">Track live routes</Link>
              </Button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/8 bg-background/50 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Release backlog</p>
                <p className="mt-2 text-2xl font-bold text-foreground">06 urgent</p>
                <p className="mt-1 text-sm text-amber-400">Pharmacies waiting under 30 min SLA</p>
              </div>
              <div className="rounded-3xl border border-white/8 bg-background/50 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Cold-chain routes</p>
                <p className="mt-2 text-2xl font-bold text-foreground">08 live</p>
                <p className="mt-1 text-sm text-cyan-400">No critical temperature breaches</p>
              </div>
              <div className="rounded-3xl border border-white/8 bg-background/50 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Warehouse sync</p>
                <p className="mt-2 text-2xl font-bold text-foreground">99.1%</p>
                <p className="mt-1 text-sm text-primary">Inventory feed healthy</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <div className="rounded-[30px] border border-white/8 bg-card/80 p-6 shadow-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  Corridor watch
                </p>
                <h3 className="mt-2 text-2xl font-bold text-foreground">Northeast corridor stable</h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Route className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border border-white/8 bg-background/45 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">On-time arrival</span>
                  <span className="font-semibold text-foreground">94%</span>
                </div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-background/45 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Average handoff delay</span>
                  <span className="font-semibold text-primary">11 min</span>
                </div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-background/45 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Cold-chain anomalies</span>
                  <span className="font-semibold text-emerald-400">0 critical</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/8 bg-card/80 p-6 shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-400/10 text-rose-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Attention needed</p>
                <p className="text-xs text-muted-foreground">Warehouse decision support</p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-muted-foreground">
              Prioritize PPE replenishment and clear the six urgent release requests before the next
              evening dispatch wave to protect delivery SLAs.
            </p>

            <Button asChild variant="ghost" className="mt-4 px-0 text-primary hover:bg-transparent">
              <Link to="/distributor/orders">
                Review urgent queue
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => (
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
                Orders handled per month
              </p>
              <h3 className="mt-2 text-3xl font-bold text-foreground">Distribution throughput</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Volume distribution for the current logistics cycle across connected pharmacy hubs.
              </p>
            </div>

            <Badge className="border-white/8 bg-white/[0.03] px-4 py-2 text-muted-foreground" variant="outline">
              {selectedYear}
            </Badge>
          </div>

          <div className="mt-8 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={throughputData}>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid rgba(148, 163, 184, 0.15)',
                    borderRadius: '18px',
                    color: 'hsl(var(--card-foreground))',
                  }}
                />
                <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/8 bg-card/80 p-6 shadow-card">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Recent activity</p>
              <h3 className="mt-2 text-3xl font-bold text-foreground">Ops feed</h3>
            </div>
            <PackageCheck className="h-5 w-5 text-primary" />
          </div>

          <div className="mt-6 space-y-5">
            {recentActivity.map((item, index) => {
              const dotColor =
                item.tone === 'success'
                  ? 'bg-emerald-400'
                  : item.tone === 'neutral'
                    ? 'bg-cyan-400'
                    : 'bg-white/30';

              return (
                <div key={item.title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`mt-1 h-3.5 w-3.5 rounded-full ${dotColor}`} />
                    {index < recentActivity.length - 1 && <div className="mt-2 h-full w-px bg-white/8" />}
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-background/45 p-4">
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.detail}</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {item.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <Button asChild variant="outline" className="mt-6 h-12 w-full rounded-2xl border-white/10 bg-white/[0.03]">
            <Link to="/distributor/tracking">View all route logs</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[32px] border border-white/8 bg-card/80 p-6 shadow-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-primary">Live network</p>
              <h3 className="mt-3 text-3xl font-bold text-foreground">Regional logistics map</h3>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                Tracking 27 active transit units across the northeast corridor with route health,
                cold-chain integrity, and handoff stability in one place.
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Route className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[0.78fr_1.22fr]">
            <div className="rounded-[28px] border border-white/8 bg-background/45 p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">On time</p>
                  <p className="mt-2 text-4xl font-bold text-foreground">94%</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">In route now</p>
                  <p className="mt-2 text-4xl font-bold text-cyan-400">18</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Warehouses linked</p>
                  <p className="mt-2 text-4xl font-bold text-primary">6 hubs</p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[28px] border border-white/8 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.08),transparent_45%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))] p-6">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:42px_42px] opacity-30" />
              <div className="relative flex h-full items-center justify-center rounded-[24px] border border-white/5 bg-black/10">
                <div className="absolute left-[18%] top-[28%] h-3.5 w-3.5 rounded-full bg-primary shadow-[0_0_24px_rgba(45,212,191,0.65)]" />
                <div className="absolute left-[48%] top-[40%] h-3.5 w-3.5 rounded-full bg-cyan-400 shadow-[0_0_24px_rgba(34,211,238,0.65)]" />
                <div className="absolute right-[16%] bottom-[26%] h-3.5 w-3.5 rounded-full bg-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.65)]" />
                <div className="absolute left-[20%] top-[30%] h-px w-[34%] rotate-[14deg] bg-gradient-to-r from-primary to-transparent" />
                <div className="absolute left-[48%] top-[43%] h-px w-[28%] rotate-[26deg] bg-gradient-to-r from-cyan-400 to-transparent" />
                <p className="text-sm uppercase tracking-[0.26em] text-muted-foreground">Route mesh active</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/8 bg-card/80 p-6 shadow-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Inventory health
              </p>
              <h3 className="mt-2 text-3xl font-bold text-foreground">Warehouse stock outlook</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Stock levels across key distributor categories with restock priority surfaced.
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">
              <Boxes className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-4">
            <Badge className="border-primary/20 bg-primary/10 px-3 py-1 text-primary" variant="outline">
              Auto-restock active
            </Badge>
          </div>

          <div className="mt-6 space-y-5">
            {inventoryHealth.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                  <span className="text-sm font-semibold text-foreground">{item.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/5">
                  <div className={`h-2 rounded-full ${item.tone}`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-cyan-400/10 bg-cyan-400/8 px-4 py-4 text-sm text-cyan-400">
            PPE and hygiene stock will fall below threshold within two dispatch cycles if not replenished.
          </div>

          <Button asChild variant="ghost" className="mt-5 px-0 text-primary hover:bg-transparent">
            <Link to="/distributor/orders">
              Full inventory audit
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
