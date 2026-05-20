import LoanApplication from '../models/LoanApplication.js';
import VerificationTask from '../models/VerificationTask.js';
import AiActivityLog from '../models/AiActivityLog.js';
import Notification from '../models/Notification.js';
import { mapWorkflowHistory } from '../utils/formatters.js';

export const getWorkflowHistory = async (req, res) => {
  const history = await LoanApplication.find()
    .select('customerName status workflow riskScore suggestedDecision createdAt')
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();
  res.json(mapWorkflowHistory(history));
};

export const getTasks = async (req, res) => {
  const tasks = await VerificationTask.find()
    .populate('applicationId', 'customerName loanAmount status riskScore')
    .populate('officer', 'name email role')
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();
  res.json(tasks);
};

export const updateTaskStatus = async (req, res) => {
  const { status, note } = req.body;
  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  const task = await VerificationTask.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  task.status = status;
  task.timeline.push({
    date: new Date(),
    event: `Status updated to ${status}`,
    detail: note || 'Officer updated the task.',
  });
  await task.save();

  const application = await LoanApplication.findById(task.applicationId);
  if (application) {
    if (status === 'completed') {
      application.status = 'under_review';
      application.workflow.push({ step: 'Verification completed', date: new Date(), actor: req.user.name || 'Verification Team' });
      await Notification.create({
        applicationId: application._id,
        type: 'workflow',
        title: 'Verification completed',
        detail: `Application ${application.referenceId || application._id} is now under review.`,
        severity: 'info',
      });
    } else if (status === 'escalated') {
      application.status = 'escalated';
      application.workflow.push({ step: 'Escalated for review', date: new Date(), actor: req.user.name || 'Verification Team' });
      await Notification.create({
        applicationId: application._id,
        type: 'escalation',
        title: 'Application escalated',
        detail: `Application ${application.referenceId || application._id} requires senior review.`,
        severity: 'warning',
      });
    } else if (status === 'in_progress') {
      application.status = 'identity_verification';
      application.workflow.push({ step: 'Verification in progress', date: new Date(), actor: req.user.name || 'Verification Team' });
    }
    await application.save();
  }

  await AiActivityLog.create({
    applicationId: task.applicationId,
    type: 'workflow',
    title: 'Verification Task Updated',
    detail: `Task marked ${status} by ${req.user?.name || 'officer'}.`,
    severity: status === 'escalated' ? 'warning' : 'info',
  });

  const updated = await VerificationTask.findById(task._id)
    .populate('applicationId', 'customerName')
    .populate('officer', 'name')
    .lean();

  res.json(updated);
};
