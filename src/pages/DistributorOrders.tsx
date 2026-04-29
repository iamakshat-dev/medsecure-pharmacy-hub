import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Package,
  Search,
  ShieldCheck,
  Truck,
  XCircle,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

type OrderStatus = 'Pending' | 'Accepted' | 'Dispatched' | 'Rejected' | 'Delivered';

interface Order {
  id: string;
  medicineName: string;
  batchId: string;
  pharmacyName: string;
  quantity: number;
  status: OrderStatus;
}

const initialOrders: Order[] = [
  { id: 'ORD-4590', medicineName: 'Paracetamol 500mg', batchId: 'BAT-2026-001', pharmacyName: 'City Pharmacy', quantity: 500, status: 'Pending' },
  { id: 'ORD-4585', medicineName: 'Amoxicillin 250mg', batchId: 'BAT-2026-002', pharmacyName: 'HealthPlus Store', quantity: 200, status: 'Accepted' },
  { id: 'ORD-4580', medicineName: 'Ibuprofen 400mg', batchId: 'BAT-2026-003', pharmacyName: 'MedCare Clinic', quantity: 1000, status: 'Dispatched' },
  { id: 'ORD-4575', medicineName: 'Cetirizine 10mg', batchId: 'BAT-2026-004', pharmacyName: 'Apollo Pharmacy', quantity: 300, status: 'Delivered' },
  { id: 'ORD-4571', medicineName: 'Metformin 500mg', batchId: 'BAT-2026-005', pharmacyName: 'Wellness Mart', quantity: 150, status: 'Pending' },
  { id: 'ORD-4568', medicineName: 'Omeprazole 20mg', batchId: 'BAT-2026-006', pharmacyName: 'QuickMed Pharma', quantity: 400, status: 'Rejected' },
];

const statusStyles: Record<OrderStatus, string> = {
  Pending: 'border-amber-400/20 bg-amber-400/10 text-amber-400',
  Accepted: 'border-primary/20 bg-primary/10 text-primary',
  Dispatched: 'border-cyan-400/20 bg-cyan-400/10 text-cyan-400',
  Delivered: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-400',
  Rejected: 'border-rose-400/20 bg-rose-400/10 text-rose-400',
};

const metricCards = [
  { label: 'Orders awaiting review', value: '18', note: '6 urgent under SLA', tone: 'text-amber-400' },
  { label: 'Ready to dispatch', value: '09', note: 'Batch and invoice checks passed', tone: 'text-primary' },
  { label: 'Rejected today', value: '02', note: 'Missing documentation', tone: 'text-rose-400' },
];

