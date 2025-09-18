"use client";

import { teamMembers } from "@/app/data/teamData";
import {
  AlertCircle,
  BarChart3,
  Building,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Download,
  Eye,
  EyeOff,
  FileText,
  Filter,
  LogOut,
  Mail,
  Phone,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  User,
  Users,
  X,
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
  priority?: string;
  category?: string;
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
    priority: "",
    category: "",
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
        if (filters.search) {
          params.append("search", filters.search);
        }
        if (filters.priority) {
          params.append("priority", filters.priority);
        }
        if (filters.category) {
          params.append("category", filters.category);
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
    [filters]
  );

  useEffect(() => {
    if (session) {
      fetchComplaints();
    }
  }, [session, fetchComplaints]);

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="bg-yellow-500 p-2 rounded-lg mr-3 shadow-sm">
                <ClipboardList className="h-6 w-6 text-gray-900" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  অভিযোগ ব্যবস্থাপনা
                </h1>
                <p className="text-sm text-gray-600 flex items-center">
                  <Shield className="h-4 w-4 mr-1" />
                  স্বাগতম, {session.user.username}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => fetchComplaints(pagination?.page || 1)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                রিফ্রেশ
              </button>
              <button
                onClick={() => signOut()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                লগআউট
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <section className="mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">মোট অভিযোগ</p>
                  <p className="text-xl font-bold text-gray-900">
                    {pagination?.total || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                  <EyeOff className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">অপঠিত</p>
                  <p className="text-xl font-bold text-gray-900">
                    {complaints.filter((c) => !c.isRead).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <Eye className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">পঠিত</p>
                  <p className="text-xl font-bold text-gray-900">
                    {complaints.filter((c) => c.isRead).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="bg-red-100 p-2 rounded-lg mr-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">উচ্চ প্রাধান্য</p>
                  <p className="text-xl font-bold text-gray-900">
                    {complaints.filter((c) => c.priority === "high").length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <Filter className="h-5 w-5 mr-2 text-yellow-500" />
              ফিল্টার
            </h2>
            <button
              onClick={() =>
                setFilters({
                  againstPersonId: "",
                  isRead: "",
                  search: "",
                  priority: "",
                  category: "",
                })
              }
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
            >
              <X className="h-4 w-4 mr-1" />
              ফিল্টার রিসেট
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Search className="h-4 w-4 mr-1" />
                অনুসন্ধান
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                placeholder="অভিযোগে অনুসন্ধান..."
                className="block w-full border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Users className="h-4 w-4 mr-1" />
                ব্যক্তি অনুযায়ী
              </label>
              <select
                value={filters.againstPersonId}
                onChange={(e) =>
                  setFilters({ ...filters, againstPersonId: e.target.value })
                }
                className="block w-full border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 px-3 py-2"
              >
                <option value="">সব টিম মেম্বার</option>
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

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                পড়া/অপঠিত অবস্থা
              </label>
              <select
                value={filters.isRead}
                onChange={(e) =>
                  setFilters({ ...filters, isRead: e.target.value })
                }
                className="block w-full border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 px-3 py-2"
              >
                <option value="">সব</option>
                <option value="false">অপঠিত</option>
                <option value="true">পঠিত</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                প্রাধান্য
              </label>
              <select
                value={filters.priority}
                onChange={(e) =>
                  setFilters({ ...filters, priority: e.target.value })
                }
                className="block w-full border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 px-3 py-2"
              >
                <option value="">সব</option>
                <option value="high">উচ্চ</option>
                <option value="medium">মধ্যম</option>
                <option value="low">নিম্ন</option>
              </select>
            </div>
          </div>
        </div>

        {/* Complaints List */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-yellow-500" />
              অভিযোগসমূহ{" "}
              {pagination && (
                <span className="text-gray-500 ml-1">({pagination.total})</span>
              )}
            </h2>

            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
                <BarChart3 className="h-4 w-4" />
              </button>
              <button className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
                <Download className="h-4 w-4" />
              </button>
            </div>
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
              <button
                onClick={() => fetchComplaints()}
                className="mt-4 text-yellow-600 hover:text-yellow-700 flex items-center justify-center mx-auto"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                আবার চেষ্টা করুন
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {complaints.map((complaint) => {
                const personInfo = getPersonInfo(complaint.againstPersonId);
                return (
                  <div
                    key={complaint._id}
                    className={`p-6 transition-colors ${
                      complaint.isRead ? "bg-white" : "bg-green-50/40"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center mb-3">
                          {/* Arrowed box for অভিযুক্ত and status */}
                          <div className="relative flex items-center justify-between">
                            <span
                              className="bg-orange-400 text-white font-semibold px-4 py-1 rounded-lg text-sm flex items-center"
                              style={{ position: "relative" }}
                            >
                              অভিযুক্তঃ
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 mb-3">
                          {/* Team member photo */}
                          {personInfo?.photo && (
                            <Image
                              src={personInfo.photo}
                              alt={personInfo.name}
                              width={40}
                              height={40}
                              className="h-12 w-12 rounded object-cover border-1 border-white shadow-sm"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 truncate leading-none">
                              {complaint.againstPersonName}
                            </h3>

                            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                              <span className="flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                {personInfo?.designation}
                              </span>
                              <span className="flex items-center">
                                <Building className="h-4 w-4 mr-1" />
                                {personInfo?.department}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(
                                  complaint.submittedAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="text-gray-700 whitespace-pre-wrap line-clamp-2">
                            <span className="font-bold">অভিযোগঃ </span>
                            {complaint.complaint.replace(/<[^>]*>/g, "") ||
                              "কোনো অভিযোগের বিবরণ নেই"}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {complaint.priority && (
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                                complaint.priority
                              )}`}
                            >
                              {complaint.priority === "high"
                                ? "উচ্চ প্রাধান্য"
                                : complaint.priority === "medium"
                                ? "মধ্যম প্রাধান্য"
                                : "নিম্ন প্রাধান্য"}
                            </span>
                          )}

                          {complaint.category && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {complaint.category}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => setSelectedComplaint(complaint)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-sm"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          বিস্তারিত
                        </button>

                        <button
                          onClick={() =>
                            markAsRead(complaint._id, !complaint.isRead)
                          }
                          className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-lg shadow-sm ${
                            complaint.isRead
                              ? "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                              : "border-transparent text-white bg-yellow-500 hover:bg-yellow-600"
                          }`}
                        >
                          {complaint.isRead ? (
                            <>
                              <EyeOff className="h-4 w-4 mr-1" />
                              অপঠিত
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-1" />
                              পঠিত
                            </>
                          )}
                        </button>

                        {session.user.role === "super-admin" && (
                          <button
                            onClick={() => deleteComplaint(complaint._id)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-500 hover:bg-red-600 shadow-sm"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            মুছুন
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
                    অভিযোগের মধ্যে
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => fetchComplaints(pagination.page - 1)}
                      disabled={!pagination.hasPrev}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      পৃষ্ঠা {pagination.page} / {pagination.totalPages}
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
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="bg-white px-6 pt-6 pb-4">
                <div className="flex items-start">
                  <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                    <ClipboardList className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      অভিযোগের বিস্তারিত
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      অভিযোগ আইডি: {selectedComplaint._id}
                    </p>
                  </div>
                </div>

                {/* Team member info */}
                {(() => {
                  const personInfo = getPersonInfo(
                    selectedComplaint.againstPersonId
                  );
                  return (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        {personInfo?.photo && (
                          <Image
                            src={personInfo.photo}
                            alt={personInfo.name}
                            width={56}
                            height={56}
                            className="rounded-full border-2 border-white shadow-sm object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <div className="text-lg font-semibold text-gray-900">
                            {selectedComplaint.againstPersonName}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {personInfo?.designation} - {personInfo?.department}
                          </div>

                          <div className="flex flex-wrap gap-3 mt-2">
                            {personInfo?.email && (
                              <div className="flex items-center text-sm text-gray-500">
                                <Mail className="h-4 w-4 mr-1" />
                                {personInfo.email}
                              </div>
                            )}

                            {personInfo?.phone && (
                              <div className="flex items-center text-sm text-gray-500">
                                <Phone className="h-4 w-4 mr-1" />
                                {personInfo.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      জমাদানের তারিখ
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {new Date(
                        selectedComplaint.submittedAt
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      অবস্থা
                    </label>
                    <p className="text-sm">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          selectedComplaint.isRead
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {selectedComplaint.isRead ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" /> পঠিত
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-4 w-4 mr-1" /> অপঠিত
                          </>
                        )}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    অভিযোগের বিবরণ
                  </label>
                  <div className="p-4 border border-gray-200 rounded-lg bg-yellow-50 text-gray-900 whitespace-pre-wrap">
                    {selectedComplaint.complaint.replace(/<[^>]*>/g, "") ||
                      "কোনো অভিযোগের বিবরণ নেই"}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 rounded-b-xl">
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="mt-3 w-full inline-flex justify-center items-center rounded-lg border border-gray-300 px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  বন্ধ করুন
                </button>

                {session.user.role === "super-admin" && (
                  <button
                    onClick={() => deleteComplaint(selectedComplaint._id)}
                    className="w-full inline-flex justify-center items-center rounded-lg border border-transparent px-4 py-2 bg-red-500 text-sm font-medium text-white hover:bg-red-600 sm:w-auto"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    অভিযোগ মুছুন
                  </button>
                )}

                <button
                  onClick={() =>
                    markAsRead(selectedComplaint._id, !selectedComplaint.isRead)
                  }
                  className={`w-full inline-flex justify-center items-center rounded-lg border px-4 py-2 text-sm font-medium sm:w-auto ${
                    selectedComplaint.isRead
                      ? "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                      : "border-transparent text-white bg-yellow-500 hover:bg-yellow-600"
                  }`}
                >
                  {selectedComplaint.isRead ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-1" />
                      অপঠিত হিসাবে চিহ্নিত করুন
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-1" />
                      পঠিত হিসাবে চিহ্নিত করুন
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
