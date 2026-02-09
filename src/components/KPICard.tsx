import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useCountUp } from '@/hooks/useCountUp';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color: 'blue' | 'green' | 'orange' | 'red';
  delay?: number;
}

const colorMap = {
  blue: 'bg-primary/10 text-primary',
  green: 'bg-secondary/10 text-secondary',
  orange: 'bg-accent text-accent-foreground',
  red: 'bg-destructive/10 text-destructive',
};

export default function KPICard({ title, value, suffix = '', icon: Icon, trend, trendUp, color, delay = 0 }: KPICardProps) {
  const { ref, isVisible } = useScrollAnimation();
  const count = useCountUp(value, 1500, 0, isVisible);

  return (
    <div
      ref={ref}
      className={`rounded-2xl border border-border bg-card p-6 shadow-card hover-lift ${
        isVisible ? 'animate-slide-up' : 'opacity-0'
      }`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold text-card-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
            {count.toLocaleString()}{suffix}
          </p>
          {trend && (
            <p className={`mt-1 text-xs font-medium ${trendUp ? 'text-secondary' : 'text-destructive'}`}>
              {trend}
            </p>
          )}
        </div>
        <div className={`rounded-xl p-3 ${colorMap[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
