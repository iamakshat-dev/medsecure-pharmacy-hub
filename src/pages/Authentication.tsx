import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  Factory,
  FileSearch,
  Loader2,
  QrCode,
  ScanLine,
  ShieldCheck,
  Waypoints,
} from 'lucide-react';

import Timeline from '@/components/Timeline';
import VerificationCard from '@/components/VerificationCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getBatchHistory, verifyBatch, type BatchHistoryResponse, type VerifyBatchResponse } from '@/services/api';

type VerifyStatus = 'idle' | 'loading' | 'success' | 'error';

const securityChecks = [
  'Serial QR signature',
  'Distributor invoice hash',
  'Manufacturer license ledger',
  'Cold-chain event continuity',
];

const networkHealthBars = [42, 55, 48, 71, 64, 78, 68, 82];

export default function Authentication() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialBatch = searchParams.get('batch') || '';

  const [code, setCode] = useState(initialBatch);
  const [status, setStatus] = useState<VerifyStatus>('idle');
  const [verification, setVerification] = useState<VerifyBatchResponse | null>(null);
  const [history, setHistory] = useState<BatchHistoryResponse | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const normalizedCode = code.trim().toUpperCase();
  const loadBatchData = async (batchId: string) => {
    setStatus('loading');
    setMessage(null);

    try {
      const [verificationResponse, historyResponse] = await Promise.all([
        verifyBatch(batchId),
        getBatchHistory(batchId),
      ]);

      setVerification(verificationResponse);
      setHistory(historyResponse);
      setStatus(verificationResponse.valid ? 'success' : 'error');
      setSearchParams({ batch: batchId });
    } catch (error) {
      setVerification(null);
      setHistory(null);
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Verification failed');
    }
  };

  useEffect(() => {
    if (initialBatch) {
      void loadBatchData(initialBatch.toUpperCase());
    }
  }, []);

  const handleVerify = async () => {
    if (!normalizedCode) return;
    await loadBatchData(normalizedCode);
  };

  const reset = () => {
    setCode('');
    setStatus('idle');
    setVerification(null);
    setHistory(null);
    setMessage(null);
    setSearchParams({});
  };

  const latestOwner = history?.actors_involved[history.actors_involved.length - 1];

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
        <div className="overflow-hidden rounded-[32px] border border-white/8 bg-card/80 shadow-card">
          <div className="bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.16),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0))] px-6 py-8 sm:px-8">
            <div className="mx-auto max-w-2xl">
              <div className="mb-6 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-[28px] border border-primary/15 bg-primary/10 text-primary shadow-[0_0_48px_rgba(45,212,191,0.18)]">
                  <ShieldCheck className="h-10 w-10" />
                </div>
              </div>

              <div className="text-center">
                <Badge className="border-primary/20 bg-primary/10 px-3 py-1 text-primary" variant="outline">
                  MedSecure Verification Desk
                </Badge>
                <h1 className="mt-5 text-4xl font-bold leading-tight text-foreground">
                  Verify medicine authenticity before it reaches the shelf.
                </h1>
                <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                  Run real blockchain checks against the latest batch record, compare the stored
                  hash, and inspect the full custody trail in a single view.
                </p>
              </div>

              {(status === 'idle' || status === 'loading') && (
                <div className="mt-8 space-y-5">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-[0.28em] text-primary">
                      Serial authentication code
                    </Label>
                    <div className="relative">
                      <QrCode className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={code}
                        onChange={(event) => setCode(event.target.value)}
                        placeholder="BAT-2026-001 or MS-882104"
                        className="h-16 rounded-2xl border-white/10 bg-background/80 pl-12 text-base placeholder:text-muted-foreground/70"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      className="flex h-16 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-background/55 text-sm font-medium text-foreground transition-colors hover:border-primary/20 hover:text-primary"
                      onClick={() => setCode('BAT-2026-001')}
                    >
                      <ScanLine className="h-5 w-5" />
                      Load sample batch
                    </button>
                    <button
                      className="flex h-16 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-background/55 text-sm font-medium text-foreground transition-colors hover:border-cyan-400/20 hover:text-cyan-400"
                      onClick={() => setCode(searchParams.get('batch') || 'BAT-2026-001')}
                    >
                      <FileSearch className="h-5 w-5" />
                      Recheck current batch
                    </button>
                  </div>

                  <Button
                    onClick={handleVerify}
                    disabled={!normalizedCode || status === 'loading'}
                    className="h-16 w-full rounded-2xl border-0 text-lg font-semibold shadow-[0_18px_40px_-18px_rgba(45,212,191,0.65)]"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Verifying on blockchain...
                      </>
                    ) : (
                      <>
                        Verify authenticity
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    Live verification against hashes, signatures, and chain continuity.
                  </div>
                </div>
              )}

              {(status === 'success' || status === 'error') && verification && (
                <div className="mt-8 space-y-6">
                  <VerificationCard batchId={normalizedCode} verification={verification} />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl border border-white/8 bg-background/45 p-5">
                      <div className="flex items-center gap-3">
                        <Factory className="h-5 w-5 text-primary" />
                        <p className="text-sm font-semibold text-foreground">Current holder</p>
                      </div>
                      <p className="mt-4 text-lg font-semibold text-foreground">
                        {latestOwner?.name || 'Unknown owner'}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {latestOwner?.role || 'Role unavailable'}
                      </p>
                    </div>

                    <div className="rounded-3xl border border-white/8 bg-background/45 p-5">
                      <div className="flex items-center gap-3">
                        <Waypoints className="h-5 w-5 text-cyan-400" />
                        <p className="text-sm font-semibold text-foreground">Trace depth</p>
                      </div>
                      <p className="mt-4 text-lg font-semibold text-foreground">
                        {history?.blockchain_trail.length || 0} blockchain blocks
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Full journey from creation to latest custody step
                      </p>
                    </div>
                  </div>

                  {history && (
                    <div className="rounded-[30px] border border-white/8 bg-background/45 p-6">
                      <div className="flex items-center gap-3">
                        <Waypoints className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold text-foreground">Supply trail</h3>
                      </div>
                      <div className="mt-6">
                        <Timeline entries={history.blockchain_trail} />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <Button onClick={reset} variant="outline" className="h-12 rounded-2xl border-white/10 bg-white/[0.03] px-5">
                      Verify another batch
                    </Button>
                    <Button asChild className="h-12 rounded-2xl px-5">
                      <Link to="/dashboard/inventory">Return to inventory</Link>
                    </Button>
                  </div>
                </div>
              )}

              {message && (
                <div className="mt-6 rounded-2xl border border-rose-400/15 bg-rose-400/8 px-4 py-3 text-sm text-rose-400">
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="rounded-[32px] border border-white/8 bg-card/80 p-6 shadow-card">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Live trust stream</p>
            <h2 className="mt-2 text-3xl font-bold text-foreground">What MedSecure checks</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              The backend verification now checks operational MySQL data against the blockchain
              hash chain instead of using a simulated pass/fail result.
            </p>

            <div className="mt-6 space-y-3">
              {securityChecks.map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-2xl border border-white/8 bg-background/45 px-4 py-4"
                >
                  <span className="text-sm font-medium text-foreground">{item}</span>
                  <Badge className="border-primary/20 bg-primary/10 text-primary" variant="outline">
                    active
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/8 bg-card/80 p-6 shadow-card">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Verification readiness</p>
            <h2 className="mt-2 text-3xl font-bold text-foreground">Network health</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Verification should stay understandable and fast even for non-technical pharmacy staff.
            </p>

            <div className="mt-8 flex h-36 items-end gap-3">
              {networkHealthBars.map((bar, index) => (
                <div
                  key={`${bar}-${index}`}
                  className="flex-1 rounded-t-2xl bg-[linear-gradient(180deg,rgba(45,212,191,0.72),rgba(45,212,191,0.24))]"
                  style={{ height: `${bar}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
