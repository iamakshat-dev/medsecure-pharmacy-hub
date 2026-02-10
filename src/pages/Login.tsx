import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pill, Lock, User, KeyRound, Building2, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import loginBg from '@/assets/login-bg.jpg';

type Role = 'distributor' | 'pharmacist' | null;

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'pharmacist') {
      navigate('/dashboard');
    } else if (role === 'distributor') {
      navigate('/distributor');
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <div className="absolute inset-0 bg-background/30 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-md animate-fade-scale">
        <div className="glass rounded-3xl p-8 shadow-card">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow">
              <Pill className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                Med
              </h1>
              <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
                Secure
              </h1>
              <Lock className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Pharmaceutical Security Platform</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Role Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Select Role</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('distributor')}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 hover-scale ${
                    role === 'distributor'
                      ? 'border-primary bg-primary/5 shadow-glow'
                      : 'border-border bg-card hover:border-primary/30'
                  }`}
                >
                  <Building2 className={`h-6 w-6 ${role === 'distributor' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={`text-sm font-medium ${role === 'distributor' ? 'text-primary' : 'text-muted-foreground'}`}>
                    Distributor
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('pharmacist')}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 hover-scale ${
                    role === 'pharmacist'
                      ? 'border-primary bg-primary/5 shadow-glow'
                      : 'border-border bg-card hover:border-primary/30'
                  }`}
                >
                  <Stethoscope className={`h-6 w-6 ${role === 'pharmacist' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={`text-sm font-medium ${role === 'pharmacist' ? 'text-primary' : 'text-muted-foreground'}`}>
                    Pharmacist
                  </span>
                </button>
              </div>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-foreground">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="username"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={!role || !username || !password}
              className="w-full gradient-primary text-primary-foreground border-0 hover-scale h-11 text-base font-semibold"
            >
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
