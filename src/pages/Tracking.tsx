import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, Clock, FlaskConical, MapPin, Package, Search, Truck } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type TrackingStep = {
  label: string;
  description: string;
  date: string;
  icon: typeof Package;
};

type OrderTracking = {
  id: string;
  status: string;
  activeStep: number;
  eta: string;
  destination: string;
  courier: string;
  steps: TrackingStep[];
};

const trackedOrders: OrderTracking[] = [
  {
    id: 'ORD-4521',
    status: 'Out for Delivery',
    activeStep: 3,
    eta: 'Today, 10:00 AM - 1:00 PM',
    destination: 'City Pharmacy',
    courier: 'MedRoute Secure Logistics',
    steps: [
      {
        label: 'Order Placed',
        description: 'Order #ORD-4521 confirmed by MedDist Hub',
        date: 'Feb 5, 2026 — 9:00 AM',
        icon: Package,
      },
      {
        label: 'Prepared',
        description: 'Medicines packed, sealed, and quality checked',
        date: 'Feb 6, 2026 — 2:30 PM',
        icon: FlaskConical,
      },
      {
        label: 'In Transit',
        description: 'Shipment left the regional medical distribution center',
        date: 'Feb 7, 2026 — 8:15 AM',
        icon: Truck,
      },
      {
        label: 'Out for Delivery',
        description: 'Package is out for delivery to City Pharmacy',
        date: 'Feb 9, 2026 — 10:00 AM',
        icon: MapPin,
      },
      {
        label: 'Delivered',
        description: 'Awaiting pharmacist handoff confirmation',
        date: 'Pending',
        icon: CheckCircle2,
      },
    ],
  },
  {
    id: 'ORD-4585',
    status: 'In Transit',
    activeStep: 2,
    eta: 'Tomorrow, 9:00 AM - 12:00 PM',
    destination: 'HealthPlus Store',
    courier: 'BlueLine Pharma Transit',
    steps: [
      {
        label: 'Order Placed',
        description: 'Order #ORD-4585 approved and queued for dispatch',
        date: 'Feb 10, 2026 — 11:10 AM',
        icon: Package,
      },
      {
        label: 'Prepared',
        description: 'Temperature-sensitive stock packed with monitoring tags',
        date: 'Feb 10, 2026 — 4:00 PM',
        icon: FlaskConical,
      },
      {
        label: 'In Transit',
        description: 'Courier departed from central warehouse',
        date: 'Feb 11, 2026 — 7:40 AM',
        icon: Truck,
      },
      {
        label: 'Out for Delivery',
        description: 'Last-mile dispatch will begin after arrival at local hub',
        date: 'Pending',
        icon: MapPin,
      },
      {
        label: 'Delivered',
        description: 'Delivery confirmation pending',
        date: 'Pending',
        icon: CheckCircle2,
      },
    ],
  },
  {
    id: 'ORD-4575',
    status: 'Delivered',
    activeStep: 4,
    eta: 'Completed on Feb 10, 2026',
    destination: 'Apollo Pharmacy',
    courier: 'CareTrack Express',
    steps: [
      {
        label: 'Order Placed',
        description: 'Order #ORD-4575 created by MedSecure portal',
        date: 'Feb 7, 2026 — 8:50 AM',
        icon: Package,
      },
      {
        label: 'Prepared',
        description: 'Items verified against prescription manifest',
        date: 'Feb 7, 2026 — 12:40 PM',
        icon: FlaskConical,
      },
      {
        label: 'In Transit',
        description: 'Shipment traveled with tamper-evident packaging',
        date: 'Feb 8, 2026 — 6:25 AM',
        icon: Truck,
      },
      {
        label: 'Out for Delivery',
        description: 'Driver arrived in final service area',
        date: 'Feb 10, 2026 — 9:15 AM',
        icon: MapPin,
      },
      {
        label: 'Delivered',
        description: 'Order received and verified by Apollo Pharmacy',
        date: 'Feb 10, 2026 — 11:05 AM',
        icon: CheckCircle2,
      },
    ],
  },
];

