import { useCallback, useEffect, useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { AppShell } from '../components/layout/AppShell';
import { PageLoader } from '../components/ui/PageLoader';
import { fetchDashboard } from '../services/api';
import { dashboardFallback } from '../utils/demoData';

const colors = ['#22d3ee', '#f97316', '#f43f5e', '#a78bfa'];

const DashboardPage = () => {
  const [metrics, setMetrics] = useState<any>(dashboardFallback);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const response = await fetchDashboard();
      setMetrics(response.data || dashboardFallback);
    } catch {
      setMetrics(dashboardFallback);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const interval = setInterval(() => void load(), 60_000);
    return () => clearInterval(interval);
  }, [load]);

  if (loading) {
    return (
      <AppShell>
        <PageLoader label="Loading dashboard..." />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-card p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Executive summary</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">AI-powered loan intelligence</h1>
            <p className="mt-4 text-slate-400">Monitor approvals, verification flow, and risk alerts across your financial operations in real time.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Total applications</p>
                <p className="mt-4 text-4xl font-semibold text-white">{metrics.totalApplications}</p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Approved</p>
                <p className="mt-4 text-4xl font-semibold text-white">{metrics.approvedLoans}</p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Verification pending</p>
                <p className="mt-4 text-4xl font-semibold text-white">{metrics.pendingVerification}</p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">AI risk alerts</p>
                <p className="mt-4 text-4xl font-semibold text-white">{metrics.riskAlerts}</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Live signal</p>
            <div className="mt-5 grid gap-4">
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-5">
                <p className="text-sm text-slate-400">Average decision confidence</p>
                <p className="mt-3 text-3xl font-semibold text-white">88%</p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-5">
                <p className="text-sm text-slate-400">Monthly approval acceleration</p>
                <p className="mt-3 text-3xl font-semibold text-white">+22%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Pipeline trend</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Applications over time</h2>
              </div>
              <span className="rounded-3xl bg-cyan-500/10 px-3 py-2 text-xs uppercase tracking-[0.3em] text-cyan-200">+18% vs last quarter</span>
            </div>
            <div className="mt-6 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.monthlyApplications.map((item: any) => ({ label: `${item._id.month}/${item._id.year}`, count: item.count }))}>
                  <defs>
                    <linearGradient id="dashboardGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.85} />
                      <stop offset="100%" stopColor="#0f172a" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="count" stroke="#22d3ee" fill="url(#dashboardGradient)" strokeWidth={3} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.08)' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Risk heatmap</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Portfolio distribution</h2>
            </div>
            <div className="mt-8 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={metrics.riskDistribution} dataKey="count" nameKey="_id" innerRadius={60} outerRadius={100} paddingAngle={4}>
                    {metrics.riskDistribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${entry._id}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.08)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">AI activity</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Decision timeline</h2>
            </div>
            <span className="rounded-3xl bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.3em] text-slate-300">Realtime feed</span>
          </div>
          <div className="mt-6 space-y-4">
            {metrics.aiLogs.map((log: any) => (
              <div key={log._id} className="rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.15)]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{log.type}</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">{log.title}</h3>
                  </div>
                  <span className="rounded-3xl bg-white/5 px-3 py-2 text-sm text-slate-300">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="mt-3 text-slate-300">{log.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default DashboardPage;
