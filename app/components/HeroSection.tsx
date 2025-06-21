// components/HeroSection.tsx
"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-gradient-to-b from-yellow-300 to-yellow-100"
      style={{
        backgroundImage:
          "url('/abstract-geometric-yellow-background-orange-abstract.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Background Effects */}
      <div className="absolute left-0 bottom-0 h-full w-full bg-gradient-to-t from-yellow-100 to-30% to-transparent inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-yellow-400 opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-yellow-400 opacity-10 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-28 relative z-10 h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-center md:text-left">
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            >
              <span>সম্পূর্ণ বাংলায়</span> <br />
              ট্রেডিং শেখার সবচেয়ে সহজ এবং স্বচ্ছ প্ল্যাটফর্ম
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-gray-700 text-lg md:text-xl mb-8 max-w-2xl"
            >
              WeTrain Education এ আপনার ট্রেডিং ক্যারিয়ার শুরু করুন। প্রফেশনাল
              ট্রেনিং, লাইভ সাপোর্ট এবং গাইডলাইনের মাধ্যমে প্রস্তুত হোন
              আন্তর্জাতিক ফান্ডেড প্রোগ্রামের জন্য।
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap gap-4 mb-10 justify-center md:justify-start"
            >
              <motion.a
                href="#courses"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gray-900 hover:bg-gray-800 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                কোর্স দেখুন <Zap className="w-5 h-5" />
              </motion.a>

              <motion.a
                href="about"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white hover:bg-gray-50 border border-yellow-400 text-gray-800 font-bold px-8 py-4 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                কিভাবে কাজ করে <ArrowRight className="w-5 h-5" />
              </motion.a>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="grid grid-cols-2 gap-4 max-w-md"
            >
              {[
                "১০০% শিক্ষামূলক",
                "লাইভ সাপোর্ট",
                "ফান্ডেড অ্যাক্সেস গাইড",
                "প্রফেশনাল মেন্টর",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-lg"
                >
                  <div className="bg-yellow-400 p-2 rounded-full">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-800 font-medium">{item}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Video Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="aspect-video relative">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/NKRq927M3no"
                  title="WeTrain Education Intro"
                  allowFullScreen
                />
              </div>
              <div className="p-6 bg-white">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  কেন WeTrain Education?
                </h3>
                <p className="text-gray-600 mb-4">
                  মাত্র ২ মিনিটের ভিডিওতে দেখুন কিভাবে আমরা ট্রেডিং শিক্ষা ও
                  প্রস্তুতি দিই।
                </p>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>✔ আন্তর্জাতিক প্রপ ফার্ম প্রস্তুতি</li>
                  <li>✔ মেন্টর-সহ লাইভ গাইডেন্স</li>
                  <li>✔ ফান্ডেড অ্যাকাউন্টে প্রবেশের রোডম্যাপ</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { value: "১০০০+", label: "শিক্ষার্থী" },
                { value: "৯৫%", label: "সন্তুষ্টির হার" },
                { value: "২৪/৭", label: "সাপোর্ট" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-gray-100"
                >
                  <div className="text-2xl font-bold text-yellow-500">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
