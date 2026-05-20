import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, Activity, SlidersHorizontal } from 'lucide-react';

const features = [
  { title: 'AI Risk Scoring', description: 'Gemini-powered assessment and suspicious entry detection.', icon: Sparkles },
  { title: 'Workflow Automation', description: 'From onboarding to approval queue with persistent tracking.', icon: Activity },
  { title: 'Verification Management', description: 'Auto-assign officers and monitor task progress in real time.', icon: ShieldCheck },
  { title: 'Enterprise Analytics', description: 'Approval KPIs, risk distribution, and monthly trends on demand.', icon: SlidersHorizontal },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-midnight text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-16 px-6 py-12 lg:px-14">
        <header className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-sm uppercase tracking-[0.3em] text-cyan-200 ring-1 ring-cyan-400/20">FINOVA AI</span>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">Autonomous finance workflow automation for next-gen lenders.</h1>
            <p className="max-w-2xl text-lg text-slate-300">Reduce verification cycle time, spot risk instantly, and power approval decisions with Gemini-enabled intelligence and modern fintech analytics.</p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/register" className="rounded-3xl bg-cyan-400 px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:bg-cyan-300">Start demo</Link>
              <a href="#features" className="inline-flex items-center justify-center rounded-3xl border border-white/10 px-6 py-4 text-sm text-slate-100 transition hover:border-cyan-300/40">View workflow</a>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-glow backdrop-blur-xl">
            <div className="absolute -left-24 top-10 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="absolute -right-20 bottom-8 h-52 w-52 rounded-full bg-rose-500/10 blur-3xl" />
            <div className="space-y-5">
              <div className="flex items-center justify-between rounded-3xl bg-slate-950/80 p-6">
                <div>
                  <p className="text-slate-400">Approval velocity</p>
                  <p className="text-3xl font-semibold text-white">98%</p>
                </div>
                <div className="rounded-3xl bg-cyan-500/10 px-4 py-3 text-cyan-200">AI score</div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Tasks</p>
                  <p className="mt-4 text-3xl font-semibold text-white">42</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Risk alerts</p>
                  <p className="mt-4 text-3xl font-semibold text-white">7</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section id="features" className="grid gap-6 lg:grid-cols-2">
          {features.map((feature) => (
            <motion.div key={feature.title} whileHover={{ y: -6 }} className="glass-card p-8">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-200">
                <feature.icon className="h-6 w-6" />
              </div>
              <h2 className="mt-6 text-2xl font-semibold text-white">{feature.title}</h2>
              <p className="mt-3 text-slate-300">{feature.description}</p>
            </motion.div>
          ))}
        </section>

        <section className="grid gap-8 rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-glow backdrop-blur-xl lg:grid-cols-[1fr_0.75fr]">
          <div>
            <span className="text-sm uppercase tracking-[0.3em] text-cyan-200/80">How FINOVA works</span>
            <h2 className="mt-4 text-3xl font-semibold text-white">A smart pipeline from application to approval.</h2>
            <p className="mt-4 max-w-xl text-slate-300">FINOVA ingests loan details, runs AI evaluation, identifies document gaps, assigns verification tasks, and tracks decisions through a secure audit-ready workflow.</p>
          </div>
          <div className="grid gap-4">
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
              <p className="text-sm text-cyan-200/80">Step 1</p>
              <p className="mt-2 text-lg font-semibold text-white">Application intake</p>
              <p className="mt-3 text-slate-300">Collect borrower credentials and documents with modern onboarding forms.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
              <p className="text-sm text-cyan-200/80">Step 2</p>
              <p className="mt-2 text-lg font-semibold text-white">AI risk analysis</p>
              <p className="mt-3 text-slate-300">Gemini evaluates entries, generates a risk score, and suggests approve/reject decisions.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
              <p className="text-sm text-cyan-200/80">Step 3</p>
              <p className="mt-2 text-lg font-semibold text-white">Verification & approvals</p>
              <p className="mt-3 text-slate-300">Monitor tasks, review audit trails, and close approvals from one premium dashboard.</p>
            </div>
          </div>
        </section>

        <footer className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-slate-300">
          <div className="grid gap-4 lg:grid-cols-4">
            <div>
              <p className="text-2xl font-semibold text-white">6.2K+</p>
              <p className="mt-2 text-sm uppercase tracking-[0.3em] text-slate-500">Applications processed</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">450+</p>
              <p className="mt-2 text-sm uppercase tracking-[0.3em] text-slate-500">Verification actions</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">94%</p>
              <p className="mt-2 text-sm uppercase tracking-[0.3em] text-slate-500">Decision acceleration</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">Enterprise-ready</p>
              <p className="mt-2 text-sm uppercase tracking-[0.3em] text-slate-500">Auditable workflow logging</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
