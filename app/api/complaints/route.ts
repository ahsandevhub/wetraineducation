import { teamMembers } from "@/app/data/teamData";
import connectDB from "@/app/lib/mongodb";
import Complaint from "@/app/models/Complaint";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// Rate limiting helper (simple in-memory store)
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 3; // Max 3 complaints per 15 minutes per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userRequests = rateLimit.get(ip) || [];

  // Remove old requests outside the window
  const validRequests = userRequests.filter(
    (timestamp: number) => now - timestamp < RATE_LIMIT_WINDOW
  );

  if (validRequests.length >= MAX_REQUESTS) {
    return false;
  }

  validRequests.push(now);
  rateLimit.set(ip, validRequests);
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Enforce access token to prevent external abuse without QR/link
    const required = process.env.COMPLAINT_ACCESS_TOKEN;
    const cookieToken = request.cookies.get("complaint_access")?.value;
    const headerToken = request.headers.get("x-complaint-access");
    if (required && !(cookieToken === required || headerToken === required)) {
      return NextResponse.json(
        { error: "Forbidden. Valid access token required." },
        { status: 403 }
      );
    }

    // Get IP address for rate limiting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0]
      : request.headers.get("x-real-ip") || "unknown";

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          error:
            "Too many complaints submitted. Please wait 15 minutes before submitting again.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { againstPersonId, complaint } = body;

    // Validate input
    if (!againstPersonId || !complaint) {
      return NextResponse.json(
        { error: "Against person and complaint are required" },
        { status: 400 }
      );
    }

    if (complaint.length < 10 || complaint.length > 5000) {
      return NextResponse.json(
        { error: "Complaint must be between 10 and 5000 characters" },
        { status: 400 }
      );
    }

    // Validate against person exists
    const againstPerson = teamMembers.find(
      (member) => member.id === againstPersonId
    );
    if (!againstPerson) {
      return NextResponse.json(
        { error: "Invalid team member selected" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Create complaint
    const newComplaint = new Complaint({
      againstPersonId,
      againstPersonName: againstPerson.name,
      complaint: complaint.trim(),
      ipAddress: ip !== "unknown" ? ip : undefined,
    });

    await newComplaint.save();

    return NextResponse.json(
      { message: "Complaint submitted successfully", id: newComplaint._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting complaint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication for admin access
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const againstPersonId = searchParams.get("againstPersonId");
    const isRead = searchParams.get("isRead");

    // Build filter query
    const filter: Record<string, unknown> = {};
    if (againstPersonId) {
      filter.againstPersonId = againstPersonId;
    }
    if (isRead !== null && isRead !== undefined) {
      filter.isRead = isRead === "true";
    }

    const skip = (page - 1) * limit;

    // Get complaints with pagination
    const complaints = await Complaint.find(filter)
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-ipAddress"); // Don't expose IP addresses

    const total = await Complaint.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      complaints,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
