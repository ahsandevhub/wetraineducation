"use client";
import { motion } from "framer-motion";
import {
  BarChart3,
  CheckCircle,
  ChevronsRight,
  PlayCircle,
} from "lucide-react";

export default function ChallengeFlow() {
  const steps = [
    {
      icon: <PlayCircle className="w-8 h-8" />,
      title: "কোর্স নির্বাচন করুন",
      description:
        "বেসিক থেকে অ্যাডভান্স – আপনার লক্ষ্য অনুযায়ী সঠিক ট্রেডিং কোর্স বেছে নিন।",
      duration: "১-২ দিন",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "ট্রেনিং সম্পন্ন করুন",
      description:
        "লাইভ ক্লাস, রেকর্ডেড ভিডিও এবং কুইজের মাধ্যমে ট্রেডিং দক্ষতা অর্জন করুন।",
      duration: "৭-৩০ দিন",
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "প্রশংসাপত্র ও প্রস্তুতি",
      description:
        "সার্টিফিকেট অর্জন করুন এবং ফান্ডেড প্রোগ্রামের জন্য প্রস্তুত হোন।",
      duration: "চলমান",
    },
  ];

  return (
    <section
      id="challenge-flow"
      className="relative py-24 bg-[var(--tertiary-yellow)] overflow-hidden border-y-2 border-yellow-200/50 font-[Baloo Da 2]"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/wireframe.png')] opacity-10"></div>
        <div className="absolute top-20 left-1/4 w-60 h-60 rounded-full bg-[var(--primary-yellow)] blur-[100px] opacity-10"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[var(--secondary-yellow)] blur-[100px] opacity-10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-[var(--primary-yellow)]/10 text-[var(--primary-yellow)] px-4 py-2 rounded-full text-sm font-medium mb-4">
            শেখার ধাপসমূহ
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="text-[var(--primary-yellow)]">৩ ধাপে</span> ট্রেডিং
            প্রস্তুতি
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            WeTrain Education-এ ট্রেডিং শেখার সহজ পথ – আজই শুরু করুন!
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                className="relative"
              >
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-[var(--primary-yellow)] flex items-center justify-center text-white font-bold border-4 border-white shadow-md">
                  {index + 1}
                </div>

                <div className="bg-white rounded-xl p-8 border border-gray-100 hover:border-[var(--primary-yellow)]/30 hover:shadow-lg transition-all h-full">
                  <div className="flex flex-col items-center text-center h-full">
                    <div className="w-14 h-14 rounded-lg bg-[var(--primary-yellow)]/10 flex items-center justify-center mb-6 text-[var(--primary-yellow)]">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 mb-4 flex-grow">
                      {step.description}
                    </p>
                    <div className="text-sm text-[var(--primary-yellow)] font-medium">
                      সময়কাল: {step.duration}
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-8 transform -translate-y-1/2 z-10">
                    <ChevronsRight className="w-8 h-8 text-[var(--primary-yellow)]" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <motion.a
            href="#courses"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[var(--primary-yellow)] text-gray-900 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:bg-[var(--secondary-yellow)]"
          >
            এখনই শেখা শুরু করুন
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
