import mongoose from 'mongoose';

const AiActivityLogSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'LoanApplication' },
  timestamp: { type: Date, default: Date.now },
  type: { type: String, required: true },
  title: { type: String, required: true },
  detail: { type: String, default: '' },
  severity: { type: String, enum: ['info', 'warning', 'critical'], default: 'info' },
});

AiActivityLogSchema.index({ timestamp: -1 });
AiActivityLogSchema.index({ applicationId: 1 });

export default mongoose.model('AiActivityLog', AiActivityLogSchema);
