import { useEffect, useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { fetchApplications } from '../services/api';
import { LoanForm } from '../components/forms/LoanForm';

const statusStyles: Record<string, string> = {
  approved: 'bg-emerald-400/10 text-emerald-200',
  review: 'bg-amber-400/10 text-amber-200',
  queued: 'bg-cyan-500/10 text-cyan-200',
  analysis: 'bg-violet-500/10 text-violet-200',
  assigned: 'bg-sky-500/10 text-sky-200',
};

const ApplicationsPage = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const response = await fetchApplications();
      setApplications(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadApplications();
  }, []);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="glass-card p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Loan applications</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">Application pipeline</h1>
              <p className="mt-3 max-w-2xl text-slate-400">Review borrower requests, status, risk scores, and verification progress in one unified view.</p>
            </div>
            <button onClick={loadApplications} className="inline-flex items-center gap-2 rounded-3xl bg-gradient-to-r from-cyan-500/20 to-violet-500/15 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:from-cyan-400 hover:to-violet-400">
              <RefreshCcw className="h-4 w-4" /> Refresh list
            </button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.25fr]">
          <LoanForm onSubmitted={loadApplications} />

          <div className="glass-card p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">Latest applications</h2>
                <p className="mt-2 text-slate-400">Most recent loan requests and automated loan intelligence summaries.</p>
              </div>
              <span className="rounded-3xl bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.3em] text-slate-300">{applications.length} items</span>
            </div>

            {loading ? (
              <div className="mt-10 text-slate-400">Loading applications...</div>
            ) : (
              <div className="mt-6 space-y-4">
                {applications.map((application) => (
                  <div key={application._id} className="rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-5 shadow-[0_20px_60px_rgba(8,15,40,0.25)]">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{application.customerName}</p>
                        <h3 className="mt-2 text-2xl font-semibold text-white">₹{application.loanAmount.toLocaleString()}</h3>
                      </div>
                      <div className="space-y-2 text-right">
                        <span className={`inline-flex rounded-3xl px-3 py-2 text-sm font-semibold ${statusStyles[application.status] ?? 'bg-slate-800 text-slate-200'}`}>
                          {application.status}
                        </span>
                        <p className="text-sm text-slate-400">Risk score: <span className="text-white">{application.riskScore}</span></p>
                      </div>
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-3xl bg-slate-900/80 p-4 text-slate-300">
                        <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Decision</p>
                        <p className="mt-2 text-white">{application.suggestedDecision}</p>
                      </div>
                      <div className="rounded-3xl bg-slate-900/80 p-4 text-slate-300">
                        <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Submitted</p>
                        <p className="mt-2 text-white">{new Date(application.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {application.documents?.map((doc: string) => (
                        <span key={doc} className="rounded-full bg-white/5 px-3 py-2 text-xs text-slate-300">{doc}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default ApplicationsPage;
