import mongoose, { Document, Schema } from "mongoose";

export interface IAdmin extends Document {
  username: string;
  password: string;
  email: string;
  role: "admin" | "super-admin";
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

const AdminSchema = new Schema<IAdmin>({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ["admin", "super-admin"],
    default: "admin",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
  },
});

// Add indexes with unique constraints
AdminSchema.index({ username: 1 }, { unique: true });
AdminSchema.index({ email: 1 }, { unique: true });
AdminSchema.index({ isActive: 1 });

export default mongoose.models.Admin ||
  mongoose.model<IAdmin>("Admin", AdminSchema);
