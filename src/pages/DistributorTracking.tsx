import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  Plus,
  ScanSearch,
  ThermometerSnowflake,
  Truck,
  Warehouse,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const stepDefs = [
  { label: 'Order Placed', icon: Package },
  { label: 'Prepared', icon: Warehouse },
  { label: 'In Transit', icon: Truck },
  { label: 'Out for Delivery', icon: MapPin },
  { label: 'Delivered', icon: CheckCircle2 },
];

interface TrackedOrder {
  id: string;
  pharmacyName: string;
  medicineName: string;
  activeStep: number;
  expectedDate: string;
  routeType: 'Cold Chain' | 'Standard';
  destination: string;
  etaLabel: string;
}

const initialOrders: TrackedOrder[] = [
  {
    id: 'MS-882104',
    pharmacyName: 'Central Health Hub',
    medicineName: 'Insulin Rapid Humalog Bundle (80 Units)',
    activeStep: 2,
    expectedDate: '2026-04-29',
    routeType: 'Cold Chain',
    destination: 'Chicago IL',
    etaLabel: 'Today, 16:45 PM',
  },
  {
    id: 'MS-901422',
    pharmacyName: 'St. Anne Pharmacy',
    medicineName: 'Cardiac Monitor Kit v2',
    activeStep: 1,
    expectedDate: '2026-04-30',
    routeType: 'Standard',
    destination: 'Milwaukee WI',
    etaLabel: 'Tomorrow, 09:30 AM',
  },
  {
    id: 'MS-901880',
    pharmacyName: 'Wellness First Clinic',
    medicineName: 'Oxytocin Ampoules (50x)',
    activeStep: 3,
    expectedDate: '2026-04-29',
    routeType: 'Standard',
    destination: 'Naperville IL',
    etaLabel: 'Today, 18:10 PM',
  },
];

const fleetMetrics = [
  { label: 'On time', value: '98.2%' },
  { label: 'Active hubs', value: '42' },
  { label: 'In transit', value: '14' },
  { label: 'Alerts', value: '0' },
];

