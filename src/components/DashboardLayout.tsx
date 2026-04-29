import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  Home,
  Lock,
  LogOut,
  Menu,
  Moon,
  Package,
  Pill,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  Truck,
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
    path: '/dashboard',
    label: 'Overview',
    description: 'Command center',
    icon: Home,
    matcher: (pathname: string) => pathname === '/dashboard',
  },
  {
    path: '/dashboard/inventory',
    label: 'Inventory',
    description: 'Live medicine stock',
    icon: Package,
    matcher: (pathname: string) => pathname.startsWith('/dashboard/inventory'),
  },
  {
    path: '/dashboard/tracking',
    label: 'Tracking',
    description: 'Orders and route flow',
    icon: Truck,
    matcher: (pathname: string) => pathname.startsWith('/dashboard/tracking'),
  },
  {
    path: '/dashboard/authentication',
    label: 'Verification',
    description: 'Batch authenticity',
    icon: ShieldCheck,
    matcher: (pathname: string) => pathname.startsWith('/dashboard/authentication'),
  },
];

const getStoredUsername = () => {
  try {
    const rawUser = localStorage.getItem('user');
    if (!rawUser) return 'Pharmacy Lead';
    const parsedUser = JSON.parse(rawUser) as { username?: string };
    return parsedUser.username?.trim() || 'Pharmacy Lead';
  } catch {
    return 'Pharmacy Lead';
  }
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
        <div className="absolute left-[-10%] top-[-8%] h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-[-12%] right-[-8%] h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute inset-y-0 left-[18%] hidden w-px bg-white/5 lg:block" />
      </div>

      <div className="relative flex min-h-screen">
        <aside className="hidden w-[290px] shrink-0 border-r border-white/5 bg-[#0a1521]/90 lg:flex lg:flex-col">
          <div className="border-b border-white/5 px-6 py-7">
            <Link to="/dashboard" className="flex items-start gap-4">
              <div className="gradient-primary flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-[0_0_40px_rgba(45,212,191,0.18)]">
                <Pill className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-foreground">Med</span>
                  <span className="text-2xl font-bold text-primary">Secure</span>
                  <Lock className="h-4 w-4 text-primary" />
                </div>
                <p className="mt-1 text-xs uppercase tracking-[0.32em] text-muted-foreground">
                  Pharmacy Operations Hub
                </p>
              </div>
            </Link>
          </div>

          <div className="flex flex-1 flex-col px-4 py-6">
            <div className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
              Workspace
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
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Trust Monitor</p>
                  <p className="text-xs text-muted-foreground">Live system pulse</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-2xl bg-background/60 px-4 py-3">
                  <span className="text-muted-foreground">Verified today</span>
                  <span className="font-semibold text-foreground">184 batches</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-background/60 px-4 py-3">
                  <span className="text-muted-foreground">Cold-chain uptime</span>
                  <span className="font-semibold text-primary">99.2%</span>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-2 rounded-2xl border border-primary/10 bg-primary/8 px-4 py-3 text-sm text-primary">
                <Sparkles className="h-4 w-4" />
                Distributor sync completed 12 minutes ago.
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
                    MedSecure Pharmacist Shell
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
                    placeholder="Search batches, distributors, purchase orders..."
                    className="h-12 rounded-2xl border-white/10 bg-white/[0.03] pl-11 text-sm placeholder:text-muted-foreground/80"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTheme}
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-muted-foreground transition-colors hover:border-primary/20 hover:text-primary ${
                    isTransitioning ? 'theme-toggle-animate' : ''
                  }`}
                  aria-label="Toggle theme"
                >
                  {mounted && isDark ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
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
                    <p className="text-xs text-muted-foreground">Chief Pharmacist</p>
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
          <div className="h-full max-w-[86vw] border-r border-white/10 bg-[#0a1521] px-5 py-5 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <Link
                to="/dashboard"
                className="flex items-center gap-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="gradient-primary flex h-11 w-11 items-center justify-center rounded-2xl">
                  <Pill className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">MedSecure</p>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                    Pharmacist Hub
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
              <p className="text-xs text-muted-foreground">Chief Pharmacist</p>
            </div>

            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                className="flex-1 rounded-2xl border-white/10 bg-white/[0.03]"
                onClick={toggleTheme}
              >
                {mounted && isDark ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
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
              End this MedSecure pharmacist session and return to the login page?
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowLogout(false)}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
