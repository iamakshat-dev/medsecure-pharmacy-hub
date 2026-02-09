import { useState } from 'react';
import { ShieldCheck, QrCode, Loader2, CheckCircle2, XCircle, Building2, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

type VerifyStatus = 'idle' | 'loading' | 'success' | 'error';

const supplyChain = [
  { step: 'Manufactured', location: 'PharmaCorp Ltd, Mumbai', date: '2025-11-10' },
  { step: 'Quality Checked', location: 'QA Lab, Pune', date: '2025-11-15' },
  { step: 'Distributed', location: 'MedDist Hub, Delhi', date: '2025-12-01' },
  { step: 'Received', location: 'City Pharmacy, Bangalore', date: '2025-12-10' },
];

export default function Authentication() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<VerifyStatus>('idle');
  const { ref, isVisible } = useScrollAnimation();

  const handleVerify = () => {
    setStatus('loading');
    setTimeout(() => {
      setStatus(code.toUpperCase().startsWith('MED') ? 'success' : 'error');
    }, 2000);
  };

  const reset = () => {
    setCode('');
    setStatus('idle');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
          Medicine Verification
        </h1>
        <p className="text-sm text-muted-foreground">Verify the authenticity of medicines using batch codes</p>
      </div>

      {/* Verification Card */}
      <div
        ref={ref}
        className={`mx-auto max-w-lg rounded-2xl border border-border bg-card p-8 shadow-card ${isVisible ? 'animate-fade-scale' : 'opacity-0'}`}
      >
        <div className="mb-6 flex justify-center">
          <div className="rounded-2xl bg-primary/10 p-4">
            <ShieldCheck className="h-10 w-10 text-primary" />
          </div>
        </div>

        {status === 'idle' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground">Batch / QR Code</Label>
              <div className="relative">
                <QrCode className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Enter batch code (e.g. MED-2026-0891)"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button
              onClick={handleVerify}
              disabled={!code}
              className="w-full gradient-primary text-primary-foreground border-0 hover-scale h-11"
            >
              Verify Authenticity
            </Button>
          </div>
        )}

        {status === 'loading' && (
          <div className="flex flex-col items-center gap-4 py-8 animate-fade-scale">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground">Verifying medicine authenticity...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="animate-fade-scale space-y-6">
            <div className="flex flex-col items-center gap-3">
              <div className="rounded-full bg-secondary/10 p-3">
                <CheckCircle2 className="h-12 w-12 text-secondary" />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-secondary" style={{ fontFamily: 'var(--font-heading)' }}>
                  Verified Authentic
                </p>
                <p className="text-sm text-muted-foreground">This medicine passed all verification checks</p>
              </div>
            </div>

            {/* Manufacturer Details */}
            <div className="rounded-xl border border-border p-4 space-y-3">
              <h3 className="text-sm font-semibold text-card-foreground">Manufacturer Details</h3>
              <div className="grid gap-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span>PharmaCorp Ltd — Mumbai, India</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Manufactured: Nov 10, 2025</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-secondary" />
                  <span>License: PHARMA-IND-88472</span>
                </div>
              </div>
            </div>

            {/* Supply Chain */}
            <div className="rounded-xl border border-border p-4">
              <h3 className="mb-4 text-sm font-semibold text-card-foreground">Supply Chain Path</h3>
              <div className="space-y-0">
                {supplyChain.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full gradient-primary" />
                      {i < supplyChain.length - 1 && <div className="w-0.5 flex-1 bg-border" />}
                    </div>
                    <div className="pb-6">
                      <p className="text-sm font-medium text-card-foreground">{item.step}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {item.location}
                      </div>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button variant="outline" onClick={reset} className="w-full">
              Verify Another
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div className="animate-fade-scale flex flex-col items-center gap-4 py-4">
            <div className="rounded-full bg-destructive/10 p-3">
              <XCircle className="h-12 w-12 text-destructive" />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-destructive" style={{ fontFamily: 'var(--font-heading)' }}>
                Verification Failed
              </p>
              <p className="text-sm text-muted-foreground">This code could not be verified. Please check and try again.</p>
            </div>
            <Button variant="outline" onClick={reset} className="mt-2">
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
