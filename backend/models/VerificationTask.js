import mongoose from 'mongoose';

const VerificationTaskSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'LoanApplication', required: true },
  officer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'in_progress', 'completed', 'escalated'], default: 'pending' },
  notes: { type: String, default: '' },
  timeline: [{ date: Date, event: String, detail: String }],
  createdAt: { type: Date, default: Date.now },
});

VerificationTaskSchema.index({ status: 1, createdAt: -1 });
VerificationTaskSchema.index({ applicationId: 1 });

export default mongoose.model('VerificationTask', VerificationTaskSchema);
