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
  const [totalApplications, approvedLoans, pendingVerification, riskAlerts, fraudAlerts, aiActivityCount, monthlyApplications, riskBuckets, workflowDistribution, aiLogs] =
    await Promise.all([
      LoanApplication.countDocuments(),
      LoanApplication.countDocuments({ status: 'approved' }),
      LoanApplication.countDocuments({ status: { $in: ['assigned', 'analysis', 'queued', 'identity_verification', 'ai_risk_analysis', 'fraud_detection', 'compliance_review', 'under_review'] } }),
      LoanApplication.countDocuments({ riskScore: { $gte: 70 } }),
      LoanApplication.countDocuments({ fraudProbability: { $gte: 60 } }),
      AiActivityLog.countDocuments(),
      LoanApplication.aggregate([
        { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 12 },
      ]),
      LoanApplication.aggregate(riskAggregation),
      LoanApplication.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      AiActivityLog.find().sort({ timestamp: -1 }).limit(12).lean(),
    ]);

  res.json({
    totalApplications,
    approvedLoans,
    pendingVerification,
    riskAlerts,
    fraudAlerts,
    aiActivityCount,
    monthlyApplications,
    riskDistribution: mapRiskDistribution(riskBuckets),
    workflowDistribution,
    aiLogs,
  });
};

export const getApprovalAnalytics = async (req, res) => {
  const [approvalRates, monthlyApplications, riskBuckets, tasks, fraudSegments] = await Promise.all([
    LoanApplication.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    LoanApplication.aggregate([
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),
    LoanApplication.aggregate(riskAggregation),
    VerificationTask.find().select('status').lean(),
    LoanApplication.aggregate([
      { $bucket: { groupBy: '$fraudProbability', boundaries: [0, 30, 50, 70, 101], default: 'Unknown', output: { count: { $sum: 1 } } } },
    ]),
  ]);

  res.json({
    approvalRates,
    monthlyApplications,
    riskDistribution: mapRiskDistribution(riskBuckets),
    verificationRates: buildVerificationRates(tasks),
    fraudSegments: fraudSegments.map((item) => ({ _id: item._id === 0 ? 'Low' : item._id === 30 ? 'Moderate' : item._id === 50 ? 'High' : 'Critical', count: item.count })),
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
