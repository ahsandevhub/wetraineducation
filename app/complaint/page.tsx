"use client";

import TextFormatter from "@/app/components/TextFormatter";
import { teamMembers } from "@/app/data/teamData";
import { AlertCircle, Lock, Send, Shield } from "lucide-react";
import { useState } from "react";

export default function ComplaintPage() {
  const [selectedPerson, setSelectedPerson] = useState("");
  const [complaint, setComplaint] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPerson || !complaint.trim()) {
      setError(
        "অনুগ্রহ করে একটি বিকল্প নির্বাচন করুন এবং আপনার অভিযোগ/মতামত লিখুন।"
      );
      return;
    }

    // Strip HTML tags for length validation
    const plainTextComplaint = complaint.replace(/<[^>]*>/g, "").trim();
    if (plainTextComplaint.length < 10) {
      setError("অভিযোগ/মতামত কমপক্ষে ১০ অক্ষরের হতে হবে।");
      return;
    }

    if (plainTextComplaint.length > 5000) {
      setError("অভিযোগ/মতামত ৫০০০ অক্ষরের বেশি হওয়া যাবে না।");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          againstPersonId: selectedPerson === "none" ? null : selectedPerson,
          complaint: complaint,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setSelectedPerson("");
        setComplaint("");
      } else {
        setError(data.error || "অভিযোগ/মতামত জমা দিতে ব্যর্থ হয়েছে।");
      }
    } catch {
      setError("নেটওয়ার্ক ত্রুটি। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[var(--secondary-yellow)]/30">
                <Shield className="h-8 w-8 text-[var(--primary-yellow)]" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              অভিযোগ/মতামত সফলভাবে জমা হয়েছে
            </h2>
            <p className="text-gray-600 mb-8">
              আপনার অজ্ঞাত অভিযোগ/মতামতটি জমা হয়েছে এবং প্রশাসন এটি পর্যালোচনা
              করবে। আমাদের দৃষ্টি আকর্ষণ করার জন্য ধন্যবাদ।
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setError("");
              }}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-gray-900 bg-[var(--primary-yellow)] hover:bg-[var(--secondary-yellow)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-yellow)]"
            >
              আরেকটি অভিযোগ/মতামত জমা দিন
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero-style Header */}
      <section className="relative bg-gradient-to-b from-yellow-200 to-white py-10 sm:py-14 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex items-center justify-center mb-3">
            <div className="bg-[var(--primary-yellow)] p-2 rounded-lg mr-3">
              <Lock className="h-6 w-6 text-gray-900" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              অজ্ঞাতনামা অভিযোগ/মতামত বাক্স
            </h1>
          </div>
          <p className="text-gray-700">
            টিম মেম্বারদের সম্পর্কে অভিযোগ/মতামত জানানোর জন্য এটি একটি নিরাপদ
            এবং অজ্ঞাতনামা প্ল্যাটফর্ম। আপনার পরিচয় সম্পূর্ণ গোপন রাখা হবে।
          </p>
        </div>
      </section>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Privacy Notice */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-800">
                <strong>গোপনীয়তার নিশ্চয়তা:</strong> এই অভিযোগ/মতামত সম্পূর্ণ
                অজ্ঞাত। কোনো ব্যক্তিগত তথ্য সংগ্রহ করা হয় না। আপনার লেখার ধরন
                স্বাভাবিক করতে নিচের টেক্সট ফরম্যাটিং টুলগুলো ব্যবহার করে আপনার
                পরিচয় আরও সুরক্ষিত রাখুন।
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="sm:bg-white sm:border border-gray-200 sm:rounded-xl sm:p-8">
          <form onSubmit={handleSubmit}>
            {/* Against Person Selection */}
            <div className="mb-8">
              <label
                htmlFor="againstPerson"
                className="block text-sm font-medium text-gray-700 mb-3"
              >
                যাহার নিকট অভিযোগ/মতামত প্রদান করতে চান{" "}
                <span className="text-red-500">*</span>
              </label>
              <select
                id="againstPerson"
                value={selectedPerson}
                onChange={(e) => setSelectedPerson(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 sm:py-2 py-1 text-base border border-gray-300 focus:outline-none focus:ring-[var(--primary-yellow)] focus:border-[var(--primary-yellow)] sm:text-sm rounded-md"
                required
              >
                <option value="">একজন সিলেক্ট করুন...</option>
                <option value="none">
                  সাধারণ অভিযোগ/মতামত (কোনো নির্দিষ্ট ব্যক্তির বিরুদ্ধে নয়)
                </option>
                {/* Administration: Director, HR, BDE */}
                <optgroup label="Director">
                  {teamMembers
                    .filter(
                      (m) =>
                        m.department === "Administration" &&
                        m.designation.toLowerCase().includes("director")
                    )
                    .map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} - Director
                      </option>
                    ))}
                </optgroup>
                <optgroup label="HR">
                  {teamMembers
                    .filter(
                      (m) =>
                        m.department === "Administration" &&
                        m.designation.toLowerCase().includes("human resource")
                    )
                    .map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} - HR
                      </option>
                    ))}
                </optgroup>
                <optgroup label="BDE">
                  {teamMembers
                    .filter(
                      (m) =>
                        m.department === "Administration" &&
                        m.designation
                          .toLowerCase()
                          .includes("business development executive")
                    )
                    .map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} - BDE
                      </option>
                    ))}
                </optgroup>
                <optgroup label="IT">
                  {teamMembers
                    .filter((m) => m.department === "IT")
                    .map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} - {member.designation}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Customer Service">
                  {teamMembers
                    .filter((m) => m.department === "Customer Service")
                    .map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} - {member.designation}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Sales/Marketing">
                  {teamMembers
                    .filter((m) => m.department === "Marketing")
                    .map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} - {member.designation}
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>

            {/* Complaint Text */}
            <div className="mb-8">
              <label
                htmlFor="complaint"
                className="block text-sm font-medium text-gray-700 mb-3"
              >
                আপনার অভিযোগ/মতামত <span className="text-red-500">*</span>
              </label>
              <TextFormatter
                value={complaint}
                onChange={setComplaint}
                placeholder="আপনার অভিযোগ/মতামত বিস্তারিতভাবে লিখুন..."
              />
              <p className="mt-2 text-sm text-gray-500">
                ন্যূনতম ১০ অক্ষর, সর্বোচ্চ ৫০০০ অক্ষর। বর্তমান:{" "}
                {complaint.replace(/<[^>]*>/g, "").length} অক্ষর
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex items-center sm:justify-end justify-center">
              <button
                type="submit"
                disabled={isSubmitting || !selectedPerson || !complaint.trim()}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-gray-900 bg-[var(--primary-yellow)] hover:bg-[var(--secondary-yellow)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-yellow)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    জমা দেওয়া হচ্ছে...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    অভিযোগ/মতামত জমা দিন
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Notice */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            এই অভিযোগ/মতামত ব্যবস্থা শুধুমাত্র এইচআর এবং প্রশাসন দ্বারা
            পর্যবেক্ষিত হয়। সকল অভিযোগ/মতামত কঠোর গোপনীয়তায় রাখা হয় এবং
            যথাযথভাবে তদন্ত করা হবে।
          </p>
        </div>
      </div>
    </div>
  );
}