export default function DistributorOrders() {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState('');
  const [confirmAction, setConfirmAction] = useState<{ orderId: string; action: 'accept' | 'reject' | 'dispatch' } | null>(null);

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        const query = search.toLowerCase();
        return (
          order.id.toLowerCase().includes(query) ||
          order.medicineName.toLowerCase().includes(query) ||
          order.batchId.toLowerCase().includes(query) ||
          order.pharmacyName.toLowerCase().includes(query)
        );
      }),
    [orders, search],
  );

  const priorityOrders = filteredOrders.filter((order) => order.status === 'Pending').slice(0, 2);

  const handleAction = () => {
    if (!confirmAction) return;

    setOrders((currentOrders) =>
      currentOrders.map((order) => {
        if (order.id !== confirmAction.orderId) return order;

        if (confirmAction.action === 'accept') return { ...order, status: 'Accepted' };
        if (confirmAction.action === 'reject') return { ...order, status: 'Rejected' };
        return { ...order, status: 'Dispatched' };
      }),
    );

    setConfirmAction(null);
  };

  const actionLabel =
    confirmAction?.action === 'accept'
      ? 'Accept'
      : confirmAction?.action === 'reject'
        ? 'Reject'
        : 'Dispatch';

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
        <div className="rounded-[30px] border border-white/8 bg-card/80 p-8 shadow-card">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-primary/20 bg-primary/10 px-3 py-1 text-primary" variant="outline">
              Order Processing
            </Badge>
            <Badge className="border-amber-400/20 bg-amber-400/10 px-3 py-1 text-amber-400" variant="outline">
              6 urgent approvals pending
            </Badge>
          </div>

          <div className="mt-5 max-w-2xl">
            <h1 className="text-4xl font-bold leading-tight text-foreground">
              Process pharmacy demand faster without losing batch, compliance, or dispatch control.
            </h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              The distributor queue now emphasizes rapid release decisions, batch visibility,
              pharmacy destination context, and next-step actions for warehouse teams.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {metricCards.map((item) => (
              <div key={item.label} className="rounded-3xl border border-white/8 bg-background/50 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-2xl font-bold text-foreground">{item.value}</p>
                <p className={`mt-1 text-sm ${item.tone}`}>{item.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[30px] border border-white/8 bg-card/80 p-6 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Queue guidance</p>
              <p className="text-xs text-muted-foreground">Best next moves for your team</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="rounded-2xl border border-white/8 bg-background/45 p-4">
              <p className="text-sm font-semibold text-foreground">1. Clear urgent pending orders</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Review City Pharmacy and Wellness Mart first to stay inside the release SLA.
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-background/45 p-4">
              <p className="text-sm font-semibold text-foreground">2. Dispatch accepted cold-chain lots</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Prioritize accepted temperature-sensitive batches before the next route cutoff.
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-background/45 p-4">
              <p className="text-sm font-semibold text-foreground">3. Escalate rejected paperwork</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Missing invoice or batch inconsistencies should be returned to procurement immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[32px] border border-white/8 bg-card/80 p-6 shadow-card">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Priority release queue</p>
              <h2 className="mt-2 text-3xl font-bold text-foreground">Orders needing action now</h2>
            </div>
            <AlertTriangle className="h-5 w-5 text-amber-400" />
          </div>

          <div className="mt-6 space-y-4">
            {priorityOrders.map((order) => (
              <div key={order.id} className="rounded-[26px] border border-white/8 bg-background/45 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge className="border-amber-400/20 bg-amber-400/10 text-amber-400" variant="outline">
                        Pending
                      </Badge>
                      <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                        {order.id}
                      </span>
                    </div>
                    <h3 className="mt-3 text-xl font-semibold text-foreground">{order.medicineName}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {order.pharmacyName} · Batch {order.batchId}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-black/10 px-4 py-3 text-right">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Quantity</p>
                    <p className="mt-2 text-lg font-semibold text-foreground">{order.quantity.toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Button
                    className="h-11 rounded-2xl px-4"
                    onClick={() => setConfirmAction({ orderId: order.id, action: 'accept' })}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Accept order
                  </Button>
                  <Button
                    variant="outline"
                    className="h-11 rounded-2xl border-white/10 bg-white/[0.03] px-4"
                    onClick={() => setConfirmAction({ orderId: order.id, action: 'reject' })}
                  >
                    <XCircle className="h-4 w-4" />
                    Reject order
                  </Button>
                </div>
              </div>
            ))}

            {priorityOrders.length === 0 && (
              <div className="rounded-[26px] border border-white/8 bg-background/45 p-6 text-sm text-muted-foreground">
                No pending orders match the current filters.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[32px] border border-white/8 bg-card/80 p-6 shadow-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Full order queue</p>
              <h2 className="mt-2 text-3xl font-bold text-foreground">Warehouse processing table</h2>
            </div>

            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search orders, medicines, or pharmacies..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-11 rounded-2xl border-white/10 bg-white/[0.03] pl-10"
              />
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-[24px] border border-white/8">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="border-b border-white/8 bg-white/[0.03]">
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Order</th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Medicine</th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Destination</th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Quantity</th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Status</th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-white/8 bg-card/40 transition-colors hover:bg-white/[0.03]">
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-foreground">{order.id}</p>
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{order.batchId}</p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <Package className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-medium text-foreground">{order.medicineName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{order.pharmacyName}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-foreground">{order.quantity.toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <Badge className={statusStyles[order.status]} variant="outline">
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          {order.status === 'Pending' && (
                            <>
                              <Button
                                size="sm"
                                className="h-9 rounded-xl px-3"
                                onClick={() => setConfirmAction({ orderId: order.id, action: 'accept' })}
                              >
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-9 rounded-xl border-white/10 bg-white/[0.03] px-3"
                                onClick={() => setConfirmAction({ orderId: order.id, action: 'reject' })}
                              >
                                Reject
                              </Button>
                            </>
                          )}

                          {order.status === 'Accepted' && (
                            <Button
                              size="sm"
                              className="h-9 rounded-xl px-3"
                              onClick={() => setConfirmAction({ orderId: order.id, action: 'dispatch' })}
                            >
                              <Truck className="h-4 w-4" />
                              Dispatch
                            </Button>
                          )}

                          {order.status === 'Dispatched' && (
                            <div className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs font-medium text-cyan-400">
                              <Truck className="h-3.5 w-3.5" />
                              In route
                            </div>
                          )}

                          {order.status === 'Delivered' && (
                            <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-medium text-emerald-400">
                              <ShieldCheck className="h-3.5 w-3.5" />
                              Closed
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm {actionLabel}</DialogTitle>
            <DialogDescription>
              Are you sure you want to {actionLabel?.toLowerCase()} order {confirmAction?.orderId}?
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setConfirmAction(null)}>
              Cancel
            </Button>
            <Button
              className={`flex-1 ${
                confirmAction?.action === 'reject'
                  ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                  : ''
              }`}
              onClick={handleAction}
            >
              {actionLabel}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
