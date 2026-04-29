import { CheckCircle2, ShieldAlert, ShieldCheck, ShieldOff } from 'lucide-react';

import { VerifyBatchResponse } from '@/services/api';
import StatusBadge from '@/components/StatusBadge';

type VerificationCardProps = {
  batchId: string;
  verification: VerifyBatchResponse;
};

export default function VerificationCard({ batchId, verification }: VerificationCardProps) {
  const isVerified = verification.valid;
  const Icon = isVerified ? ShieldCheck : ShieldOff;

  return (
    <div className={`rounded-[28px] border p-6 ${
      isVerified
        ? 'border-primary/15 bg-primary/8'
        : 'border-rose-400/15 bg-rose-400/8'
    }`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className={`flex h-14 w-14 items-center justify-center rounded-[22px] ${
            isVerified ? 'bg-primary/12 text-primary' : 'bg-rose-400/12 text-rose-400'
          }`}>
            <Icon className="h-7 w-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={isVerified ? 'Verified' : 'Tampered'} />
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {batchId}
              </span>
            </div>
            <h3 className="mt-3 text-2xl font-bold text-foreground">
              {isVerified ? 'Batch integrity confirmed' : 'Blockchain verification failed'}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{verification.reason}</p>
          </div>
        </div>

        <div className="grid gap-2 rounded-2xl border border-white/8 bg-background/55 px-4 py-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            {verification.hash_match ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            ) : (
              <ShieldAlert className="h-4 w-4 text-rose-400" />
            )}
            Hash match: {verification.hash_match ? 'Yes' : 'No'}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            {verification.signature_valid ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            ) : (
              <ShieldAlert className="h-4 w-4 text-rose-400" />
            )}
            Signature: {verification.signature_valid ? 'Valid' : 'Invalid'}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            {verification.chain_valid ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            ) : (
              <ShieldAlert className="h-4 w-4 text-rose-400" />
            )}
            Chain: {verification.chain_valid ? 'Continuous' : 'Broken'}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/8 bg-background/45 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Recorded hash</p>
          <p className="mt-2 break-all text-xs text-foreground">{verification.recorded_hash || 'N/A'}</p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-background/45 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Expected hash</p>
          <p className="mt-2 break-all text-xs text-foreground">{verification.expected_hash || 'N/A'}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/8 bg-background/45 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Last actor</p>
          <p className="mt-2 text-sm font-semibold text-foreground">
            {verification.latest_actor?.name || 'Unknown'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {verification.latest_actor?.role || 'No role available'}
          </p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-background/45 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Current owner</p>
          <p className="mt-2 text-sm font-semibold text-foreground">
            {typeof verification.current_owner === 'object'
              ? verification.current_owner?.name || 'Unknown'
              : verification.current_owner ?? 'Unknown'}
          </p>
        </div>
      </div>
    </div>
  );
}
