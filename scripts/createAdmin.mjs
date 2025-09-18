import bcrypt from "bcryptjs";
import "dotenv/config";
import mongoose from "mongoose";
import fs from "node:fs";
import path from "node:path";

// Ensure .env.local is loaded when running outside Next runtime
// dotenv/config auto-loads .env, but Next projects often use .env.local as well
const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  // Re-parse .env.local on top to ensure values are picked up
  const { config } = await import("dotenv");
  config({ path: envLocalPath, override: true });
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI in .env.local");
  process.exit(1);
}

// Inline Admin schema to avoid TS/alias issues when running via Node
const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  role: { type: String, enum: ["admin", "super-admin"], default: "admin" },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
});

AdminSchema.index({ username: 1 }, { unique: true });
AdminSchema.index({ email: 1 }, { unique: true });

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

async function createAdmin() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const role = "super-admin";

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const existing = await Admin.findOne({ username });
    if (existing) {
      console.log(`Admin user "${username}" already exists.`);
      return;
    }

    const hashed = await bcrypt.hash(password, 12);
    await Admin.create({ username, password: hashed, email, role });
    console.log("Admin user created successfully");
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log(`Role: ${role}`);
  } catch (err) {
    console.error("Error creating admin:", err);
  } finally {
    await mongoose.disconnect();
  }
}

await createAdmin();
