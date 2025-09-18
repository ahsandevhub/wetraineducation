import mongoose, { Document, Schema } from "mongoose";

export interface IComplaint extends Document {
  againstPersonId?: string;
  againstPersonName?: string;
  complaint: string;
  submittedAt: Date;
  isRead: boolean;
  ipAddress?: string;
}

const ComplaintSchema = new Schema<IComplaint>({
  againstPersonId: {
    type: String,
    required: false,
  },
  againstPersonName: {
    type: String,
    required: false,
  },
  complaint: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 5000,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  ipAddress: {
    type: String,
    required: false,
  },
});

// Add indexes for better query performance
ComplaintSchema.index({ submittedAt: -1 });
ComplaintSchema.index({ againstPersonId: 1 });
ComplaintSchema.index({ isRead: 1 });

export default mongoose.models.Complaint ||
  mongoose.model<IComplaint>("Complaint", ComplaintSchema);
