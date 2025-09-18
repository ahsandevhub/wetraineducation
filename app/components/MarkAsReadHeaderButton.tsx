import { CheckCheck, Loader } from "lucide-react";
import { useState } from "react";

interface Props {
  complaintId: string;
  onMarkAsRead: (complaintId: string, isRead: boolean) => Promise<void>;
  onClose: () => void;
}

export default function MarkAsReadHeaderButton({
  complaintId,
  onMarkAsRead,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleMarkAsRead = async () => {
    setLoading(true);
    await onMarkAsRead(complaintId, true);
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 600); // Show spinner for a short time
  };

  return (
    <button
      onClick={handleMarkAsRead}
      disabled={loading}
      className={`py-1 sm:flex hidden px-3 ml-auto mr-3 gap-2 items-center rounded-full font-medium transition-colors bg-green-500 text-white hover:bg-green-600 relative`}
    >
      {loading ? (
        <>
          <Loader className="animate-spin h-5 w-5 ml-2" />
          <span className="ml-1">আপডেট হচ্ছে...</span>
        </>
      ) : (
        <>
          <CheckCheck className="h-5 w-5" />
          <span className="ml-1">পড়া হয়েছে</span>
        </>
      )}
    </button>
  );
}