export default function DistributorTracking() {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ step: number; date: string }>({ step: 0, date: '' });

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        const query = search.toLowerCase();
        return (
          order.id.toLowerCase().includes(query) ||
          order.medicineName.toLowerCase().includes(query) ||
          order.pharmacyName.toLowerCase().includes(query) ||
          order.destination.toLowerCase().includes(query)
        );
      }),
    [orders, search],
  );

  const featuredOrder = filteredOrders[0];
  const supportOrders = filteredOrders.slice(1);

  const openUpdate = (order: TrackedOrder) => {
    setSelectedOrder(order.id);
    setEditData({ step: order.activeStep, date: order.expectedDate });
  };

  const saveUpdate = () => {
    if (!selectedOrder) return;

    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === selectedOrder
          ? { ...order, activeStep: editData.step, expectedDate: editData.date }
          : order,
      ),
    );

    setSelectedOrder(null);
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-primary/20 bg-primary/10 px-3 py-1 text-primary" variant="outline">
              Live Logistics Tracking
            </Badge>
            <Badge className="border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-cyan-400" variant="outline">
              Monitoring 24 active high-priority shipments
            </Badge>
          </div>

          <h1 className="mt-5 text-4xl font-bold leading-tight text-foreground">
            Monitor route progress, ETA risk, and cold-chain movement in one screen.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
            The distributor tracking desk now focuses on live route status, delivery stage,
            destination clarity, and fast status updates for urgent pharmacy shipments.
          </p>
        </div>

        <Button className="h-14 rounded-2xl px-6 text-base font-semibold">
          <Plus className="h-5 w-5" />
          Create new order
        </Button>
      </section>

      <section className="rounded-[30px] border border-white/8 bg-card/80 p-6 shadow-card">
        <div className="relative max-w-lg">
          <ScanSearch className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search tracking ID, destination, or pharmacy..."
            className="h-12 rounded-2xl border-white/10 bg-white/[0.03] pl-11"
          />
        </div>
      </section>

      {featuredOrder && (
        <section className="rounded-[32px] border border-white/8 bg-card/80 p-8 shadow-card">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="flex gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[24px] bg-primary/10 text-primary">
                <Truck className="h-7 w-7" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="border-cyan-400/20 bg-cyan-400/10 text-cyan-400" variant="outline">
                    {featuredOrder.routeType}
                  </Badge>
                  <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    ID: {featuredOrder.id}
                  </span>
                </div>
                <h2 className="mt-3 text-4xl font-bold leading-tight text-foreground">
                  {featuredOrder.medicineName}
                </h2>
                <p className="mt-2 text-lg text-muted-foreground">
                  Destination: {featuredOrder.pharmacyName}, {featuredOrder.destination}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-4 xl:items-end">
              <div className="rounded-2xl border border-white/8 bg-background/45 px-5 py-4 text-left xl:text-right">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Estimated arrival</p>
                <p className="mt-2 text-2xl font-bold text-primary">{featuredOrder.etaLabel}</p>
              </div>
              <Button
                variant="outline"
                className="h-12 rounded-2xl border-white/10 bg-white/[0.03] px-5"
                onClick={() => openUpdate(featuredOrder)}
              >
                Update status
              </Button>
            </div>
          </div>

          <div className="mt-10">
            <div className="hidden items-center gap-0 lg:flex">
              {stepDefs.map((step, index) => {
                const isComplete = index <= featuredOrder.activeStep;
                const isCurrent = index === featuredOrder.activeStep;

                return (
                  <div key={step.label} className="flex flex-1 items-center last:flex-none">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                          isComplete
                            ? 'border-transparent bg-primary text-primary-foreground shadow-[0_0_32px_rgba(45,212,191,0.28)]'
                            : 'border-white/10 bg-background/60 text-muted-foreground'
                        }`}
                      >
                        <step.icon className="h-5 w-5" />
                      </div>
                      <p className={`mt-3 text-sm font-medium ${isCurrent ? 'text-primary' : isComplete ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {step.label}
                      </p>
                    </div>
                    {index < stepDefs.length - 1 && (
                      <div className="mx-3 h-1 flex-1 rounded-full bg-white/8">
                        <div
                          className="h-1 rounded-full bg-primary"
                          style={{ width: isComplete ? '100%' : '0%' }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="space-y-4 lg:hidden">
              {stepDefs.map((step, index) => {
                const isComplete = index <= featuredOrder.activeStep;
                const isCurrent = index === featuredOrder.activeStep;

                return (
                  <div key={step.label} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                          isComplete
                            ? 'border-transparent bg-primary text-primary-foreground'
                            : 'border-white/10 bg-background/60 text-muted-foreground'
                        }`}
                      >
                        <step.icon className="h-4 w-4" />
                      </div>
                      {index < stepDefs.length - 1 && <div className="mt-2 h-full w-px bg-white/10" />}
                    </div>
                    <div className="pb-4">
                      <p className={`text-sm font-medium ${isCurrent ? 'text-primary' : isComplete ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {step.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="grid gap-6">
          {supportOrders.map((order) => (
            <div key={order.id} className="rounded-[30px] border border-white/8 bg-card/80 p-6 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-primary/10 text-primary">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="border-white/8 bg-white/[0.03] text-muted-foreground" variant="outline">
                        {order.routeType}
                      </Badge>
                      <Badge className="border-primary/20 bg-primary/10 text-primary" variant="outline">
                        {stepDefs[order.activeStep].label}
                      </Badge>
                    </div>
                    <h3 className="mt-3 text-2xl font-semibold text-foreground">{order.medicineName}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      ID: {order.id} · {order.pharmacyName}
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="h-11 rounded-2xl border-white/10 bg-white/[0.03] px-4"
                  onClick={() => openUpdate(order)}
                >
                  Update
                </Button>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/8 bg-background/45 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">ETA</p>
                  <p className="mt-2 text-xl font-semibold text-foreground">{order.etaLabel}</p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-background/45 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Destination</p>
                  <p className="mt-2 text-xl font-semibold text-foreground">{order.destination}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6">
          <div className="rounded-[30px] border border-white/8 bg-card/80 p-6 shadow-card">
            <div className="relative overflow-hidden rounded-[24px] border border-white/8 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.08),transparent_45%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))] p-6">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:38px_38px] opacity-30" />
              <div className="relative">
                <p className="text-xs uppercase tracking-[0.25em] text-primary">
                  Live: {featuredOrder?.id ?? 'No active route'}
                </p>
                <h3 className="mt-4 text-4xl font-bold text-foreground">2.4 miles to destination</h3>
                <p className="mt-2 text-lg text-muted-foreground">Crossing Wacker Drive, Chicago</p>
                <div className="mt-8 flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-primary shadow-[0_0_20px_rgba(45,212,191,0.65)]" />
                  <div className="h-px flex-1 bg-gradient-to-r from-primary to-transparent" />
                  <div className="h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.65)]" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[30px] border border-white/8 bg-card/80 p-6 shadow-card">
              <div className="flex items-center gap-3">
                <Clock3 className="h-5 w-5 text-primary" />
                <p className="text-sm font-semibold text-foreground">Scheduled shipments</p>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-lg font-semibold text-foreground">Oxytocin Ampoules (50x)</p>
                  <p className="mt-1 text-sm text-muted-foreground">Scheduled: Jul 24, 08:00</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">Emergency Surgical Kit</p>
                  <p className="mt-1 text-sm text-muted-foreground">Scheduled: Jul 24, 10:30</p>
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/8 bg-card/80 p-6 shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Logistics fleet performance
                </p>
                <span className="text-sm font-semibold text-primary">+12% delivery efficiency</span>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {fleetMetrics.map((metric) => (
                  <div key={metric.label} className="rounded-2xl border border-white/8 bg-background/45 p-4 text-center">
                    <p className="text-3xl font-bold text-foreground">{metric.value}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/8 bg-card/80 p-6 shadow-card">
            <div className="flex items-center gap-3">
              <ThermometerSnowflake className="h-5 w-5 text-cyan-400" />
              <div>
                <p className="text-sm font-semibold text-foreground">Cold-chain check</p>
                <p className="text-xs text-muted-foreground">Insulin Rapid Humalog Bundle remains stable at 4.1°C.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Tracking — {selectedOrder}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Current Stage</Label>
              <select
                value={editData.step}
                onChange={(event) => setEditData({ ...editData, step: parseInt(event.target.value, 10) })}
                className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {stepDefs.map((step, index) => (
                  <option key={step.label} value={index}>
                    {step.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Expected Delivery Date</Label>
              <Input
                type="date"
                value={editData.date}
                onChange={(event) => setEditData({ ...editData, date: event.target.value })}
              />
            </div>

            <Button onClick={saveUpdate} className="w-full">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
