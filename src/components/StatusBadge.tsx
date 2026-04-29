import { AlertTriangle, CheckCircle2, Clock3, ShieldAlert } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

type StatusBadgeProps = {
  status: string;
};

const toneMap: Record<
  string,
  {
    className: string;
    icon: typeof CheckCircle2;
  }
> = {
  Verified: {
    className: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-400',
    icon: CheckCircle2,
  },
  Tampered: {
    className: 'border-rose-400/20 bg-rose-400/10 text-rose-400',
    icon: ShieldAlert,
  },
  Unverified: {
    className: 'border-amber-400/20 bg-amber-400/10 text-amber-400',
    icon: Clock3,
  },
  'In Stock': {
    className: 'border-primary/20 bg-primary/10 text-primary',
    icon: CheckCircle2,
  },
  'Low Stock': {
    className: 'border-amber-400/20 bg-amber-400/10 text-amber-400',
    icon: AlertTriangle,
  },
  'Out of Stock': {
    className: 'border-rose-400/20 bg-rose-400/10 text-rose-400',
    icon: AlertTriangle,
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const tone = toneMap[status] ?? toneMap.Unverified;
  const Icon = tone.icon;

  return (
    <Badge variant="outline" className={`inline-flex items-center gap-1.5 ${tone.className}`}>
      <Icon className="h-3.5 w-3.5" />
      {status}
    </Badge>
  );
}
