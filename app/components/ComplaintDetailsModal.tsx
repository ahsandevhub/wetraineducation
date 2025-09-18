"use client";

import { teamMembers } from "@/app/data/teamData";
import {
  Building,
  Calendar,
  CheckCircle,
  ClipboardList,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface Complaint {
  _id: string;
  againstPersonId?: string;
  againstPersonName?: string;
  complaint: string;
  submittedAt: string;
  isRead: boolean;
  category?: string;
}

interface ComplaintDetailsModalProps {
  complaint: Complaint | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (complaintId: string, isRead: boolean) => Promise<void>;
  onDelete: (complaintId: string) => Promise<void>;
}

export default function ComplaintDetailsModal({
  complaint,
  isOpen,
  onClose,
  onMarkAsRead,
  onDelete,
}: ComplaintDetailsModalProps) {
  const { data: session } = useSession();

  const getPersonInfo = (personId: string) => {
    return teamMembers.find((member) => member.id === personId);
  };

  if (!isOpen || !complaint) {
    return null;
  }

  const personInfo = complaint.againstPersonId 
    ? getPersonInfo(complaint.againstPersonId) 
    : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity z-40"
          aria-hidden="true"
          onClick={onClose}
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
              onClick={onClose}
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
                  অভিযোগ/মতামতের বিস্তারিত
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  অভিযোগ/মতামত আইডি: {complaint._id}
                </p>
              </div>
            </div>

            {/* Complainant Section - Always Anonymous */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">অভিযোগকারীর তথ্য</h4>
              <div className="flex items-center gap-4">
                {/* Anonymous user placeholder */}
                <div className="h-14 w-14 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="text-lg font-semibold text-gray-900">
                    নাম প্রকাশে অনিচ্ছুক/অজ্ঞাত
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    পরিচয় গোপন রাখা হয়েছে
                  </div>
                </div>
              </div>
            </div>

            {/* Against Person Section */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">যার নিকটে অভিযোগ/মতামত</h4>
              <div className="flex items-center gap-4">
                {personInfo?.photo ? (
                  <Image
                    src={personInfo.photo}
                    alt={personInfo.name}
                    width={56}
                    height={56}
                    className="rounded-full border-2 border-white shadow-sm object-cover"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-full bg-orange-100 flex items-center justify-center">
                    <Building className="h-8 w-8 text-orange-600" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="text-lg font-semibold text-gray-900">
                    {complaint.againstPersonName || "প্রযোজ্য নহে"}
                  </div>
                  {personInfo ? (
                    <>
                      <div className="text-sm text-gray-600 mt-1">
                        {personInfo.designation} - {personInfo.department}
                      </div>
                      <div className="flex flex-wrap gap-3 mt-2">
                        {personInfo.email && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Mail className="h-4 w-4 mr-1" />
                            {personInfo.email}
                          </div>
                        )}
                        {personInfo.phone && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="h-4 w-4 mr-1" />
                            {personInfo.phone}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-gray-600 mt-1">
                      সাধারণ অভিযোগ/মতামত
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  জমাদানের তারিখ
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {new Date(complaint.submittedAt).toLocaleDateString()}
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
                      complaint.isRead
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {complaint.isRead ? (
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
                অভিযোগ/মতামতের বিবরণ
              </label>
              <div className="p-4 border border-gray-200 rounded-lg bg-yellow-50 text-gray-900 whitespace-pre-wrap">
                {complaint.complaint.replace(/<[^>]*>/g, "") ||
                  "কোনো অভিযোগ/মতামতের বিবরণ নেই"}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 rounded-b-xl">
            <button
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center items-center rounded-lg border border-gray-300 px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              বন্ধ করুন
            </button>

            {session?.user.role === "super-admin" && (
              <button
                onClick={() => onDelete(complaint._id)}
                className="w-full inline-flex justify-center items-center rounded-lg border border-transparent px-4 py-2 bg-red-500 text-sm font-medium text-white hover:bg-red-600 sm:w-auto"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                অভিযোগ/মতামত মুছুন
              </button>
            )}

            <button
              onClick={() => onMarkAsRead(complaint._id, !complaint.isRead)}
              className={`w-full inline-flex justify-center items-center rounded-lg border px-4 py-2 text-sm font-medium sm:w-auto ${
                complaint.isRead
                  ? "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                  : "border-transparent text-white bg-yellow-500 hover:bg-yellow-600"
              }`}
            >
              {complaint.isRead ? (
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
  );
}
