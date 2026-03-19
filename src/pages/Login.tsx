import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

  const [role, setRole] = useState<'pharmacist' | 'distributor'>('pharmacist');

  // ✅ FIXED AUTO REDIRECT (SAFE VERSION)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    const justLoggedOut = sessionStorage.getItem("justLoggedOut");

    // 🔥 prevent redirect immediately after logout
    if (justLoggedOut === "true") {
      sessionStorage.removeItem("justLoggedOut");
      return;
    }

    if (!token) return;

    if (savedRole === "distributor") {
      navigate('/distributor', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const heading = useMemo(() => {
    if (mode === 'signup') return 'Create your account';
    if (mode === 'forgot') return 'Reset password';
    return 'Welcome back';
  }, [mode]);

  const description = useMemo(() => {
    if (mode === 'signup') return 'Sign up with username, email, and password.';
    if (mode === 'forgot') return 'Enter your email to reset password.';
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

        // ✅ STORE AUTH DATA
        localStorage.setItem("token", "demo-token");
        localStorage.setItem("role", role);
        localStorage.setItem("user", JSON.stringify({ username: form.username }));

        setMessage(`Logged in as ${form.username}`);

        // ✅ ROLE BASED REDIRECT
        if (role === "distributor") {
          navigate('/distributor', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }

      } else if (mode === 'signup') {
        setMessage(`Account created for ${form.username}`);
      } else {
        setMessage(`Reset link sent to ${form.email}`);
      }

      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <CardTitle>{heading}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>

            {mode !== 'forgot' && (
              <div>
                <Label>Username</Label>
                <Input
                  value={form.username}
                  onChange={(e) => updateField('username', e.target.value)}
                />
              </div>
            )}

            {(mode === 'signup' || mode === 'forgot') && (
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                />
              </div>
            )}

            {mode !== 'forgot' && (
              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => updateField('password', e.target.value)}
                />
              </div>
            )}

            {/* ROLE SELECTOR */}
            {mode === 'login' && (
              <div className="space-y-2">
                <Label>Select Role</Label>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={role === 'pharmacist' ? 'default' : 'outline'}
                    className="w-full"
                    onClick={() => setRole('pharmacist')}
                  >
                    Pharmacist
                  </Button>

                  <Button
                    type="button"
                    variant={role === 'distributor' ? 'default' : 'outline'}
                    className="w-full"
                    onClick={() => setRole('distributor')}
                  >
                    Distributor
                  </Button>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full">
              {loading ? <Loader2 className="animate-spin" /> : 'Submit'}
            </Button>
          </form>

          {mode === 'login' && (
            <button
              onClick={() => switchMode('forgot')}
              className="text-sm mt-2 text-primary"
            >
              Forgot password?
            </button>
          )}

          {message && <p className="mt-3 text-sm">{message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}