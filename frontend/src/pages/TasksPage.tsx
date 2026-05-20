import { useCallback, useEffect, useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { PageLoader } from '../components/ui/PageLoader';
import { fetchTasks, updateTask } from '../services/api';

const statusLabel: Record<string, string> = {
  pending: 'Pending',
  in_progress: 'In progress',
  completed: 'Completed',
  escalated: 'Escalated',
};

const TasksPage = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = useCallback(async (opts?: { skipCache?: boolean; silent?: boolean }) => {
    if (!opts?.silent) setLoading(true);
    try {
      const response = await fetchTasks({ skipCache: opts?.skipCache });
      setTasks(Array.isArray(response.data) ? response.data : []);
    } catch {
      setTasks([]);
    } finally {
      if (!opts?.silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTasks({});
    const interval = setInterval(() => void loadTasks({ silent: true }), 45_000);
    return () => clearInterval(interval);
  }, [loadTasks]);

  useEffect(() => {
    const onRefresh = () => void loadTasks({ skipCache: true, silent: true });
    window.addEventListener('finova:data-changed', onRefresh);
    return () => window.removeEventListener('finova:data-changed', onRefresh);
  }, [loadTasks]);

  const handleStatus = async (id: string, status: string) => {
    await updateTask(id, { status, note: `Marked ${status} in UI` });
    void loadTasks({ skipCache: true, silent: true });
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="glass-card p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Verification tasks</p>
              <h1 className="mt-2 text-4xl font-semibold text-white">Active officer queue</h1>
              <p className="mt-3 max-w-2xl text-slate-400">Review pending checks, monitor progress, and complete approvals from one place.</p>
            </div>
            <button onClick={() => void loadTasks({ skipCache: true })} className="rounded-3xl bg-gradient-to-r from-cyan-500/20 to-violet-500/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:from-cyan-400 hover:to-violet-300">
              Refresh tasks
            </button>
          </div>
        </div>

        {loading ? (
          <PageLoader label="Loading verification tasks..." />
        ) : tasks.length === 0 ? (
          <div className="glass-card p-8 text-center text-slate-400">No verification tasks in queue. Applications flagged by AI will appear here.</div>
        ) : (
          <div className="grid gap-5">
            {tasks.map((task) => (
              <div key={task._id} className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-[0_30px_80px_rgba(8,15,40,0.25)]">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Application</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">{task.applicationId?.customerName || 'Unknown borrower'}</h2>
                  </div>
                  <div className="space-y-2 text-right">
                    <span className="block rounded-3xl bg-white/5 px-4 py-2 text-sm text-slate-200">Officer: {task.officer?.name || 'Unassigned'}</span>
                    <span className="block rounded-3xl bg-cyan-500/10 px-4 py-2 text-sm uppercase tracking-[0.25em] text-cyan-200">{statusLabel[task.status] ?? task.status}</span>
                  </div>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-900/80 p-4 text-slate-300">
                    <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Pending checks</p>
                    <p className="mt-2 text-lg text-white">{task.notes || 'Document verification and identity audit'}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-900/80 p-4 text-slate-300">
                    <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Due date</p>
                    <p className="mt-2 text-lg text-white">{task.eta || 'Today, 18:00'}</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button onClick={() => void handleStatus(task._id, 'in_progress')} className="rounded-3xl bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200 transition hover:bg-cyan-400/20">In progress</button>
                  <button onClick={() => void handleStatus(task._id, 'completed')} className="rounded-3xl bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200 transition hover:bg-emerald-400/20">Complete</button>
                  <button onClick={() => void handleStatus(task._id, 'escalated')} className="rounded-3xl bg-rose-500/10 px-4 py-2 text-sm text-rose-200 transition hover:bg-rose-500/20">Escalate</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default TasksPage;
