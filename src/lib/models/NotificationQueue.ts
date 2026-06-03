import mongoose from 'mongoose';

const notificationQueueSchema = new mongoose.Schema(
  {
    notificationType: { type: String, required: true },
    to: { type: String, required: true },
    subject: { type: String, required: true },
    html: { type: String, required: true },
    attempts: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 3 },
    nextAttemptAt: { type: Date, default: () => new Date() },
    lastError: { type: String },
    status: { type: String, enum: ['queued', 'processing', 'sent', 'failed'], default: 'queued' },
    sentAt: { type: Date },
  },
  { timestamps: true }
);

notificationQueueSchema.index({ status: 1, nextAttemptAt: 1 });

export type NotificationQueueStatus = 'queued' | 'processing' | 'sent' | 'failed';

export default mongoose.models.NotificationQueue || mongoose.model('NotificationQueue', notificationQueueSchema);
