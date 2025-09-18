import "dotenv/config";
import fs from "node:fs";
import path from "node:path";

// Re-load .env.local if present (Next uses .env.local frequently)
const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  const { config } = await import("dotenv");
  config({ path: envLocalPath, override: true });
}

const NEXTAUTH_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";
const TOKEN = process.env.COMPLAINT_ACCESS_TOKEN;
if (!TOKEN) {
  console.error("Missing COMPLAINT_ACCESS_TOKEN in .env.local");
  process.exit(1);
}

const complaintUrl = `${NEXTAUTH_URL.replace(
  /\/$/,
  ""
)}/complaint?t=${encodeURIComponent(TOKEN)}`;

const outDir = path.resolve(process.cwd(), "public");
const outPath = path.join(outDir, "complaint-qr.png");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const { toFile } = await import("qrcode");

await toFile(outPath, complaintUrl, {
  type: "png",
  errorCorrectionLevel: "H",
  margin: 2,
  scale: 8,
  color: { dark: "#000000", light: "#ffffff" },
});

console.log("QR code generated: ", outPath);
console.log("Protected complaint URL: ", complaintUrl);
