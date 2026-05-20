import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import LoanApplication from '../models/LoanApplication.js';
import VerificationTask from '../models/VerificationTask.js';
import AiActivityLog from '../models/AiActivityLog.js';

const DEMO_PASSWORD = 'Admin@123';

const daysAgo = (n) => new Date(Date.now() - n * 24 * 3600 * 1000);

const applicationTemplates = [
  {
    customerName: 'Sahil Gupta',
    panNumber: 'AGKPG1234F',
    aadhaarNumber: '123412341234',
    income: 1280000,
    loanAmount: 650000,
    documents: ['PAN Card', 'Aadhaar Card', 'Bank Statement'],
    status: 'assigned',
    riskScore: 54,
    suggestedDecision: 'review',
    riskSummary: 'Stable income profile; field verification recommended on business documents.',
    missingDocuments: ['Address Proof'],
    workflowSteps: ['Application Submitted', 'Risk Analysis', 'Field Verification Assigned'],
    days: 5,
  },
  {
    customerName: 'Priya Nair',
    panNumber: 'LZPNB8265G',
    aadhaarNumber: '346879102345',
    income: 420000,
    loanAmount: 280000,
    documents: ['PAN Card', 'Aadhaar Card'],
    status: 'analysis',
    riskScore: 71,
    suggestedDecision: 'review',
    riskSummary: 'High loan-to-income ratio with potential document inconsistency.',
    missingDocuments: ['Income Proof', 'Bank Statement'],
    workflowSteps: ['Application Submitted', 'Risk Analysis'],
    days: 2,
  },
  {
    customerName: 'Mohit Sharma',
    panNumber: 'DPXPS8715K',
    aadhaarNumber: '789012345678',
    income: 860000,
    loanAmount: 420000,
    documents: ['PAN Card', 'Aadhaar Card', 'Income Proof', 'Bank Statement'],
    status: 'approved',
    riskScore: 88,
    suggestedDecision: 'approve',
    riskSummary: 'Premium borrower with strong documentation and low risk profile.',
    missingDocuments: [],
    workflowSteps: ['Application Submitted', 'Risk Analysis', 'Field Verification Assigned', 'Approval Queue', 'Final Decision'],
    days: 12,
  },
  {
    customerName: 'Riya Kaur',
    panNumber: 'ABRPK5689L',
    aadhaarNumber: '432198765432',
    income: 820000,
    loanAmount: 420000,
    documents: ['PAN Card', 'Aadhaar Card', 'Bank Statement'],
    status: 'assigned',
    riskScore: 48,
    suggestedDecision: 'review',
    riskSummary: 'Moderate risk; address proof pending verification.',
    missingDocuments: ['Address Proof'],
    workflowSteps: ['Application Submitted', 'Risk Analysis', 'Field Verification Assigned'],
    days: 3,
  },
  {
    customerName: 'Nikhil Jain',
    panNumber: 'CIDPN1234F',
    aadhaarNumber: '123456781234',
    income: 1470000,
    loanAmount: 650000,
    documents: ['PAN Card', 'Aadhaar Card', 'Income Proof', 'Bank Statement'],
    status: 'queued',
    riskScore: 62,
    suggestedDecision: 'approve',
    riskSummary: 'Strong income base; queued for final approval.',
    missingDocuments: [],
    workflowSteps: ['Application Submitted', 'Risk Analysis', 'Approval Queue'],
    days: 4,
  },
  {
    customerName: 'Meera Shah',
    panNumber: 'SHAMM6357C',
    aadhaarNumber: '987654321987',
    income: 540000,
    loanAmount: 340000,
    documents: ['PAN Card', 'Aadhaar Card'],
    status: 'analysis',
    riskScore: 76,
    suggestedDecision: 'review',
    riskSummary: 'Elevated risk due to incomplete income documentation.',
    missingDocuments: ['Bank Statement'],
    workflowSteps: ['Application Submitted', 'Risk Analysis'],
    days: 1,
  },
  {
    customerName: 'Arjun Desai',
    panNumber: 'BKUPD4521H',
    aadhaarNumber: '567890123456',
    income: 960000,
    loanAmount: 510000,
    documents: ['PAN Card', 'Aadhaar Card', 'Income Proof'],
    status: 'approved',
    riskScore: 82,
    suggestedDecision: 'approve',
    riskSummary: 'Consistent repayment history and verified employment.',
    missingDocuments: [],
    workflowSteps: ['Application Submitted', 'Risk Analysis', 'Final Decision'],
    days: 8,
  },
  {
    customerName: 'Kavita Rao',
    panNumber: 'FRTPK9087M',
    aadhaarNumber: '234567890123',
    income: 380000,
    loanAmount: 220000,
    documents: ['PAN Card', 'Aadhaar Card'],
    status: 'rejected',
    riskScore: 35,
    suggestedDecision: 'reject',
    riskSummary: 'Application rejected due to insufficient income documentation.',
    missingDocuments: ['Income Proof', 'Bank Statement'],
    workflowSteps: ['Application Submitted', 'Risk Analysis', 'Final Decision'],
    days: 6,
  },
  {
    customerName: 'Vikram Singh',
    panNumber: 'HJKVS3344P',
    aadhaarNumber: '890123456789',
    income: 1120000,
    loanAmount: 780000,
    documents: ['PAN Card', 'Aadhaar Card', 'Bank Statement', 'Income Proof'],
    status: 'assigned',
    riskScore: 58,
    suggestedDecision: 'review',
    riskSummary: 'Large loan request requires enhanced due diligence.',
    missingDocuments: ['Collateral Declaration'],
    workflowSteps: ['Application Submitted', 'Risk Analysis', 'Field Verification Assigned'],
    days: 7,
  },
  {
    customerName: 'Ananya Iyer',
    panNumber: 'PLKAI7788Q',
    aadhaarNumber: '345678901234',
    income: 720000,
    loanAmount: 390000,
    documents: ['PAN Card', 'Aadhaar Card', 'Bank Statement'],
    status: 'submitted',
    riskScore: 45,
    suggestedDecision: 'review',
    riskSummary: 'Initial screening complete; awaiting document verification.',
    missingDocuments: ['Address Proof'],
    workflowSteps: ['Application Submitted'],
    days: 0,
  },
];

