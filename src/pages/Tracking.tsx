import { useState, useEffect } from 'react';
import { Package, FlaskConical, Truck, MapPin, CheckCircle2, Clock } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const steps = [
  {
    label: 'Order Placed',
    description: 'Order #ORD-4521 confirmed by MedDist Hub',
    date: 'Feb 5, 2026 — 9:00 AM',
    icon: Package,
  },
  {
    label: 'Prepared',
    description: 'Medicines packed and quality checked',
    date: 'Feb 6, 2026 — 2:30 PM',
    icon: FlaskConical,
  },
  {
    label: 'In Transit',
    description: 'Shipment en route via secure medical courier',
    date: 'Feb 7, 2026 — 8:15 AM',
    icon: Truck,
  },
  {
    label: 'Out for Delivery',
    description: 'Package out for delivery to City Pharmacy',
    date: 'Feb 9, 2026 — 10:00 AM',
    icon: MapPin,
  },
  {
    label: 'Delivered',
    description: 'Successfully delivered and verified',
    date: 'Pending',
    icon: CheckCircle2,
  },
];

const activeStep = 3; // 0-indexed, "Out for Delivery" is current

export default function Tracking() {
  const { ref, isVisible } = useScrollAnimation();
  const [animatedStep, setAnimatedStep] = useState(-1);

  useEffect(() => {
    if (!isVisible) return;
    const timers: NodeJS.Timeout[] = [];
    steps.forEach((_, i) => {
      timers.push(setTimeout(() => setAnimatedStep(i), 400 * (i + 1)));
    });
    return () => timers.forEach(clearTimeout);
  }, [isVisible]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
          Shipment Tracking
        </h1>
        <p className="text-sm text-muted-foreground">Track your medicine shipments in real-time</p>
      </div>

      {/* Order Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card animate-slide-up">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Order Number</p>
            <p className="text-lg font-bold text-card-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
              #ORD-4521
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Out for Delivery</span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div
        ref={ref}
        className={`rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
      >
        <div className="space-y-0">
          {steps.map((step, i) => {
            const isCompleted = i <= activeStep;
            const isCurrent = i === activeStep;
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
                  {i < steps.length - 1 && (
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
