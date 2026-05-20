import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearApiCache, loginRequest } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, ArrowRight, Shield } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, setUserFromToken } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('finova_remember_email');
    if (savedEmail) {
      setForm((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await loginRequest(form);
      const token = response.data?.token;
      if (!token) {
        setError('Invalid response from server.');
        return;
      }
      clearApiCache();
      setUserFromToken(token);
      if (rememberMe) {
        localStorage.setItem('finova_remember_email', form.email);
      } else {
        localStorage.removeItem('finova_remember_email');
      }
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Unable to authenticate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-midnight text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_24%),radial-gradient(circle_at_85%_10%,_rgba(168,85,247,0.16),_transparent_20%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-10">
        <div className="grid gap-8 rounded-[2.25rem] border border-white/10 bg-slate-950/80 p-8 shadow-[0_40px_120px_rgba(8,15,40,0.45)] backdrop-blur-3xl lg:grid-cols-[0.95fr_0.8fr]">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm uppercase tracking-[0.32em] text-cyan-200 shadow-[0_0_30px_rgba(34,211,238,0.12)]">
              <ShieldCheck className="h-4 w-4" /> FINOVA AI
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl font-semibold tracking-tight text-white xl:text-6xl">Secure finance operations, powered by AI.</h1>
              <p className="max-w-xl text-lg leading-8 text-slate-300">Sign in to monitor applications, verify loan pipelines, and manage risk with a premium fintech control plane.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Approval velocity</p>
                <p className="mt-4 text-4xl font-semibold text-white">98%</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Risk alert reduction</p>
                <p className="mt-4 text-4xl font-semibold text-white">72%</p>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 text-slate-300 shadow-glow">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Why FINOVA</p>
              <ul className="mt-5 space-y-3 text-base leading-7">
                <li>• Gemini-powered risk scoring and fraud detection.</li>
                <li>• Live task assignment for verification teams.</li>
                <li>• Audit-ready workflow monitoring and reports.</li>
              </ul>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-8 shadow-[0_35px_90px_rgba(8,15,40,0.45)]">
            <div className="mb-8 flex items-center justify-between rounded-3xl bg-slate-900/80 px-5 py-4 text-white/80 shadow-inner shadow-cyan-500/5">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/80">FINOVA AI</p>
                <p className="text-lg font-semibold text-white">Enterprise login</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-3xl bg-cyan-500/15 px-3 py-2 text-xs uppercase tracking-[0.3em] text-cyan-200">Secure</div>
            </div>
            {error && <div className="rounded-3xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block text-sm text-slate-300">
                Email address
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-4 text-base text-slate-100 outline-none transition focus:border-cyan-400/60"
                  placeholder="you@finova.ai"
                />
              </label>
              <label className="block text-sm text-slate-300">
                Password
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-4 text-base text-slate-100 outline-none transition focus:border-cyan-400/60"
                  placeholder="Enter password"
                />
              </label>
              <div className="flex items-center justify-between gap-3 text-sm text-slate-400">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="h-4 w-4 rounded border-white/10 bg-slate-900 text-cyan-400 focus:ring-cyan-400"
                  />
                  Remember me
                </label>
                <Link to="/register" className="text-cyan-300 transition hover:text-cyan-200">Create account</Link>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-3 rounded-3xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:from-cyan-300 hover:to-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Sign in'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-4 text-slate-300">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Trusted access</p>
                <p className="mt-3 text-lg font-semibold text-white">Single point login for all operations</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-4 text-slate-300">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">AI protection</p>
                <p className="mt-3 text-lg font-semibold text-white">Adaptive risk checks on every session</p>
              </div>
            </div>
            <div className="mt-6 rounded-3xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-sm text-slate-400">
              <p className="text-cyan-200/90">
                Demo: <span className="text-white">admin@finova.ai</span> / <span className="text-white">Admin@123</span>
              </p>
            </div>
            <div className="mt-4 rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-400">
              <p className="text-slate-300">Need help? Contact your FINOVA admin for access or integrations.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
