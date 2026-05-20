export const emptyDashboard = {
  totalApplications: 0,
  approvedLoans: 0,
  pendingVerification: 0,
  riskAlerts: 0,
  monthlyApplications: [] as { _id: { year: number; month: number }; count: number }[],
  riskDistribution: [] as { _id: string; count: number }[],
  aiLogs: [] as { _id?: string; type?: string; title?: string; detail?: string; timestamp?: string }[],
};

export const emptyAnalytics = {
  approvalRates: [] as { _id: string; count: number }[],
  monthlyApplications: [] as { _id: { year: number; month: number }; count: number }[],
  riskDistribution: [] as { _id: string; count: number }[],
  verificationRates: [] as { name: string; value: number }[],
  aiConfidence: [] as { name: string; value: number }[],
};

export const dashboardFallback = {
  totalApplications: 84,
  approvedLoans: 28,
  pendingVerification: 13,
  riskAlerts: 9,
  monthlyApplications: [
    { _id: { year: 2026, month: 1 }, count: 9 },
    { _id: { year: 2026, month: 2 }, count: 14 },
    { _id: { year: 2026, month: 3 }, count: 18 },
    { _id: { year: 2026, month: 4 }, count: 22 },
    { _id: { year: 2026, month: 5 }, count: 21 },
    { _id: { year: 2026, month: 6 }, count: 19 },
  ],
  riskDistribution: [
    { _id: 'Low', count: 33 },
    { _id: 'Moderate', count: 25 },
    { _id: 'High', count: 17 },
    { _id: 'Critical', count: 9 },
  ],
  aiLogs: [
    { _id: '1', type: 'analysis', title: 'AI risk assessment completed', detail: 'Gemini flagged a moderate risk profile and recommended address proof verification.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
    { _id: '2', type: 'task', title: 'Verification officer assigned', detail: 'Officer Rahul Mehra was assigned to audit borrower documents.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
    { _id: '3', type: 'alert', title: 'Fraud pattern detected', detail: 'AI detected a mismatch between declared income and bank statement history.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() },
  ],
};

export const applicationsFallback = [
  {
    _id: 'app-1',
    customerName: 'Riya Kaur',
    panNumber: 'ABRPK5689L',
    aadhaarNumber: '432198765432',
    income: 820000,
    loanAmount: 420000,
    status: 'assigned',
    riskScore: 48,
    suggestedDecision: 'review',
    documents: ['PAN Card', 'Aadhaar Card', 'Bank Statement'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'app-2',
    customerName: 'Nikhil Jain',
    panNumber: 'CIDPN1234F',
    aadhaarNumber: '123456781234',
    income: 1470000,
    loanAmount: 650000,
    status: 'queued',
    riskScore: 62,
    suggestedDecision: 'approve',
    documents: ['PAN Card', 'Aadhaar Card', 'Income Proof', 'Bank Statement'],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'app-3',
    customerName: 'Meera Shah',
    panNumber: 'SHAMM6357C',
    aadhaarNumber: '987654321987',
    income: 540000,
    loanAmount: 340000,
    status: 'analysis',
    riskScore: 76,
    suggestedDecision: 'review',
    documents: ['PAN Card', 'Aadhaar Card'],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const analyticsFallback = {
  approvalRates: [
    { _id: 'approved', count: 28 },
    { _id: 'review', count: 34 },
    { _id: 'rejected', count: 18 },
    { _id: 'queued', count: 4 },
  ],
  monthlyApplications: [
    { _id: { year: 2026, month: 1 }, count: 9 },
    { _id: { year: 2026, month: 2 }, count: 14 },
    { _id: { year: 2026, month: 3 }, count: 18 },
    { _id: { year: 2026, month: 4 }, count: 22 },
    { _id: { year: 2026, month: 5 }, count: 21 },
    { _id: { year: 2026, month: 6 }, count: 19 },
  ],
  riskDistribution: [
    { _id: 'Low', count: 34 },
    { _id: 'Moderate', count: 26 },
    { _id: 'High', count: 14 },
    { _id: 'Critical', count: 10 },
  ],
  verificationRates: [
    { name: 'Completed', value: 58 },
    { name: 'Pending', value: 26 },
    { name: 'Escalated', value: 16 },
  ],
  aiConfidence: [
    { name: 'High', value: 55 },
    { name: 'Medium', value: 31 },
    { name: 'Low', value: 14 },
  ],
};

export const workflowFallback = [
  {
    _id: 'wf-1',
    customerName: 'Riya Kaur',
    status: 'Field Verification Assigned',
    riskScore: 48,
    suggestedDecision: 'review',
    timeline: ['Submitted', 'Risk Analysis', 'Assigned to officer'],
    lastUpdated: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'wf-2',
    customerName: 'Meera Shah',
    status: 'AI Review',
    riskScore: 76,
    suggestedDecision: 'review',
    timeline: ['Submitted', 'AI Risk Analysis', 'Triggered manual review'],
    lastUpdated: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
  },
];

export const tasksFallback = [
  {
    _id: 'task-1',
    applicationId: { customerName: 'Nikhil Jain' },
    officer: { name: 'Rahul Mehra' },
    status: 'in_progress',
    notes: 'Verify bank statement dates and signature consistency.',
    priority: 'High',
    eta: 'Today, 16:00',
  },
  {
    _id: 'task-2',
    applicationId: { customerName: 'Riya Kaur' },
    officer: { name: 'Aditi Kapoor' },
    status: 'pending',
    notes: 'Awaiting borrower to submit address proof.',
    priority: 'Medium',
    eta: 'Tomorrow, 11:00',
  },
];

export const aiLogsFallback = [
  {
    _id: 'log-1',
    title: 'Document verification completed',
    detail: 'FINOVA AI confirmed PAN authenticity and flagged an inconsistent bank signature.',
    timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    severity: 'info',
  },
  {
    _id: 'log-2',
    title: 'High risk score generated',
    detail: 'Gemini identified a 76 risk score and recommended manual review.',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    severity: 'warning',
  },
  {
    _id: 'log-3',
    title: 'Verification officer assigned',
    detail: 'Officer assigned to complete field verification for the loan.',
    timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    severity: 'info',
  },
];
