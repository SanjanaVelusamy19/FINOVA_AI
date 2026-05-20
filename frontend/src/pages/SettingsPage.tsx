import { useState } from 'react';
import { AppShell } from '../components/layout/AppShell';

const SettingsPage = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [secureLogin, setSecureLogin] = useState(true);
  const [autoAudit, setAutoAudit] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="glass-card p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Platform settings</p>
              <h1 className="mt-2 text-4xl font-semibold text-white">FINOVA configuration</h1>
              <p className="mt-3 max-w-2xl text-slate-400">Configure your team access, security posture, notification channels, and AI workflow behavior.</p>
            </div>
            <div className="rounded-3xl bg-slate-900/80 px-5 py-4 text-sm text-slate-300">Enterprise controls</div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="glass-card p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Profile</p>
            <h2 className="mt-4 text-2xl font-semibold text-white">User settings</h2>
            <div className="mt-6 space-y-4 text-slate-300">
              <button className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-left text-white transition hover:border-cyan-400/30">Update profile details</button>
              <button className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-left text-white transition hover:border-cyan-400/30">Manage API keys</button>
            </div>
          </div>
          <div className="glass-card p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Notifications</p>
            <h2 className="mt-4 text-2xl font-semibold text-white">Alert preferences</h2>
            <div className="mt-6 space-y-4">
              <label className="flex items-center justify-between rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-4">
                <span className="text-slate-200">Email notifications</span>
                <input type="checkbox" checked={notificationsEnabled} onChange={() => setNotificationsEnabled((prev) => !prev)} className="h-5 w-5 rounded border-white/10 bg-slate-900 text-cyan-400" />
              </label>
              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-slate-300">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Audit</p>
                <p className="mt-3">Notifications are sent when high-risk applications or fraud alerts are triggered.</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Security</p>
            <h2 className="mt-4 text-2xl font-semibold text-white">Access protection</h2>
            <div className="mt-6 space-y-4">
              <label className="flex items-center justify-between rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-4">
                <span className="text-slate-200">Secure login</span>
                <input type="checkbox" checked={secureLogin} onChange={() => setSecureLogin((prev) => !prev)} className="h-5 w-5 rounded border-white/10 bg-slate-900 text-cyan-400" />
              </label>
              <label className="flex items-center justify-between rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-4">
                <span className="text-slate-200">Auto audit mode</span>
                <input type="checkbox" checked={autoAudit} onChange={() => setAutoAudit((prev) => !prev)} className="h-5 w-5 rounded border-white/10 bg-slate-900 text-cyan-400" />
              </label>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Theme</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Interface settings</h2>
            </div>
            <button onClick={() => setDarkMode((prev) => !prev)} className="rounded-3xl bg-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/20">
              {darkMode ? 'Dark mode enabled' : 'Enable dark mode'}
            </button>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Modern palette</p>
              <p className="mt-3 text-slate-300">Use neon cyan and violet highlights for dashboard emphasis.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Smooth interactions</p>
              <p className="mt-3 text-slate-300">Button states and chart transitions keep the experience polished.</p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default SettingsPage;
