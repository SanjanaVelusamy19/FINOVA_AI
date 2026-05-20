import { ReactNode } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../hooks/useAuth';
import { clearApiCache } from '../../services/api';
import { LogOut } from 'lucide-react';

export const AppShell = ({ children }: { children: ReactNode }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    clearApiCache();
    signOut();
    navigate('/login', { replace: true });
  };

  return (
    <div className="h-screen min-h-0 overflow-hidden bg-midnight text-slate-100">
      <div className="mx-auto flex h-full min-h-0 max-w-[1600px] gap-5 px-4 py-5 lg:px-8">
        <div className="flex min-h-0 w-full flex-1 flex-col gap-5 lg:flex-row">
          <Sidebar />
          <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-y-contain pr-1">
            <div className="space-y-6">
            <header className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-[0_30px_90px_rgba(8,15,40,0.35)] backdrop-blur-xl">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div className="space-y-4">
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Live operations</p>
                  <h1 className="text-4xl font-semibold text-white">FINOVA AI command center</h1>
                  <p className="max-w-2xl text-slate-400">A unified executive experience for loan workflows, risk monitoring, and AI verification automation.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-900/80 p-5 text-slate-300 shadow-inner shadow-cyan-500/5">
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400">User</p>
                    <p className="mt-3 text-xl font-semibold text-white">{user?.name || 'FINOVA Agent'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="inline-flex items-center justify-center gap-2 rounded-3xl bg-cyan-500/15 px-5 py-4 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/25"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/settings" className="rounded-3xl bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.3em] text-slate-300 transition hover:bg-white/10">Platform settings</Link>
                <Link to="/analytics" className="rounded-3xl bg-cyan-500/10 px-4 py-3 text-xs uppercase tracking-[0.3em] text-cyan-200 transition hover:bg-cyan-500/20">View analytics</Link>
              </div>
            </header>
            {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
