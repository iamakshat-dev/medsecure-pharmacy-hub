import { useState } from 'react';
import { Search, Package, CheckCircle2, XCircle, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

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
  Pending: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
  Accepted: 'bg-primary/10 text-primary border-primary/20',
  Dispatched: 'bg-chart-2/10 text-chart-2 border-chart-2/20',
  Delivered: 'bg-secondary/10 text-secondary border-secondary/20',
  Rejected: 'bg-destructive/10 text-destructive border-destructive/20',
};

export default function DistributorOrders() {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState('');
  const [confirmAction, setConfirmAction] = useState<{ orderId: string; action: 'accept' | 'reject' | 'dispatch' } | null>(null);
  const { ref, isVisible } = useScrollAnimation();

  const filtered = orders.filter((o) =>
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.medicineName.toLowerCase().includes(search.toLowerCase()) ||
    o.pharmacyName.toLowerCase().includes(search.toLowerCase())
  );

  const handleAction = () => {
    if (!confirmAction) return;
    setOrders(orders.map((o) => {
      if (o.id !== confirmAction.orderId) return o;
      if (confirmAction.action === 'accept') return { ...o, status: 'Accepted' as OrderStatus };
      if (confirmAction.action === 'reject') return { ...o, status: 'Rejected' as OrderStatus };
      if (confirmAction.action === 'dispatch') return { ...o, status: 'Dispatched' as OrderStatus };
      return o;
    }));
    setConfirmAction(null);
  };

  const actionLabel = confirmAction?.action === 'accept' ? 'Accept' : confirmAction?.action === 'reject' ? 'Reject' : 'Dispatch';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>Orders</h1>
        <p className="text-sm text-muted-foreground">Manage and process pharmacy orders</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search orders, medicines, pharmacies..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div
        ref={ref}
        className={`overflow-hidden rounded-2xl border border-border bg-card shadow-card ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-muted-foreground">Order ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-muted-foreground">Medicine</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-muted-foreground">Batch</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-muted-foreground">Pharmacy</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-muted-foreground">Qty</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order, i) => (
                <tr
                  key={order.id}
                  className={`group border-b border-border transition-colors hover:bg-accent/30 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
                  style={{ animationDelay: `${0.05 * (i + 1)}s` }}
                >
                  <td className="px-6 py-4 text-sm font-medium text-card-foreground">{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-card-foreground">{order.medicineName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{order.batchId}</td>
                  <td className="px-6 py-4 text-sm text-card-foreground">{order.pharmacyName}</td>
                  <td className="px-6 py-4 text-sm font-medium text-card-foreground">{order.quantity.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={statusStyles[order.status]}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      {order.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => setConfirmAction({ orderId: order.id, action: 'accept' })}
                            className="rounded-lg p-2 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                            title="Accept"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setConfirmAction({ orderId: order.id, action: 'reject' })}
                            className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                            title="Reject"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {order.status === 'Accepted' && (
                        <button
                          onClick={() => setConfirmAction({ orderId: order.id, action: 'dispatch' })}
                          className="rounded-lg p-2 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                          title="Mark as Dispatched"
                        >
                          <Truck className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
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
              className={`flex-1 ${confirmAction?.action === 'reject' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : 'gradient-primary text-primary-foreground border-0'}`}
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
