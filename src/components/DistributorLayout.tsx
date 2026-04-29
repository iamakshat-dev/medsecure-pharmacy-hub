import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  CircleHelp,
  Lock,
  LogOut,
  Menu,
  Moon,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sun,
  Truck,
  Warehouse,
  X,
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/hooks/useTheme';

const navItems = [
  {
    path: '/distributor',
    label: 'Dashboard',
    description: 'Operations command',
    icon: Warehouse,
    matcher: (pathname: string) => pathname === '/distributor',
  },
  {
    path: '/distributor/orders',
    label: 'Order Processing',
    description: 'Inbound pharmacy orders',
    icon: ShoppingCart,
    matcher: (pathname: string) => pathname.startsWith('/distributor/orders'),
  },
  {
    path: '/distributor/tracking',
    label: 'Logistics Tracking',
    description: 'Route and delivery flow',
    icon: Truck,
    matcher: (pathname: string) => pathname.startsWith('/distributor/tracking'),
  },
];

const getStoredUsername = () => {
  try {
    const rawUser = localStorage.getItem('user');
    if (!rawUser) return 'Logistics Lead';
    const parsedUser = JSON.parse(rawUser) as { username?: string };
    return parsedUser.username?.trim() || 'Logistics Lead';
  } catch {
    return 'Logistics Lead';
  }
};

export default function DistributorLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, mounted, isTransitioning, toggle: toggleTheme } = useTheme();

  const currentNavItem =
    navItems.find((item) => item.matcher(location.pathname)) ?? navItems[0];
  const username = useMemo(() => getStoredUsername(), []);
  const initials = username.slice(0, 2).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    sessionStorage.setItem('justLoggedOut', 'true');
    setShowLogout(false);
    navigate('/login', { replace: true });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8%] top-[-6%] h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute right-[-10%] top-1/3 h-80 w-80 rounded-full bg-emerald-400/8 blur-3xl" />
        <div className="absolute inset-y-0 left-[19.5%] hidden w-px bg-white/5 lg:block" />
      </div>

      <div className="relative flex min-h-screen">
        <aside className="hidden w-[320px] shrink-0 border-r border-white/5 bg-[#09141d]/92 lg:flex lg:flex-col">
          <div className="border-b border-white/5 px-6 py-7">
            <Link to="/distributor" className="flex items-start gap-4">
              <div className="gradient-primary flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-[0_0_40px_rgba(45,212,191,0.18)]">
                <Truck className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-foreground">Med</span>
                  <span className="text-2xl font-bold text-primary">Secure</span>
                  <Lock className="h-4 w-4 text-primary" />
                </div>
                <p className="mt-1 text-xs uppercase tracking-[0.32em] text-muted-foreground">
                  Distributor Control
                </p>
              </div>
            </Link>
          </div>

          <div className="flex flex-1 flex-col px-4 py-6">
            <div className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
              Logistics Workspace
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = item.matcher(location.pathname);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group relative flex items-center gap-4 overflow-hidden rounded-2xl px-4 py-4 transition-all duration-300 ${
                      isActive
                        ? 'bg-primary/12 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_18px_40px_-30px_rgba(45,212,191,0.65)]'
                        : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute inset-y-3 right-0 w-1 rounded-full bg-primary" />
                    )}
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${
                        isActive
                          ? 'border-primary/20 bg-primary/10'
                          : 'border-white/5 bg-white/[0.03] group-hover:border-primary/10'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto rounded-[28px] border border-white/5 bg-white/[0.03] p-5 shadow-card">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Fleet Network</p>
                  <p className="text-xs text-muted-foreground">Live corridor pulse</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-2xl bg-background/60 px-4 py-3">
                  <span className="text-muted-foreground">On-time dispatch</span>
                  <span className="font-semibold text-foreground">94%</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-background/60 px-4 py-3">
                  <span className="text-muted-foreground">Cold-chain routes</span>
                  <span className="font-semibold text-primary">8 monitored</span>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-primary/10 bg-primary/8 px-4 py-3 text-sm text-primary">
                3 urgent pharmacy orders are waiting for release approval.
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-white/5 bg-background/80 backdrop-blur-xl">
            <div className="flex items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex flex-1 items-center gap-3">
                <button
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-foreground transition-colors hover:border-primary/25 hover:text-primary lg:hidden"
                  onClick={() => setMobileMenuOpen(true)}
                  aria-label="Open navigation"
                >
                  <Menu className="h-5 w-5" />
                </button>

                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                    MedSecure Distributor Portal
                  </p>
                  <div className="flex items-center gap-2">
                    <h1 className="truncate text-lg font-semibold text-foreground">
                      {currentNavItem.label}
                    </h1>
                    <span className="hidden rounded-full border border-primary/15 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary sm:inline-flex">
                      {currentNavItem.description}
                    </span>
                  </div>
                </div>
              </div>

              <div className="hidden max-w-xl flex-1 xl:block">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    readOnly
                    value=""
                    placeholder="Search orders, clients, or tracking IDs..."
                    className="h-12 rounded-2xl border-white/10 bg-white/[0.03] pl-11 text-sm placeholder:text-muted-foreground/80"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-muted-foreground transition-colors hover:border-primary/20 hover:text-primary"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                </button>
                <button
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-muted-foreground transition-colors hover:border-primary/20 hover:text-primary"
                  aria-label="Help"
                >
                  <CircleHelp className="h-5 w-5" />
                </button>
                <button
                  onClick={toggleTheme}
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-muted-foreground transition-colors hover:border-primary/20 hover:text-primary ${
                    isTransitioning ? 'theme-toggle-animate' : ''
                  }`}
                  aria-label="Toggle theme"
                >
                  {mounted && isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLogout(true)}
                  className="hidden h-11 rounded-2xl border border-transparent px-4 text-muted-foreground hover:border-destructive/20 hover:bg-destructive/10 hover:text-destructive sm:inline-flex"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>

                <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 sm:flex">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/12 text-sm font-semibold text-primary">
                    {initials}
                  </div>
                  <div className="leading-tight">
                    <p className="text-sm font-semibold text-foreground">{username}</p>
                    <p className="text-xs text-muted-foreground">Logistics Lead</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm lg:hidden">
          <div className="h-full max-w-[86vw] border-r border-white/10 bg-[#09141d] px-5 py-5 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <Link
                to="/distributor"
                className="flex items-center gap-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="gradient-primary flex h-11 w-11 items-center justify-center rounded-2xl">
                  <Truck className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">MedSecure</p>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                    Distributor Portal
                  </p>
                </div>
              </Link>

              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-foreground"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2">
              {navItems.map((item) => {
                const isActive = item.matcher(location.pathname);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-4 ${
                      isActive
                        ? 'bg-primary/12 text-primary'
                        : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <div>
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-foreground">{username}</p>
              <p className="text-xs text-muted-foreground">Logistics Lead</p>
            </div>

            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                className="flex-1 rounded-2xl border-white/10 bg-white/[0.03]"
                onClick={toggleTheme}
              >
                {mounted && isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                Theme
              </Button>
              <Button
                variant="destructive"
                className="flex-1 rounded-2xl"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowLogout(true);
                }}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={showLogout} onOpenChange={setShowLogout}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              End this distributor session and return to the login page?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowLogout(false)}>
              Cancel
            </Button>
            <Button variant="destructive" className="flex-1" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
