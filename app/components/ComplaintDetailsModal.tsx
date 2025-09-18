"use client";

import { teamMembers } from "@/app/data/teamData";
import {
  Building,
  CheckCheck,
  ClipboardList,
  Eye,
  EyeOff,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 bg-opacity-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClipboardList className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                অভিযোগ/মতামতের বিস্তারিত
              </h3>
              {/* <p className="text-sm text-gray-500">আইডি: {complaint._id}</p> */}
              <div className="text-sm text-gray-700 mb-1 flex items-center">
                তারিখ:{" "}
                {new Date(complaint.submittedAt).toLocaleDateString("bn-BD", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
          <button
            onClick={() => onMarkAsRead(complaint._id, !complaint.isRead)}
            className={`py-1 px-3 ml-auto mr-3 flex gap-2 items-center rounded-full font-medium transition-colors ${
              complaint.isRead
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-yellow-500 text-white hover:bg-yellow-600"
            }`}
          >
            {complaint.isRead ? (
              <>
                <CheckCheck className="h-5 w-5" />
                <span>পড়া হয়েছে</span>
              </>
            ) : (
              <>
                <Eye className="h-5 w-5" />
                <span>পড়া হয়নি</span>
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content - Scrollable area */}
        <div className="overflow-y-auto p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Complainant Section */}
            <div className="p-3 bg-yellow-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                অভিযোগকারী
              </h4>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    নাম প্রকাশে অনিচ্ছুক
                  </div>
                  <div className="text-sm text-gray-500">
                    পরিচয় গোপন রাখা হয়েছে
                  </div>
                </div>
              </div>
            </div>

            {/* Against Person Section */}
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                যার নিকটে অভিযোগ
              </h4>
              <div className="flex items-center gap-3">
                {personInfo?.photo ? (
                  <Image
                    src={personInfo.photo}
                    alt={personInfo.name}
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-white shadow-sm object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <Building className="h-5 w-5 text-orange-600" />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {complaint.againstPersonName || "প্রযোজ্য নহে"}
                  </div>
                  {personInfo ? (
                    <div className="text-sm text-gray-600 truncate">
                      {personInfo.designation} - {personInfo.department}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">
                      সাধারণ অভিযোগ/মতামত
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Complaint Details */}
          <div>
            <div className="text-sm font-medium text-gray-700 mb-1">
              অভিযোগ/মতামতের বিবরণ
            </div>
            <div className="p-3 border border-dashed border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-900 whitespace-pre-wrap max-h-40 overflow-y-auto">
              {complaint.complaint.replace(/<[^>]*>/g, "") ||
                "কোনো অভিযোগ/মতামতের বিবরণ নেই"}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end rounded-b-xl">
          <button
            onClick={onClose}
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 sm:order-1"
          >
            বন্ধ করুন
          </button>

          {session?.user.role === "super-admin" && (
            <button
              onClick={() => onDelete(complaint._id)}
              className="px-3 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 flex items-center justify-center"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              মুছুন
            </button>
          )}

          <button
            onClick={() => onMarkAsRead(complaint._id, !complaint.isRead)}
            className={`px-3 py-2 text-sm rounded-lg flex items-center justify-center ${
              complaint.isRead
                ? "border border-gray-300 hover:bg-gray-50"
                : "bg-yellow-500 text-white hover:bg-yellow-600"
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
        </div>
      </div>
    </div>
  );
}
