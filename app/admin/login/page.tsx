"use client";

import { AlertCircle, Eye, EyeOff, Lock, User } from "lucide-react";
import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { status } = useSession();

  // Client-side redirect once authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/admin/complaints");
    }
  }, [status, router]);

  // Loading state while NextAuth checks session
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false, // we'll navigate manually
      });

      if (result?.error) {
        setError("ভুল ইউজার/পাসওয়ার্ড। অনুগ্রহ করে আবার চেষ্টা করুন।");
      } else {
        // Double-check session, then navigate
        const sess = await getSession();
        if (sess) {
          router.replace("/admin/complaints");
        } else {
          setError("লগইন ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
        }
      }
    } catch {
      setError("একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero-style Header */}
      <section className="relative bg-gradient-to-b from-yellow-200 to-white py-12 sm:py-16 text-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-md px-6">
          <div className="flex justify-center">
            <div className="bg-[var(--primary-yellow)] p-3 rounded-full">
              <Lock className="h-8 w-8 text-gray-900" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            অ্যাডমিন লগইন
          </h2>
          <p className="mt-2 text-center text-sm text-gray-700">
            অভিযোগ/মতামত ব্যবস্থাপনা সিস্টেমে প্রবেশ করুন
          </p>
        </div>
      </section>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-6">
        <div className="bg-white py-8 px-6 border border-gray-200 rounded-xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                ইউজারনেম
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[var(--primary-yellow)] focus:border-[var(--primary-yellow)]"
                  placeholder="আপনার ইউজারনেম লিখুন"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                পাসওয়ার্ড
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[var(--primary-yellow)] focus:border-[var(--primary-yellow)]"
                  placeholder="আপনার পাসওয়ার্ড লিখুন"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
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

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-semibold text-gray-900 bg-[var(--primary-yellow)] hover:bg-[var(--secondary-yellow)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-yellow)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938ল3-2.647z"
                      ></path>
                    </svg>
                    সাইন ইন করা হচ্ছে...
                  </>
                ) : (
                  "সাইন ইন"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
