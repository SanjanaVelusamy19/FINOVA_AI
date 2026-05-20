import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'officer', 'manager'], default: 'manager' },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.index({ email: 1 });

export default mongoose.model('User', UserSchema);
