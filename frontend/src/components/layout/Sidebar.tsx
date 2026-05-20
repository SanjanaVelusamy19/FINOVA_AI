import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, BarChart3, Layers, Sparkles, ShieldCheck, Settings, Menu } from 'lucide-react';

const items = [
  { label: 'Dashboard', to: '/dashboard', icon: Home },
  { label: 'Applications', to: '/applications', icon: FileText },
  { label: 'Analytics', to: '/analytics', icon: BarChart3 },
  { label: 'Workflow', to: '/workflow', icon: Layers },
  { label: 'Tasks', to: '/tasks', icon: ShieldCheck },
  { label: 'AI Activity', to: '/ai-activity', icon: Sparkles },
  { label: 'Settings', to: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside className={`relative flex h-full flex-col justify-between overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/90 p-5 text-slate-300 shadow-[0_0_55px_rgba(34,211,238,0.16)] transition-all duration-300 ${collapsed ? 'w-20 px-3' : 'w-full max-w-[300px] px-6'}`}>
      <div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-3xl border border-white/10 bg-slate-900/80 text-cyan-200 transition hover:border-cyan-400/30 hover:bg-slate-900"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="mb-8 flex items-center gap-4 rounded-[2rem] border border-white/10 bg-slate-900/90 p-4 shadow-[0_0_40px_rgba(34,211,238,0.08)]">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500/30 to-violet-500/25 text-cyan-100 shadow-lg shadow-cyan-500/20">
            <span className="text-2xl font-semibold">F</span>
            <span className="absolute -right-1 top-1 inline-flex h-3 w-3 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.45)]" />
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/90">FINOVA AI</p>
              <p className="text-xs text-slate-400">AI-driven finance hub</p>
            </div>
          )}
        </div>

        <nav className="space-y-2">
          {items.map((item) => {
            const active = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex items-center gap-4 rounded-3xl px-4 py-4 text-sm font-semibold transition ${
                  active ? 'bg-cyan-500/15 text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.18)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                } ${collapsed ? 'justify-center px-3' : ''}`}
              >
                <Icon className="h-6 w-6" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {!collapsed && (
        <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-4 text-sm text-slate-400 shadow-[0_0_40px_rgba(34,211,238,0.06)]">
          <p className="uppercase tracking-[0.25em] text-cyan-300/70">Quick tip</p>
          <p className="mt-3 text-slate-300">Navigate to analytics, AI insights, and workflow operations with one click.</p>
        </div>
      )}
    </aside>
  );
};
