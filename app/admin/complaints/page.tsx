"use client";

import { teamMembers } from "@/app/data/teamData";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  FileText,
  LogOut,
  RefreshCw,
  Trash2,
  User,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface Complaint {
  _id: string;
  againstPersonId: string;
  againstPersonName: string;
  complaint: string;
  submittedAt: string;
  isRead: boolean;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function AdminComplaintsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null
  );
  const [filters, setFilters] = useState({
    againstPersonId: "",
    isRead: "",
    search: "",
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/admin/login");
      return;
    }
  }, [session, status, router]);

  const fetchComplaints = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "10",
        });

        if (filters.againstPersonId) {
          params.append("againstPersonId", filters.againstPersonId);
        }
        if (filters.isRead) {
          params.append("isRead", filters.isRead);
        }

        const response = await fetch(`/api/complaints?${params}`);

        if (response.ok) {
          const data = await response.json();
          setComplaints(data.complaints);
          setPagination(data.pagination);
        }
      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        setLoading(false);
      }
    },
    [filters.againstPersonId, filters.isRead]
  );

  useEffect(() => {
    if (session) {
      fetchComplaints();
    }
  }, [session, filters.againstPersonId, filters.isRead, fetchComplaints]);

  const markAsRead = async (complaintId: string, isRead: boolean) => {
    try {
      const response = await fetch(`/api/complaints/${complaintId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead }),
      });

      if (response.ok) {
        // Update the complaint in the list
        setComplaints(
          complaints.map((c) => (c._id === complaintId ? { ...c, isRead } : c))
        );

        if (selectedComplaint && selectedComplaint._id === complaintId) {
          setSelectedComplaint({ ...selectedComplaint, isRead });
        }
      }
    } catch (error) {
      console.error("Error updating complaint:", error);
    }
  };

  const deleteComplaint = async (complaintId: string) => {
    if (
      !confirm(
        "আপনি কি নিশ্চিত যে এই অভিযোগটি মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফিরিয়ে নেওয়া যাবে না।"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/complaints/${complaintId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove from list and close modal if it was selected
        setComplaints(complaints.filter((c) => c._id !== complaintId));
        if (selectedComplaint && selectedComplaint._id === complaintId) {
          setSelectedComplaint(null);
        }
      } else {
        const data = await response.json();
        alert(data.error || "অভিযোগ মুছতে ব্যর্থ হয়েছে");
      }
    } catch (error) {
      console.error("Error deleting complaint:", error);
      alert("অভিযোগ মুছতে ব্যর্থ হয়েছে");
    }
  };

  const getPersonInfo = (personId: string) => {
    return teamMembers.find((member) => member.id === personId);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="relative bg-gradient-to-b from-yellow-200 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div className="flex items-center">
              <div className="bg-[var(--primary-yellow)] p-2 rounded-lg mr-3">
                <FileText className="h-6 w-6 text-gray-900" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  অভিযোগ ব্যবস্থাপনা
                </h1>
                <p className="text-sm text-gray-700">
                  স্বাগতম, {session.user.username}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => fetchComplaints(pagination?.page || 1)}
                className="inline-flex items-center px-4 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                রিফ্রেশ
              </button>
              <button
                onClick={() => signOut()}
                className="inline-flex items-center px-4 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                লগআউট
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ব্যক্তি অনুযায়ী ফিল্টার
              </label>
              <select
                value={filters.againstPersonId}
                onChange={(e) =>
                  setFilters({ ...filters, againstPersonId: e.target.value })
                }
                className="block w-full border border-gray-300 rounded-md focus:ring-[var(--primary-yellow)] focus:border-[var(--primary-yellow)] px-3 py-1"
              >
                <option value="">সব টিম মেম্বার</option>
                {teamMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} - {member.designation}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-32">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                পড়া/অপঠিত অবস্থা
              </label>
              <select
                value={filters.isRead}
                onChange={(e) =>
                  setFilters({ ...filters, isRead: e.target.value })
                }
                className="block w-full border border-gray-300 rounded-md focus:ring-[var(--primary-yellow)] focus:border-[var(--primary-yellow)] px-3 py-1"
              >
                <option value="">সব</option>
                <option value="false">অপঠিত</option>
                <option value="true">পঠিত</option>
              </select>
            </div>
          </div>
        </div>

        {/* Complaints List */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              অভিযোগসমূহ {pagination && `(${pagination.total})`}
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">অভিযোগ লোড হচ্ছে...</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">কোনো অভিযোগ পাওয়া যায়নি</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {complaints.map((complaint) => {
                const personInfo = getPersonInfo(complaint.againstPersonId);
                return (
                  <div
                    key={complaint._id}
                    className="p-6 hover:bg-yellow-50/40"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {/* Team member photo */}
                          {personInfo?.photo && (
                            <Image
                              src={personInfo.photo}
                              alt={personInfo.name}
                              width={32}
                              height={32}
                              className="h-8 w-8 rounded-full object-cover border border-gray-300 mr-2"
                            />
                          )}
                          <h3 className="text-lg font-medium text-gray-900">
                            {complaint.againstPersonName} সম্পর্কে মতামত/অভিযোগঃ
                          </h3>
                          {!complaint.isRead && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                              অপঠিত
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {personInfo?.designation} - {personInfo?.department}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(
                              complaint.submittedAt
                            ).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="text-gray-700 mb-4 whitespace-pre-wrap">
                          {(complaint.complaint.replace(/<[^>]*>/g, "").length >
                          200
                            ? complaint.complaint
                                .replace(/<[^>]*>/g, "")
                                .substring(0, 200) + "..."
                            : complaint.complaint.replace(/<[^>]*>/g, "")) ||
                            "কোনো অভিযোগের বিবরণ নেই"}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => setSelectedComplaint(complaint)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          দেখুন
                        </button>

                        <button
                          onClick={() =>
                            markAsRead(complaint._id, !complaint.isRead)
                          }
                          className={`inline-flex items-center px-3 py-1.5 border text-xs font-semibold rounded-md ${
                            complaint.isRead
                              ? "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                              : "border-transparent text-gray-900 bg-[var(--primary-yellow)] hover:bg-[var(--secondary-yellow)]"
                          }`}
                        >
                          {complaint.isRead ? (
                            <>
                              <EyeOff className="h-4 w-4 mr-1" />
                              অপঠিত করুন
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-1" />
                              পঠিত করুন
                            </>
                          )}
                        </button>

                        {session.user.role === "super-admin" && (
                          <button
                            onClick={() => deleteComplaint(complaint._id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-semibold rounded-md text-white bg-red-600 hover:bg-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            মুছে ফেলুন
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => fetchComplaints(pagination.page - 1)}
                  disabled={!pagination.hasPrev}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  পূর্ববর্তী
                </button>
                <button
                  onClick={() => fetchComplaints(pagination.page + 1)}
                  disabled={!pagination.hasNext}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  পরবর্তী
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    দেখানো হচ্ছে{" "}
                    <span className="font-medium">
                      {(pagination.page - 1) * pagination.limit + 1}
                    </span>{" "}
                    থেকে{" "}
                    <span className="font-medium">
                      {Math.min(
                        pagination.page * pagination.limit,
                        pagination.total
                      )}
                    </span>{" "}
                    মোট <span className="font-medium">{pagination.total}</span>{" "}
                    ফলাফল
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md -space-x-px">
                    <button
                      onClick={() => fetchComplaints(pagination.page - 1)}
                      disabled={!pagination.hasPrev}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      পৃষ্ঠা {pagination.page} মোট {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => fetchComplaints(pagination.page + 1)}
                      disabled={!pagination.hasNext}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity z-40"
              aria-hidden="true"
              onClick={() => setSelectedComplaint(null)}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            {/* Modal Content */}
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-gray-200 relative z-50 shadow-xl">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    অভিযোগের বিস্তারিত
                  </h3>
                  <button
                    onClick={() => setSelectedComplaint(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>

                {/* Team member info */}
                {(() => {
                  const personInfo = getPersonInfo(
                    selectedComplaint.againstPersonId
                  );
                  return (
                    <div className="flex items-center gap-4 mb-6">
                      {personInfo?.photo && (
                        <Image
                          src={personInfo.photo}
                          alt={personInfo.name}
                          width={48}
                          height={48}
                          className="rounded-full border border-gray-300 object-cover"
                        />
                      )}
                      <div>
                        <div className="text-lg font-semibold text-gray-900">
                          {selectedComplaint.againstPersonName}
                        </div>
                        <div className="text-sm text-gray-600">
                          {personInfo?.designation} - {personInfo?.department}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      জমাদানের তারিখ
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(
                        selectedComplaint.submittedAt
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      অবস্থা
                    </label>
                    <p className="mt-1 text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedComplaint.isRead
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedComplaint.isRead ? "পঠিত" : "অপঠিত"}
                      </span>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      অভিযোগ
                    </label>
                    <div className="p-4 border border-gray-200 rounded-lg bg-yellow-50 text-base text-gray-900 min-h-24 whitespace-pre-wrap">
                      {selectedComplaint.complaint.replace(/<[^>]*>/g, "") ||
                        "কোনো অভিযোগের বিবরণ নেই"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-xl">
                <button
                  onClick={() =>
                    markAsRead(selectedComplaint._id, !selectedComplaint.isRead)
                  }
                  className={`w-full inline-flex justify-center rounded-md border px-4 py-2 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                    selectedComplaint.isRead
                      ? "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-[var(--primary-yellow)]"
                      : "border-transparent text-gray-900 bg-[var(--primary-yellow)] hover:bg-[var(--secondary-yellow)] focus:ring-[var(--primary-yellow)]"
                  }`}
                >
                  {selectedComplaint.isRead ? "অপঠিত করুন" : "পঠিত করুন"}
                </button>

                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-yellow)] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