export default function Tracking() {
  const { ref, isVisible } = useScrollAnimation();
  const [animatedStep, setAnimatedStep] = useState(-1);
  const [query, setQuery] = useState('ORD-4521');
  const [selectedOrderId, setSelectedOrderId] = useState('ORD-4521');
  const [searchError, setSearchError] = useState('');

  const selectedOrder = trackedOrders.find((order) => order.id === selectedOrderId) ?? trackedOrders[0];

  useEffect(() => {
    if (!isVisible) return;
    setAnimatedStep(-1);
    const timers: NodeJS.Timeout[] = [];
    selectedOrder.steps.forEach((_, i) => {
      timers.push(setTimeout(() => setAnimatedStep(i), 400 * (i + 1)));
    });
    return () => timers.forEach(clearTimeout);
  }, [isVisible, selectedOrderId, selectedOrder.steps]);

  const handleTrackOrder = (event: React.FormEvent) => {
    event.preventDefault();
    const normalizedOrderId = query.trim().toUpperCase();
    const matchedOrder = trackedOrders.find((order) => order.id === normalizedOrderId);

    if (!matchedOrder) {
      setSearchError(`No tracking details found for ${normalizedOrderId || 'that order ID'}.`);
      return;
    }

    setSelectedOrderId(matchedOrder.id);
    setQuery(matchedOrder.id);
    setSearchError('');
  };

  const handleQuickSelect = (orderId: string) => {
    setSelectedOrderId(orderId);
    setQuery(orderId);
    setSearchError('');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
          Shipment Tracking
        </h1>
        <p className="text-sm text-muted-foreground">Track your medicine shipments in real-time by order ID</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-card animate-slide-up">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">Track by Order ID</p>
            <h2 className="mt-2 text-xl font-semibold text-card-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
              Search any shipment with its order reference
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Enter an order ID to load the latest delivery stage, ETA, courier assignment, and timeline updates.
            </p>
          </div>

          <form onSubmit={handleTrackOrder} className="w-full max-w-xl">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Enter order ID, for example ORD-4521"
                  className="h-11 rounded-xl pl-11"
                />
              </div>
              <Button type="submit" className="h-11 rounded-xl gradient-primary border-0 text-primary-foreground">
                Track Order
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {trackedOrders.map((order) => (
                <button
                  key={order.id}
                  type="button"
                  onClick={() => handleQuickSelect(order.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    selectedOrderId === order.id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground'
                  }`}
                >
                  {order.id}
                </button>
              ))}
            </div>
            {searchError ? (
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {searchError}
              </div>
            ) : null}
          </form>
        </div>
      </div>

      {/* Order Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card animate-slide-up">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="text-lg font-bold text-card-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                #{selectedOrder.id}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Destination: {selectedOrder.destination}</p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">{selectedOrder.status}</span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-background/80 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">ETA</p>
              <p className="mt-1 text-sm font-medium text-card-foreground">{selectedOrder.eta}</p>
            </div>
            <div className="rounded-2xl border border-border bg-background/80 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Courier</p>
              <p className="mt-1 text-sm font-medium text-card-foreground">{selectedOrder.courier}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div
        ref={ref}
        className={`rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
      >
        <div className="space-y-0">
          {selectedOrder.steps.map((step, i) => {
            const isCompleted = i <= selectedOrder.activeStep;
            const isCurrent = i === selectedOrder.activeStep;
            const isAnimated = i <= animatedStep;

            return (
              <div key={i} className="flex gap-4 sm:gap-6">
                {/* Timeline line + dot */}
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
                    <step.icon
                      className={`h-5 w-5 transition-colors duration-500 ${
                        isAnimated && isCompleted ? 'text-primary-foreground' : 'text-muted-foreground'
                      }`}
                    />
                  </div>
                  {i < selectedOrder.steps.length - 1 && (
                    <div className="relative w-0.5 flex-1 min-h-[3rem] bg-border">
                      {isCompleted && (
                        <div
                          className="absolute inset-0 w-full gradient-primary transition-all duration-700"
                          style={{
                            height: isAnimated ? '100%' : '0%',
                            transitionDelay: `${0.3 * i}s`,
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div
                  className={`pb-8 transition-all duration-500 ${
                    isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <p
                    className={`text-sm font-semibold ${
                      isCompleted ? 'text-card-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {step.label}
                    {isCurrent && (
                      <span className="ml-2 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        Current
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{step.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
