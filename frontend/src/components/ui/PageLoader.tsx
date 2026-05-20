export const PageLoader = ({ label = 'Loading...' }: { label?: string }) => (
  <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-slate-400">
    <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-400" />
    <p className="text-sm uppercase tracking-[0.3em]">{label}</p>
  </div>
);
