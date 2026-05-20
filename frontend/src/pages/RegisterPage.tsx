import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearApiCache, registerRequest } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { setUserFromToken } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await registerRequest(form);
      const token = response.data?.token;
      if (!token) {
        setError('Invalid response from server.');
        return;
      }
      clearApiCache();
      setUserFromToken(token);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-midnight text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.16),_transparent_24%),radial-gradient(circle_at_95%_15%,_rgba(34,211,238,0.18),_transparent_18%)]" />
      <div className="relative mx-auto flex min-h-screen items-center justify-center px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-2xl rounded-[2.25rem] border border-white/10 bg-slate-950/90 p-8 shadow-[0_40px_120px_rgba(8,15,40,0.55)] backdrop-blur-3xl">
          <div className="mb-8 flex items-center gap-4 rounded-3xl bg-slate-900/80 px-5 py-4 text-white/80 shadow-inner shadow-cyan-500/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-200">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/80">FINOVA AI</p>
              <p className="text-lg font-semibold text-white">Join your finance operations team</p>
            </div>
          </div>
          {error && <div className="rounded-3xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm text-slate-300">
                Full name
                <input name="name" type="text" value={form.name} onChange={handleChange} required className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-4 text-base text-slate-100 outline-none transition focus:border-cyan-400/60" placeholder="Aarav Mehta" />
              </label>
              <label className="block text-sm text-slate-300">
                Email address
                <input name="email" type="email" value={form.email} onChange={handleChange} required className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-4 text-base text-slate-100 outline-none transition focus:border-cyan-400/60" placeholder="you@finova.ai" />
              </label>
            </div>
            <label className="block text-sm text-slate-300">
              Password
              <input name="password" type="password" value={form.password} onChange={handleChange} required className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-4 text-base text-slate-100 outline-none transition focus:border-cyan-400/60" placeholder="Create a strong password" />
            </label>
            <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-3 rounded-3xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:from-cyan-300 hover:to-violet-400 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? 'Creating account...' : 'Create account'}
              <Sparkles className="h-4 w-4" />
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-400">
            Already registered? <Link to="/login" className="text-cyan-300 hover:text-cyan-200">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