const buildWorkflow = (steps, customerName, startDays) =>
  steps.map((step, index) => ({
    step,
    date: daysAgo(startDays - index),
    actor: step.includes('AI') || step.includes('Risk') ? 'FINOVA AI' : customerName,
  }));

export const runSeed = async ({ force = false } = {}) => {
  const userCount = await User.countDocuments();
  if (!force && userCount > 0) {
    return { seeded: false, message: 'Database already has data' };
  }

  if (force) {
    await Promise.all([
      User.deleteMany(),
      LoanApplication.deleteMany(),
      VerificationTask.deleteMany(),
      AiActivityLog.deleteMany(),
    ]);
  }

  const password = await bcrypt.hash(DEMO_PASSWORD, 10);
  const users = await User.create([
    { name: 'Aditi Kapoor', email: 'admin@finova.ai', password, role: 'admin' },
    { name: 'Rahul Mehra', email: 'officer@finova.ai', password, role: 'officer' },
    { name: 'Neha Singh', email: 'manager@finova.ai', password, role: 'manager' },
  ]);

  const [admin, officer, manager] = users;

  const applications = await LoanApplication.insertMany(
    applicationTemplates.map((tpl) => ({
      customerName: tpl.customerName,
      panNumber: tpl.panNumber,
      aadhaarNumber: tpl.aadhaarNumber,
      income: tpl.income,
      loanAmount: tpl.loanAmount,
      documents: tpl.documents,
      status: tpl.status,
      riskScore: tpl.riskScore,
      suggestedDecision: tpl.suggestedDecision,
      riskSummary: tpl.riskSummary,
      missingDocuments: tpl.missingDocuments,
      workflow: buildWorkflow(tpl.workflowSteps, tpl.customerName, tpl.days),
      createdBy: manager._id,
      assignedOfficer: ['assigned', 'queued', 'approved'].includes(tpl.status) ? officer._id : undefined,
      createdAt: daysAgo(tpl.days),
    }))
  );

  await VerificationTask.insertMany([
    {
      applicationId: applications[0]._id,
      officer: officer._id,
      status: 'in_progress',
      notes: 'Verify address and bank statement evidence.',
      timeline: [{ date: daysAgo(3), event: 'Task created', detail: 'Assigned for field verification.' }],
      createdAt: daysAgo(3),
    },
    {
      applicationId: applications[3]._id,
      officer: officer._id,
      status: 'pending',
      notes: 'Awaiting borrower address proof upload.',
      timeline: [{ date: daysAgo(2), event: 'Task created', detail: 'Pending document submission.' }],
      createdAt: daysAgo(2),
    },
    {
      applicationId: applications[4]._id,
      officer: admin._id,
      status: 'in_progress',
      notes: 'Verify bank statement dates and signature consistency.',
      timeline: [{ date: daysAgo(4), event: 'Task created', detail: 'High-value loan review.' }],
      createdAt: daysAgo(4),
    },
    {
      applicationId: applications[5]._id,
      officer: officer._id,
      status: 'escalated',
      notes: 'Income mismatch flagged by AI — escalate to manager.',
      timeline: [{ date: daysAgo(1), event: 'Escalated', detail: 'AI risk score exceeded threshold.' }],
      createdAt: daysAgo(1),
    },
    {
      applicationId: applications[8]._id,
      officer: admin._id,
      status: 'pending',
      notes: 'Collateral declaration required before approval.',
      timeline: [{ date: daysAgo(5), event: 'Task created', detail: 'Large loan due diligence.' }],
      createdAt: daysAgo(5),
    },
    {
      applicationId: applications[6]._id,
      officer: officer._id,
      status: 'completed',
      notes: 'All documents verified successfully.',
      timeline: [
        { date: daysAgo(7), event: 'Task created', detail: 'Standard verification.' },
        { date: daysAgo(5), event: 'Completed', detail: 'Approved for final decision.' },
      ],
      createdAt: daysAgo(7),
    },
  ]);

  const aiLogTemplates = [
    { app: 0, type: 'analysis', title: 'AI Risk Analysis', detail: 'Moderate risk profile; missing address proof flagged.', severity: 'warning' },
    { app: 1, type: 'analysis', title: 'AI Suspicious Entry', detail: 'Loan amount high relative to declared income.', severity: 'critical' },
    { app: 2, type: 'approval', title: 'AI Recommended Approval', detail: 'High credit viability with full documentation.', severity: 'info' },
    { app: 3, type: 'task', title: 'Verification Officer Assigned', detail: 'Officer Rahul Mehra assigned for field verification.', severity: 'info' },
    { app: 4, type: 'workflow', title: 'Queued for Final Approval', detail: 'All verification checks passed; awaiting manager sign-off.', severity: 'info' },
    { app: 5, type: 'alert', title: 'Fraud Pattern Detected', detail: 'Mismatch between declared income and bank statement.', severity: 'critical' },
    { app: 6, type: 'approval', title: 'Auto-Approval Signal', detail: 'Risk score 82 — recommend expedited approval.', severity: 'info' },
    { app: 7, type: 'analysis', title: 'Application Rejected', detail: 'Insufficient documentation for income verification.', severity: 'warning' },
    { app: 8, type: 'analysis', title: 'Enhanced Due Diligence', detail: 'Large loan request triggered additional checks.', severity: 'warning' },
    { app: 0, type: 'workflow', title: 'Document Upload Received', detail: 'Borrower uploaded bank statement for review.', severity: 'info' },
    { app: 1, type: 'task', title: 'Manual Review Triggered', detail: 'AI confidence below threshold for auto-decision.', severity: 'warning' },
    { app: 2, type: 'workflow', title: 'Final Decision Recorded', detail: 'Loan approved with standard terms.', severity: 'info' },
    { app: 4, type: 'analysis', title: 'Income Verification Complete', detail: 'Employer letter matches declared annual income.', severity: 'info' },
    { app: 5, type: 'task', title: 'Task Escalated', detail: 'Escalated to Neha Singh for manager review.', severity: 'critical' },
    { app: 8, type: 'alert', title: 'Collateral Check Required', detail: 'Loan exceeds automated approval limit.', severity: 'warning' },
    { app: 3, type: 'analysis', title: 'Address Proof Pending', detail: 'Reminder sent to borrower for missing document.', severity: 'info' },
    { app: 6, type: 'workflow', title: 'Verification Completed', detail: 'All officer checks completed successfully.', severity: 'info' },
    { app: 9, type: 'analysis', title: 'Initial Screening', detail: 'Application received; AI pre-screen in progress.', severity: 'info' },
    { app: 2, type: 'alert', title: 'Compliance Check Passed', detail: 'KYC and AML screening completed with no flags.', severity: 'info' },
    { app: 4, type: 'approval', title: 'Pre-Approval Generated', detail: 'AI generated pre-approval letter for manager review.', severity: 'info' },
  ];

  await AiActivityLog.insertMany(
    aiLogTemplates.map((log, index) => ({
      applicationId: applications[log.app]._id,
      type: log.type,
      title: log.title,
      detail: log.detail,
      severity: log.severity,
      timestamp: daysAgo(index % 10),
    }))
  );

  return {
    seeded: true,
    message: `Seed complete. Demo login: admin@finova.ai / ${DEMO_PASSWORD}`,
    counts: {
      users: users.length,
      applications: applications.length,
      tasks: 6,
      aiLogs: aiLogTemplates.length,
    },
  };
};

export const ensureSeeded = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const result = await runSeed({ force: false });
      console.log(result.message);
      return;
    }

    const password = await bcrypt.hash(DEMO_PASSWORD, 10);
    await User.updateOne({ email: 'admin@finova.ai' }, { $set: { password } }, { upsert: false });

    const appCount = await LoanApplication.countDocuments();
    if (appCount < 5) {
      const result = await runSeed({ force: true });
      console.log('Supplemented sparse database:', result.message);
    }
  } catch (error) {
    console.warn('Auto-seed skipped:', error.message);
  }
};
