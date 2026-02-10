import { useState, useEffect } from 'react';
import { Package, FlaskConical, Truck, MapPin, CheckCircle2, Clock, ChevronDown } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const stepDefs = [
  { label: 'Order Placed', icon: Package },
  { label: 'Prepared', icon: FlaskConical },
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
}

const initialOrders: TrackedOrder[] = [
  { id: 'ORD-4590', pharmacyName: 'City Pharmacy', medicineName: 'Paracetamol 500mg', activeStep: 1, expectedDate: '2026-02-15' },
  { id: 'ORD-4585', pharmacyName: 'HealthPlus Store', medicineName: 'Amoxicillin 250mg', activeStep: 2, expectedDate: '2026-02-13' },
  { id: 'ORD-4580', pharmacyName: 'MedCare Clinic', medicineName: 'Ibuprofen 400mg', activeStep: 3, expectedDate: '2026-02-11' },
  { id: 'ORD-4575', pharmacyName: 'Apollo Pharmacy', medicineName: 'Cetirizine 10mg', activeStep: 4, expectedDate: '2026-02-10' },
];

export default function DistributorTracking() {
  const { ref, isVisible } = useScrollAnimation();
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ step: number; date: string }>({ step: 0, date: '' });

  const openUpdate = (order: TrackedOrder) => {
    setSelectedOrder(order.id);
    setEditData({ step: order.activeStep, date: order.expectedDate });
  };

  const saveUpdate = () => {
    if (!selectedOrder) return;
    setOrders(orders.map((o) =>
      o.id === selectedOrder ? { ...o, activeStep: editData.step, expectedDate: editData.date } : o
    ));
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
          Delivery Tracking
        </h1>
        <p className="text-sm text-muted-foreground">Update and monitor delivery progress for all orders</p>
      </div>

      <div ref={ref} className="space-y-6">
        {orders.map((order, oi) => (
          <OrderTimeline
            key={order.id}
            order={order}
            isVisible={isVisible}
            delay={oi * 0.15}
            onUpdate={() => openUpdate(order)}
          />
        ))}
      </div>

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
                onChange={(e) => setEditData({ ...editData, step: parseInt(e.target.value) })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {stepDefs.map((s, i) => (
                  <option key={i} value={i}>{s.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Expected Delivery Date</Label>
              <Input type="date" value={editData.date} onChange={(e) => setEditData({ ...editData, date: e.target.value })} />
            </div>
            <Button onClick={saveUpdate} className="w-full gradient-primary text-primary-foreground border-0">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function OrderTimeline({ order, isVisible, delay, onUpdate }: { order: TrackedOrder; isVisible: boolean; delay: number; onUpdate: () => void }) {
  const [animatedStep, setAnimatedStep] = useState(-1);

  useEffect(() => {
    if (!isVisible) return;
    const timers: NodeJS.Timeout[] = [];
    stepDefs.forEach((_, i) => {
      timers.push(setTimeout(() => setAnimatedStep(i), 300 * (i + 1) + delay * 1000));
    });
    return () => timers.forEach(clearTimeout);
  }, [isVisible, delay]);

  return (
    <div
      className={`rounded-2xl border border-border bg-card p-6 shadow-card transition-all ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-bold text-card-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
            #{order.id}
          </p>
          <p className="text-sm text-muted-foreground">{order.medicineName} → {order.pharmacyName}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">ETA: {order.expectedDate}</span>
          </div>
          <Button variant="outline" size="sm" onClick={onUpdate} className="hover-scale">
            Update
          </Button>
        </div>
      </div>

      {/* Horizontal stepper for desktop, vertical for mobile */}
      <div className="hidden sm:flex items-center gap-0">
        {stepDefs.map((step, i) => {
          const isCompleted = i <= order.activeStep;
          const isCurrent = i === order.activeStep;
          const isAnimated = i <= animatedStep;

          return (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                    isAnimated
                      ? isCompleted
                        ? 'gradient-primary border-transparent shadow-glow'
                        : 'border-border bg-card'
                      : 'border-border bg-card'
                  } ${isCurrent && isAnimated ? 'animate-pulse-soft' : ''}`}
                >
                  <step.icon className={`h-5 w-5 transition-colors duration-500 ${isAnimated && isCompleted ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                </div>
                <p className={`mt-2 text-xs font-medium text-center ${isCompleted ? 'text-card-foreground' : 'text-muted-foreground'}`}>
                  {step.label}
                </p>
              </div>
              {i < stepDefs.length - 1 && (
                <div className="relative h-0.5 flex-1 mx-2 bg-border rounded-full overflow-hidden">
                  {isCompleted && (
                    <div
                      className="absolute inset-0 gradient-primary transition-all duration-700"
                      style={{ width: isAnimated ? '100%' : '0%', transitionDelay: `${0.2 * i}s` }}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Vertical for mobile */}
      <div className="sm:hidden space-y-0">
        {stepDefs.map((step, i) => {
          const isCompleted = i <= order.activeStep;
          const isCurrent = i === order.activeStep;
          const isAnimated = i <= animatedStep;

          return (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                    isAnimated && isCompleted ? 'gradient-primary border-transparent' : 'border-border bg-card'
                  } ${isCurrent && isAnimated ? 'animate-pulse-soft' : ''}`}
                >
                  <step.icon className={`h-4 w-4 ${isAnimated && isCompleted ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                </div>
                {i < stepDefs.length - 1 && (
                  <div className="relative w-0.5 flex-1 min-h-[1.5rem] bg-border">
                    {isCompleted && (
                      <div className="absolute inset-0 w-full gradient-primary transition-all duration-700" style={{ height: isAnimated ? '100%' : '0%' }} />
                    )}
                  </div>
                )}
              </div>
              <div className={`pb-4 transition-all duration-500 ${isAnimated ? 'opacity-100' : 'opacity-0'}`}>
                <p className={`text-sm font-medium ${isCompleted ? 'text-card-foreground' : 'text-muted-foreground'}`}>
                  {step.label}
                  {isCurrent && <span className="ml-2 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">Current</span>}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
