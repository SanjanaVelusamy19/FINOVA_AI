import LoanApplication from '../models/LoanApplication.js';
import VerificationTask from '../models/VerificationTask.js';
import AiActivityLog from '../models/AiActivityLog.js';
import { analyzeLoanApplication } from '../services/geminiService.js';

export const createApplication = async (req, res) => {
  const { customerName, panNumber, aadhaarNumber, income, loanAmount, documents } = req.body;
  if (!customerName || !panNumber || !aadhaarNumber || !income || !loanAmount) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const application = await LoanApplication.create({
    customerName,
    panNumber,
    aadhaarNumber,
    income,
    loanAmount,
    documents,
    createdBy: req.user.id,
    workflow: [{ step: 'Application Submitted', date: new Date(), actor: req.user.name }],
  });

  const aiAnalysis = await analyzeLoanApplication(application.toObject());
  application.riskScore = aiAnalysis.riskScore;
  application.suggestedDecision = aiAnalysis.suggestedDecision;
  application.riskSummary = aiAnalysis.riskSummary;
  application.missingDocuments = aiAnalysis.missingDocuments;
  application.workflow.push({ step: 'Risk Analysis', date: new Date(), actor: 'FINOVA AI' });
  await application.save();

  await AiActivityLog.create({
    applicationId: application._id,
    type: 'analysis',
    title: 'AI Risk Assessment Completed',
    detail: aiAnalysis.riskSummary,
    severity: aiAnalysis.riskScore > 70 ? 'warning' : 'info',
  });

  res.status(201).json(application);
};

export const getApplications = async (req, res) => {
  const applications = await LoanApplication.find().sort({ createdAt: -1 }).limit(200).lean();
  res.json(applications);
};

export const getApplicationById = async (req, res) => {
  const application = await LoanApplication.findById(req.params.id).lean();
  if (!application) return res.status(404).json({ message: 'Application not found' });
  const logs = await AiActivityLog.find({ applicationId: application._id }).sort({ timestamp: -1 }).lean();
  res.json({ ...application, logs });
};

export const assignOfficer = async (req, res) => {
  const { officerId, notes } = req.body;
  const application = await LoanApplication.findById(req.params.id);
  if (!application) return res.status(404).json({ message: 'Application not found' });

  application.assignedOfficer = officerId;
  application.status = 'assigned';
  application.workflow.push({ step: 'Field Verification Assigned', date: new Date(), actor: req.user.name });
  await application.save();

  await VerificationTask.create({
    applicationId: application._id,
    officer: officerId,
    notes,
    timeline: [{ date: new Date(), event: 'Assigned verification officer', detail: notes || 'Auto-assigned by FINOVA' }],
  });

  await AiActivityLog.create({
    applicationId: application._id,
    type: 'task',
    title: 'Verification Officer Assigned',
    detail: `Officer assigned to review the application.`,
    severity: 'info',
  });

  res.json(application);
};
