import LoanApplication from '../models/LoanApplication.js';
import VerificationTask from '../models/VerificationTask.js';
import AiActivityLog from '../models/AiActivityLog.js';
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
      application.status = 'queued';
      application.workflow.push({ step: 'Approval Queue', date: new Date(), actor: 'Verification Team' });
    } else if (status === 'escalated') {
      application.status = 'analysis';
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
