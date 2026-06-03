import mongoose from 'mongoose';

const adminCredentialSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    resetTokenHash: { type: String },
    resetTokenExpiresAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.AdminCredential || mongoose.model('AdminCredential', adminCredentialSchema);
