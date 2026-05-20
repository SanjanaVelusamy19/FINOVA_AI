import { useEffect, useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { PageLoader } from '../components/ui/PageLoader';
import { fetchAiLogs } from '../services/api';

const severityClasses: Record<string, string> = {
  info: 'bg-cyan-500/10 text-cyan-200',
  warning: 'bg-amber-500/10 text-amber-200',
  critical: 'bg-rose-500/10 text-rose-200',
  danger: 'bg-rose-500/10 text-rose-200',
};

const AiLogsPage = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchAiLogs();
        const payload = response.data as any[] | { aiLogs?: any[] };
        setLogs(Array.isArray(payload) ? payload : payload?.aiLogs || []);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="glass-card p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">AI activity</p>
              <h1 className="mt-2 text-4xl font-semibold text-white">Real-time intelligence timeline</h1>
            </div>
            <span className="rounded-3xl bg-white/5 px-4 py-3 text-sm text-slate-300">Gemini analysis, rules, and alerts</span>
          </div>
        </div>

        {loading ? (
          <PageLoader label="Loading AI activity..." />
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log._id} className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-[0_20px_70px_rgba(8,15,40,0.3)]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-200">AI</div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.32em] text-slate-400">{log.type}</p>
                      <h2 className="mt-2 text-2xl font-semibold text-white">{log.title}</h2>
                    </div>
                  </div>
                  <div className="space-y-2 text-right">
                    <span className="block text-sm text-slate-400">{new Date(log.timestamp).toLocaleString()}</span>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${severityClasses[log.severity] ?? 'bg-slate-800 text-slate-200'}`}>
                      {log.severity || 'info'}
                    </span>
                  </div>
                </div>
                <p className="mt-5 text-slate-300">{log.detail}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default AiLogsPage;
