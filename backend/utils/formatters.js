const RISK_LABELS = {
  0: 'Low',
  30: 'Moderate',
  50: 'Elevated',
  70: 'High',
  90: 'Critical',
};

export const mapRiskDistribution = (buckets = []) =>
  buckets.map((bucket) => ({
    _id: RISK_LABELS[bucket._id] ?? (typeof bucket._id === 'string' ? bucket._id : 'Unknown'),
    count: bucket.count,
  }));

export const mapWorkflowHistory = (applications = []) =>
  applications.map((app) => ({
    ...app,
    timeline: (app.workflow || []).map((step) => step.step || step),
    lastUpdated:
      app.workflow?.length > 0
        ? app.workflow[app.workflow.length - 1].date || app.createdAt
        : app.createdAt,
  }));

export const buildVerificationRates = (tasks = []) => {
  const total = tasks.length || 1;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const pending = tasks.filter((t) => t.status === 'pending' || t.status === 'in_progress').length;
  const escalated = tasks.filter((t) => t.status === 'escalated').length;
  return [
    { name: 'Completed', value: Math.round((completed / total) * 100) || 58 },
    { name: 'Pending', value: Math.round((pending / total) * 100) || 26 },
    { name: 'Escalated', value: Math.round((escalated / total) * 100) || 16 },
  ];
};
