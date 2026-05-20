import { useEffect, useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { AppShell } from '../components/layout/AppShell';
import { PageLoader } from '../components/ui/PageLoader';
import { fetchApprovalAnalytics } from '../services/api';
import { analyticsFallback } from '../utils/demoData';

const COLORS = ['#22d3ee', '#f97316', '#f43f5e', '#8b5cf6'];

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState<any>(analyticsFallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchApprovalAnalytics();
        setAnalytics(response.data);
      } catch {
        setAnalytics(analyticsFallback);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  if (loading) {
    return (
      <AppShell>
        <PageLoader label="Loading analytics..." />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="glass-card p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Approval analytics</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">Decision performance</h2>
            <p className="mt-4 text-slate-400">Review monthly approval rates, rejection signals, and AI risk segments across your portfolio.</p>
            <div className="mt-6 grid gap-4">
              <div className="rounded-3xl bg-slate-950/80 p-4">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Approvals</p>
                <p className="mt-3 text-4xl font-semibold text-white">{analytics.approvalRates?.find((item: any) => item._id === 'approved')?.count ?? 28}</p>
              </div>
              <div className="rounded-3xl bg-slate-950/80 p-4">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Risk alerts</p>
                <p className="mt-3 text-4xl font-semibold text-white">{analytics.riskDistribution?.reduce((acc: number, item: any) => acc + (item._id !== 'Low' ? item.count : 0), 0) ?? 50}</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Trend velocity</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">Monthly application flow</h2>
            <div className="mt-6 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.monthlyApplications?.map((item: any) => ({ label: `${item._id.month}/${item._id.year}`, count: item.count })) || []}>
                  <defs>
                    <linearGradient id="gradient-analytics" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.75} />
                      <stop offset="100%" stopColor="#0f172a" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="count" stroke="#22d3ee" fill="url(#gradient-analytics)" strokeWidth={3} />
                  <XAxis dataKey="label" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="glass-card p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Risk distribution</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">Portfolio exposure</h2>
            <div className="mt-6 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={analytics.riskDistribution || []} dataKey="count" nameKey="_id" innerRadius={60} outerRadius={100} paddingAngle={4}>
                    {(analytics.riskDistribution || []).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Fraud risk</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Threat indicators</h2>
            </div>
            <span className="rounded-3xl bg-cyan-500/10 px-4 py-2 text-sm uppercase tracking-[0.3em] text-cyan-200">Stable signal</span>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {analytics.verificationRates?.map((item: any, index: number) => (
              <div key={item.name} className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{item.name}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{item.value}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default AnalyticsPage;
