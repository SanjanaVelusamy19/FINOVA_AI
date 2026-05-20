import LoanApplication from '../models/LoanApplication.js';
import AiActivityLog from '../models/AiActivityLog.js';
import VerificationTask from '../models/VerificationTask.js';
import { mapRiskDistribution, buildVerificationRates } from '../utils/formatters.js';

const riskAggregation = [
  {
    $bucket: {
      groupBy: '$riskScore',
      boundaries: [0, 30, 50, 70, 90, 101],
      default: 'Unknown',
      output: { count: { $sum: 1 } },
    },
  },
];

export const getDashboardMetrics = async (req, res) => {
  const [totalApplications, approvedLoans, pendingVerification, riskAlerts, monthlyApplications, riskBuckets, aiLogs] =
    await Promise.all([
      LoanApplication.countDocuments(),
      LoanApplication.countDocuments({ status: 'approved' }),
      LoanApplication.countDocuments({ status: { $in: ['assigned', 'analysis', 'queued'] } }),
      LoanApplication.countDocuments({ riskScore: { $gte: 70 } }),
      LoanApplication.aggregate([
        { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 12 },
      ]),
      LoanApplication.aggregate(riskAggregation),
      AiActivityLog.find().sort({ timestamp: -1 }).limit(12).lean(),
    ]);

  res.json({
    totalApplications,
    approvedLoans,
    pendingVerification,
    riskAlerts,
    monthlyApplications,
    riskDistribution: mapRiskDistribution(riskBuckets),
    aiLogs,
  });
};

export const getApprovalAnalytics = async (req, res) => {
  const [approvalRates, monthlyApplications, riskBuckets, tasks] = await Promise.all([
    LoanApplication.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    LoanApplication.aggregate([
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),
    LoanApplication.aggregate(riskAggregation),
    VerificationTask.find().select('status').lean(),
  ]);

  res.json({
    approvalRates,
    monthlyApplications,
    riskDistribution: mapRiskDistribution(riskBuckets),
    verificationRates: buildVerificationRates(tasks),
    aiConfidence: [
      { name: 'High', value: 55 },
      { name: 'Medium', value: 31 },
      { name: 'Low', value: 14 },
    ],
  });
};

export const getAiLogs = async (req, res) => {
  const logs = await AiActivityLog.find().sort({ timestamp: -1 }).limit(50).lean();
  res.json(logs);
};
