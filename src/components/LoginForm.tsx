import { useState, useTransition } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Mail, User, Lock } from 'lucide-react';

interface LoginFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginForm({ open, onOpenChange }: LoginFormProps) {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [forgotEmail, setForgotEmail] = useState('');
  const { login } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  const API = 'http://localhost:3000/api';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  startTransition(() => {
    const submitFn = async () => {
      setError('');
    const formData = new FormData(e.currentTarget);
      const body = Object.fromEntries(formData);

      try {
        let res;
        if (tab === 'login') {
          res = await fetch(`${API}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          });
        } else {
          res = await fetch(`${API}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          });
        }

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || 'Error');
        }

        const data = await res.json();
        if (tab === 'login') {
          login(data.token, data.user);
        } else {
          alert('Registered! Please login.');
          setTab('login');
        }
        onOpenChange(false);
      } catch (err: any) {
        setError(err.message);
      }
    };
    submitFn();
  });

  const handleForgot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      if (res.ok) {
        alert('Reset link sent to server console!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl" style={{ fontFamily: 'var(--font-heading)' }}>
            Welcome to MedSecure
          </DialogTitle>
          <DialogDescription>
            Sign in to your account or create a new one
          </DialogDescription>
        </DialogHeader>
        <div className="p-6">
          <Tabs value={tab} onValueChange={(value) => setTab(value as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="p-0 mt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="username" name="username" className="pl-10" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="password" name="password" type="password" className="pl-10" required />
                  </div>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full gradient-primary" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isPending ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
              <Button variant="ghost" className="w-full mt-3 text-sm" onClick={(e) => {
                e.preventDefault();
                setTab('register');
              }}>
                Don't have an account? Sign Up
              </Button>
              <Button variant="link" className="w-full mt-2 text-sm text-destructive" onClick={handleForgot} disabled={isPending}>
                <Mail className="mr-2 h-4 w-4" />
                Forgot Password?
              </Button>
            </TabsContent>
            <TabsContent value="register" className="p-0 mt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="username" name="username" className="pl-10" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="email" name="email" type="email" className="pl-10" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="password" name="password" type="password" className="pl-10" required />
                  </div>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full gradient-primary" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isPending ? 'Creating...' : 'Create Account'}
                </Button>
              </form>
              <Button variant="ghost" className="w-full mt-3 text-sm" onClick={(e) => {
                e.preventDefault();
                setTab('login');
              }}>
                Already have an account? Sign In
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

