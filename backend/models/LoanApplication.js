import mongoose from 'mongoose';

const LoanApplicationSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  panNumber: { type: String, required: true },
  aadhaarNumber: { type: String, required: true },
  income: { type: Number, required: true },
  loanAmount: { type: Number, required: true },
  documents: [{ type: String }],
  status: {
    type: String,
    enum: ['submitted', 'verified', 'analysis', 'assigned', 'queued', 'approved', 'rejected'],
    default: 'submitted',
  },
  riskScore: { type: Number, default: 0 },
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
