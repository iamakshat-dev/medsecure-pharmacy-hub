import { ShoppingCart, Clock, Truck, CheckCircle2, Activity, ArrowUpRight, Package } from 'lucide-react';
import KPICard from '@/components/KPICard';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ordersData = [
  { month: 'Jul', orders: 48 },
  { month: 'Aug', orders: 62 },
  { month: 'Sep', orders: 55 },
  { month: 'Oct', orders: 78 },
  { month: 'Nov', orders: 71 },
  { month: 'Dec', orders: 94 },
  { month: 'Jan', orders: 83 },
];

const recentActivity = [
  { id: 1, action: 'Order accepted', detail: 'Order #ORD-4590 — City Pharmacy', time: '10 min ago', icon: CheckCircle2 },
  { id: 2, action: 'Order dispatched', detail: 'Order #ORD-4585 — HealthPlus Store', time: '45 min ago', icon: Truck },
  { id: 3, action: 'New order received', detail: 'Order #ORD-4592 — MedCare Clinic', time: '1 hr ago', icon: ShoppingCart },
  { id: 4, action: 'Delivery completed', detail: 'Order #ORD-4571 — Apollo Pharmacy', time: '3 hrs ago', icon: ArrowUpRight },
];

export default function DistributorDashboard() {
  const { ref: chartRef, isVisible: chartVisible } = useScrollAnimation();
  const { ref: actRef, isVisible: actVisible } = useScrollAnimation();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
          Distributor Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">Overview of your distribution operations</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Orders" value={342} icon={ShoppingCart} trend="↑ 15% vs last month" trendUp color="blue" delay={0.1} />
        <KPICard title="Pending Orders" value={18} icon={Clock} trend="↓ 3 from yesterday" trendUp={false} color="red" delay={0.2} />
        <KPICard title="In-Transit" value={27} icon={Truck} trend="↑ 8 dispatched today" trendUp color="blue" delay={0.3} />
        <KPICard title="Delivered" value={297} icon={CheckCircle2} trend="↑ 12% this month" trendUp color="green" delay={0.4} />
      </div>

      <div
        ref={chartRef}
        className={`rounded-2xl border border-border bg-card p-6 shadow-card ${chartVisible ? 'animate-slide-up' : 'opacity-0'}`}
      >
        <h2 className="mb-4 text-lg font-semibold text-card-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
          Orders Handled Per Month
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ordersData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="fill-muted-foreground" fontSize={12} />
              <YAxis className="fill-muted-foreground" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  color: 'hsl(var(--card-foreground))',
                  boxShadow: 'var(--shadow-card)',
                }}
              />
              <Bar dataKey="orders" fill="hsl(155 65% 38%)" radius={[8, 8, 0, 0]} animationDuration={1500} animationBegin={chartVisible ? 0 : 99999} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div
        ref={actRef}
        className={`rounded-2xl border border-border bg-card p-6 shadow-card ${actVisible ? 'animate-slide-up' : 'opacity-0'}`}
      >
        <h2 className="mb-4 text-lg font-semibold text-card-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
          Recent Activity
        </h2>
        <div className="space-y-4">
          {recentActivity.map((item, i) => (
            <div
              key={item.id}
              className={`flex items-start gap-4 rounded-xl border border-border p-4 transition-all hover:bg-accent/50 ${
                actVisible ? 'animate-slide-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${0.1 * (i + 1)}s` }}
            >
              <div className="rounded-lg bg-primary/10 p-2">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-card-foreground">{item.action}</p>
                <p className="text-xs text-muted-foreground">{item.detail}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {item.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
