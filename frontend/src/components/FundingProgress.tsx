export const FundingProgress = ({ progress }: { progress: number }) => (
  <div>
    <div className="mb-1 text-sm text-slate-300">Funding Progress: {progress.toFixed(2)}%</div>
    <div className="h-2 overflow-hidden rounded bg-slate-700">
      <div className="h-full bg-emerald-400 transition-all" style={{ width: `${Math.min(100, progress)}%` }} />
    </div>
  </div>
);
