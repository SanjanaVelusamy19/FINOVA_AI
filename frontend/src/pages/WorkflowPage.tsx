import { useCallback, useEffect, useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { PageLoader } from '../components/ui/PageLoader';
import { fetchWorkflowHistory } from '../services/api';

const WorkflowPage = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (opts?: { skipCache?: boolean; silent?: boolean }) => {
    if (!opts?.silent) setLoading(true);
    try {
      const response = await fetchWorkflowHistory({ skipCache: opts?.skipCache });
      const data = Array.isArray(response.data) ? response.data : [];
      setHistory(
        data.map((item: any) => ({
          ...item,
          timeline: item.timeline?.length
            ? item.timeline
            : (item.workflow || []).map((w: { step?: string }) => w.step || w),
        }))
      );
    } catch {
      setHistory([]);
    } finally {
      if (!opts?.silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load({});
    const interval = setInterval(() => void load({ silent: true }), 60_000);
    return () => clearInterval(interval);
  }, [load]);

  useEffect(() => {
    const onRefresh = () => void load({ skipCache: true, silent: true });
    window.addEventListener('finova:data-changed', onRefresh);
    return () => window.removeEventListener('finova:data-changed', onRefresh);
  }, [load]);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="glass-card p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Workflow history</p>
              <h1 className="mt-2 text-4xl font-semibold text-white">Application pipeline</h1>
              <p className="mt-3 max-w-2xl text-slate-400">Track the state transitions of each application and understand AI decisions at every stage.</p>
            </div>
            <span className="rounded-3xl bg-cyan-500/15 px-4 py-3 text-sm text-cyan-200">Audit ready</span>
          </div>
        </div>

        {loading ? (
          <PageLoader label="Loading workflow history..." />
        ) : history.length === 0 ? (
          <div className="glass-card p-8 text-center text-slate-400">No workflow records yet. Submit a loan application to see pipeline stages.</div>
        ) : (
          <div className="space-y-5">
            {history.map((item) => (
              <div key={item._id} className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-[0_30px_70px_rgba(8,15,40,0.25)]">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{item.customerName}</p>
                    <h2 className="mt-2 text-3xl font-semibold text-white">{item.status}</h2>
                  </div>
                  <div className="rounded-3xl bg-white/5 px-4 py-2 text-right text-sm text-slate-200">
                    Risk score: <span className="font-semibold text-white">{item.riskScore}</span>
                  </div>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-900/80 p-4 text-slate-300">
                    <p className="text-sm uppercase tracking-[0.28em] text-slate-400">AI recommendation</p>
                    <p className="mt-2 text-lg text-white">{item.suggestedDecision === 'approve' ? 'Approve' : 'Review manually'}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-900/80 p-4 text-slate-300">
                    <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Last updated</p>
                    <p className="mt-2 text-lg text-white">{new Date(item.lastUpdated || item.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {item.timeline?.map((step: string, idx: number) => (
                    <span key={`${item._id}-step-${idx}`} className="rounded-full bg-cyan-500/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-200">{step}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default WorkflowPage;
