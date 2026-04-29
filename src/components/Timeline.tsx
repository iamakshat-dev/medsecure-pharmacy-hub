import { BatchHistoryResponse } from '@/services/api';

type TimelineProps = {
  entries: BatchHistoryResponse['blockchain_trail'];
};

export default function Timeline({ entries }: TimelineProps) {
  return (
    <div className="space-y-0">
      {entries.map((entry, index) => (
        <div key={entry.block_id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="h-3.5 w-3.5 rounded-full bg-primary" />
            {index < entries.length - 1 && <div className="w-px flex-1 bg-white/10" />}
          </div>
          <div className="pb-6 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-foreground">
                {entry.transaction?.action === 'CREATE' ? 'Batch created' : 'Ownership transferred'}
              </p>
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Block #{entry.block_id}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {entry.transaction?.from_actor.name
                ? `${entry.transaction.from_actor.name} -> ${entry.transaction.to_actor.name}`
                : `${entry.transaction?.to_actor.name || entry.actor.name} received custody`}
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {entry.timestamp}
            </p>

            <div className="mt-3 grid gap-3 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/8 bg-background/45 p-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Current hash</p>
                <p className="mt-2 break-all text-xs text-foreground">{entry.current_hash}</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-background/45 p-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Previous hash</p>
                <p className="mt-2 break-all text-xs text-foreground">{entry.previous_hash}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
