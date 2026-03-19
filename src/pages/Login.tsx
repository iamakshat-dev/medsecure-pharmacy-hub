import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, KeyRound, Loader2, Lock, Mail, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isAuthenticated, setAuthenticated } from '@/lib/auth';

type AuthMode = 'login' | 'signup' | 'forgot';

type FormState = {
  username: string;
  password: string;
  email: string;
};

const initialState: FormState = {
  username: '',
  password: '',
  email: '',
};

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState<FormState>(initialState);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const heading = useMemo(() => {
    if (mode === 'signup') {
      return 'Create your account';
    }

    if (mode === 'forgot') {
      return 'Reset password';
    }

    return 'Welcome back';
  }, [mode]);

  const description = useMemo(() => {
    if (mode === 'signup') {
      return 'Sign up with username, email, and password to continue.';
    }

    if (mode === 'forgot') {
      return 'Enter your email and we will connect you with a reset link.';
    }

    return 'Log in with your username and password.';
  }, [mode]);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setMessage('');
    setLoading(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    setTimeout(() => {
      if (mode === 'login') {
        setAuthenticated(true);
        setMessage(`Logged in successfully as ${form.username}.`);
        navigate('/dashboard', { replace: true });
      } else if (mode === 'signup') {
        setMessage(`Account created for ${form.username}. You can now log in.`);
      } else {
        setMessage(`Password reset link sent to ${form.email}. Check your inbox.`);
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background px-4 py-10 text-foreground sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="medical-grid absolute inset-0 opacity-40" />
        <div className="medical-orb absolute -left-16 top-24 h-56 w-56 animate-pulse-soft" />
        <div className="medical-orb medical-orb-secondary absolute right-0 top-16 h-72 w-72 animate-float" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 text-sm text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="glass border-border/60 shadow-card">
            <CardHeader>
              <CardTitle className="text-3xl text-secondary" style={{ fontFamily: 'var(--font-heading)' }}>
                Secure access for your pharmacy team
              </CardTitle>
              <CardDescription className="text-base leading-7">
                Use one workflow for login, new user registration, and password recovery, all with the same trusted
                MedSecure experience.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4">
                <p className="font-medium text-foreground">Login</p>
                <p className="mt-1">Username and password for existing users.</p>
              </div>
              <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4">
                <p className="font-medium text-foreground">Sign Up</p>
                <p className="mt-1">Username, email, and password for new users.</p>
              </div>
              <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4">
                <p className="font-medium text-foreground">Forgot Password</p>
                <p className="mt-1">Reset link sent to the registered email address.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-border/60 shadow-card">
            <CardHeader>
              <div className="inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Authentication
              </div>
              <CardTitle className="mt-3 text-2xl text-secondary" style={{ fontFamily: 'var(--font-heading)' }}>
                {heading}
              </CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-5 grid grid-cols-3 gap-2 rounded-xl border border-border bg-muted/40 p-1">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    mode === 'login' ? 'gradient-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    mode === 'signup' ? 'gradient-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Sign Up
                </button>
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    mode === 'forgot' ? 'gradient-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Forgot
                </button>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {mode !== 'forgot' && (
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="username"
                        required
                        value={form.username}
                        onChange={(event) => updateField('username', event.target.value)}
                        placeholder="Enter username"
                        className="pl-10"
                      />
                    </div>
                  </div>
                )}

                {(mode === 'signup' || mode === 'forgot') && (
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(event) => updateField('email', event.target.value)}
                        placeholder="name@example.com"
                        className="pl-10"
                      />
                    </div>
                  </div>
                )}

                {mode !== 'forgot' && (
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        required
                        value={form.password}
                        onChange={(event) => updateField('password', event.target.value)}
                        placeholder="Enter password"
                        className="pl-10"
                      />
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="h-11 w-full gradient-primary text-primary-foreground"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {mode === 'login' && 'Login'}
                      {mode === 'signup' && 'Create Account'}
                      {mode === 'forgot' && 'Send Reset Email'}
                    </>
                  )}
                </Button>
              </form>

              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <KeyRound className="h-4 w-4" />
                  Forgot password?
                </button>
              )}

              {message && (
                <div className="mt-4 rounded-xl border border-secondary/20 bg-secondary/10 px-4 py-3 text-sm text-secondary">
                  {message}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
