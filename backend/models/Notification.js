import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'LoanApplication' },
  type: {
    type: String,
    enum: ['application', 'fraud', 'workflow', 'ai', 'escalation'],
    required: true,
  },
  title: { type: String, required: true },
  detail: { type: String, default: '' },
  severity: { type: String, enum: ['info', 'warning', 'critical'], default: 'info' },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

NotificationSchema.index({ read: 1, createdAt: -1 });
NotificationSchema.index({ applicationId: 1 });

export default mongoose.model('Notification', NotificationSchema);
