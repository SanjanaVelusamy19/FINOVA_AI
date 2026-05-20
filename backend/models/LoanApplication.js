import mongoose from 'mongoose';

const LoanApplicationSchema = new mongoose.Schema({
  referenceId: { type: String, unique: true, index: true },
  customerName: { type: String, required: true },
  panNumber: { type: String, required: true },
  aadhaarNumber: { type: String, required: true },
  income: { type: Number, required: true },
  loanAmount: { type: Number, required: true },
  documents: [{ type: String }],
  status: {
    type: String,
    enum: ['submitted', 'identity_verification', 'ai_risk_analysis', 'fraud_detection', 'compliance_review', 'under_review', 'assigned', 'queued', 'approved', 'rejected', 'escalated'],
    default: 'submitted',
  },
  riskScore: { type: Number, default: 0 },
  fraudProbability: { type: Number, default: 0 },
  approvalProbability: { type: Number, default: 0 },
  repaymentConfidence: { type: Number, default: 0 },
  workflowPriority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  suggestedDecision: { type: String, enum: ['approve', 'reject', 'review'], default: 'review' },
  riskSummary: { type: String, default: '' },
  missingDocuments: [{ type: String }],
  workflow: [{ type: Object }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedOfficer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

LoanApplicationSchema.index({ createdAt: -1 });
LoanApplicationSchema.index({ status: 1 });
LoanApplicationSchema.index({ riskScore: -1 });

export default mongoose.model('LoanApplication', LoanApplicationSchema);
