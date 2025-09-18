"use client";

import ComplaintDetailsModal from "@/app/components/ComplaintDetailsModal";
import { teamMembers } from "@/app/data/teamData";
import {
  BarChart3,
  Calendar,
  ClipboardList,
  Download,
  Eye,
  EyeOff,
  FileText,
  Filter,
  Grid3X3,
  List,
  LogOut,
  RefreshCw,
  Search,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface Complaint {
  _id: string;
  againstPersonId?: string;
  againstPersonName?: string;
  complaint: string;
  submittedAt: string;
  isRead: boolean;
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
  const [cachedComplaints, setCachedComplaints] = useState<Complaint[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null
  );
  const [filters, setFilters] = useState({
    againstPersonId: "",
    isRead: "",
    search: "",
    category: "",
  });
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

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
        // Check if cached data exists
        if (cachedComplaints.length > 0) {
          setComplaints(cachedComplaints);
          return;
        }
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
        if (filters.category) {
          params.append("category", filters.category);
        }

        const response = await fetch(`/api/complaints?${params}`);

        if (response.ok) {
          const data = await response.json();
          setComplaints(data.complaints);
          setCachedComplaints(data.complaints); // Cache the complaints
          setPagination(data.pagination);
        }
      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        setLoading(false);
      }
    },
    [filters, cachedComplaints]
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
        "আপনি কি নিশ্চিত যে এই অভিযোগ/মতামতটি মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফিরিয়ে নেওয়া যাবে না।"
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
        alert(data.error || "অভিযোগ/মতামত মুছতে ব্যর্থ হয়েছে");
      }
    } catch (error) {
      console.error("Error deleting complaint:", error);
      alert("অভিযোগ/মতামত মুছতে ব্যর্থ হয়েছে");
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
          <p className="mt-2 text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <section className="relative flex flex-col justify-center items-center bg-gradient-to-b from-yellow-200 to-white py-10 sm:py-14 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex items-center justify-center mb-3">
            <div className="bg-[var(--primary-yellow)] p-2 rounded-lg mr-3 sm:block hidden">
              <ClipboardList className="h-6 w-6 text-gray-900" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              অভিযোগ/মতামত ব্যবস্থাপনা
            </h1>
          </div>
          <div className="bg-gradient-to-r mb-5 from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full inline-flex items-center shadow-md">
            <User className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">
              স্বাগতম, {session.user.username}
            </span>
          </div>
          <div className="flex items-center justify-center space-x-3">
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
      </section>

      {/* Stats Overview */}
      <section className="mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">মোট অভিযোগ/মতামত</p>
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
                  category: "",
                })
              }
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
            >
              <X className="h-4 w-4 mr-1" />
              ফিল্টার রিসেট
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                placeholder="অভিযোগ/মতামতে অনুসন্ধান..."
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
                className="block w-full border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 px-3 py-1"
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
                className="block w-full border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 px-3 py-1"
              >
                <option value="">সব</option>
                <option value="false">অপঠিত</option>
                <option value="true">পঠিত</option>
              </select>
            </div>
          </div>
        </div>

        {/* Complaints List */}
        <div className="overflow-hidden">
          <div className="mb-4 flex justify-between items-center">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-blue-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-800">
                অভিযোগ/মতামতসমূহ
                {pagination && (
                  <span className="text-gray-500 ml-1">
                    ({pagination.total})
                  </span>
                )}
              </h2>
            </div>

            <div className="flex items-center space-x-2">
              {/* View Toggle - Hidden on mobile */}
              <div className="hidden md:flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  title="তালিকা দৃশ্য"
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  title="গ্রিড দৃশ্য"
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
              </div>

              <button className="p-2 hidden rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
                <BarChart3 className="h-4 w-4" />
              </button>
              <button className="p-2 hidden rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">অভিযোগ/মতামত লোড হচ্ছে...</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">কোনো অভিযোগ/মতামত পাওয়া যায়নি</p>
              <button
                onClick={() => fetchComplaints()}
                className="mt-3 text-blue-600 hover:text-blue-700 flex items-center justify-center mx-auto text-sm"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                আবার চেষ্টা করুন
              </button>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5"
                  : "space-y-5"
              }
            >
              {complaints.map((complaint) => {
                const personInfo = complaint.againstPersonId
                  ? getPersonInfo(complaint.againstPersonId)
                  : null;

                return (
                  <div
                    key={complaint._id}
                    className={`relative p-5 rounded-xl transition-colors border ${
                      complaint.isRead
                        ? "bg-gray-50 border-gray-200"
                        : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    {/* {complaint.isRead && (
                      <span className="absolute -top-4 -left-4 bg-green-200 text-green-500 rounded-full p-2">
                        <CheckCheck className="size-4" />
                      </span>
                    )} */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start space-x-3">
                        <div
                          className={`p-2 rounded-full ${
                            complaint.isRead ? "bg-gray-100" : "bg-blue-100"
                          }`}
                        >
                          <User
                            className={`h-5 w-5 ${
                              complaint.isRead
                                ? "text-gray-500"
                                : "text-blue-500"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            নাম প্রকাশে অনিচ্ছুক/অজ্ঞাত
                          </p>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            {new Date(complaint.submittedAt).toLocaleDateString(
                              "bn-BD",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </div>
                        </div>
                      </div>

                      <div
                        className={`px-4 py-1 rounded-full border text-xs font-medium ${
                          complaint.isRead
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-blue-100 text-blue-700 border-blue-200"
                        }`}
                      >
                        {complaint.isRead ? "পঠিত" : "নতুন"}
                      </div>
                    </div>

                    <div
                      className={`mb-4 ${
                        complaint.isRead ? "border-gray-400" : "border-blue-400"
                      }`}
                    >
                      <div className="mb-3">
                        <p className="text-sm text-gray-500 mb-1">বরাবর,</p>
                        {personInfo ? (
                          <div className="text-gray-800">
                            <p className="font-medium">
                              {complaint.againstPersonName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {personInfo.designation}, {personInfo.department}
                            </p>
                          </div>
                        ) : (
                          <p className="text-gray-800">প্রযোজ্য নহে</p>
                        )}
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-1">
                          অভিযোগ/মতামত:
                        </p>
                        <p className="text-gray-800 line-clamp-2">
                          {complaint.complaint.replace(/<[^>]*>/g, "") ||
                            "কোনো অভিযোগ/মতামতের বিবরণ নেই"}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-auto">
                      <div>
                        {complaint.category && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            {complaint.category}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedComplaint(complaint)}
                          className="inline-flex items-center px-3 py-1.5 text-sm rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          বিস্তারিত
                        </button>

                        <button
                          onClick={() =>
                            markAsRead(complaint._id, !complaint.isRead)
                          }
                          className={`inline-flex items-center px-3 py-1.5 text-sm rounded-md ${
                            complaint.isRead
                              ? "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                              : "text-white bg-blue-600 hover:bg-blue-700"
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
                            className="inline-flex items-center px-3 py-1.5 text-sm rounded-md text-white bg-red-600 hover:bg-red-700"
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

          {pagination && pagination.totalPages > 1 && (
            <div className="py-6 mt-6 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center text-center sm:justify-end sm:gap-5 justify-center">
                <p className="text-sm text-gray-700 mb-4 sm:mb-0">
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
                  অভিযোগ/মতামতের মধ্যে
                </p>

                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => fetchComplaints(pagination.page - 1)}
                    disabled={!pagination.hasPrev}
                    className="px-3 py-1.5 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    পূর্ববর্তী
                  </button>

                  <span className="px-3 py-1.5 text-sm text-gray-700">
                    পৃষ্ঠা {pagination.page} / {pagination.totalPages}
                  </span>

                  <button
                    onClick={() => fetchComplaints(pagination.page + 1)}
                    disabled={!pagination.hasNext}
                    className="px-3 py-1.5 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    পরবর্তী
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Complaint Details Modal */}
      <ComplaintDetailsModal
        complaint={selectedComplaint}
        isOpen={!!selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        onMarkAsRead={markAsRead}
        onDelete={deleteComplaint}
      />
    </div>
  );
}
