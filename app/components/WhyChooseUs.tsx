// components/WhyChooseUs.tsx
"use client";
import { motion } from "framer-motion";
import {
  Award,
  BarChart2,
  Clock,
  DollarSign,
  Repeat,
  ShieldCheck,
  TrendingUp,
  UserPlus,
} from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "শূন্য ঝুঁকিতে শিখুন",
      desc: "লাইভ ফান্ডেড ট্রেডিং নয়—আমরা শেখাই কীভাবে দায়িত্বশীলভাবে ট্রেডিং শুরু করতে হয়।",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "স্কেল করুন আপনার দক্ষতা",
      desc: "বেসিক থেকে অ্যাডভান্স ট্রেডিং পর্যন্ত শেখার সুযোগ, ধাপে ধাপে গাইড সহ।",
    },
    {
      icon: <BarChart2 className="w-6 h-6" />,
      title: "প্রফেশনাল বিশ্লেষণ",
      desc: "আমাদের শিক্ষার্থীরা পায় ট্রেডিং পারফরম্যান্স বিশ্লেষণ এবং ফিডব্যাক।",
    },
    {
      icon: <UserPlus className="w-6 h-6" />,
      title: "সহজ শুরু",
      desc: "কোনো বাধা ছাড়াই শুরু করুন, সরাসরি ড্যাশবোর্ড থেকে অ্যাক্সেস করুন কোর্স।",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "ফাস্ট ট্র্যাক প্রোগ্রাম",
      desc: "দ্রুত প্রস্তুতির জন্য রয়েছে এক্সপ্রেস কোর্স ও মেন্টরিং সাপোর্ট।",
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "সাশ্রয়ী প্যাকেজ",
      desc: "ছাত্রবান্ধব মূল্যে বিশ্বমানের কোর্স ও রিসোর্স অ্যাক্সেস।",
    },
    {
      icon: <Repeat className="w-6 h-6" />,
      title: "আনলিমিটেড রিভিউ",
      desc: "শেখার পরে কোর্সে রিভিশন ও এক্সারসাইজ বারবার করতে পারবেন।",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "এক্সক্লুসিভ কমিউনিটি",
      desc: "ফান্ডেড ট্রেডিং প্রোগ্রাম সম্পর্কে জানতে মেন্টরদের সঙ্গে সরাসরি সংযোগ।",
    },
  ];

  const stats = [
    { value: "১০০০+", label: "হ্যাপি শিক্ষার্থী" },
    { value: "৯৫%", label: "সাফল্যের হার" },
    { value: "২৪/৭", label: "সাপোর্ট" },
    { value: "৫+", label: "প্রফেশনাল মেন্টর" },
  ];

  return (
    <section
      id="why"
      className="relative py-24 overflow-hidden bg-[var(--tertiary-yellow)] font-[Baloo Da 2] border-y-2 border-yellow-200/50"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/wireframe.png')] opacity-10"></div>
        <div className="absolute top-20 left-1/4 w-60 h-60 rounded-full bg-[var(--primary-yellow)] blur-[100px] opacity-10"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[var(--secondary-yellow)] blur-[100px] opacity-10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-[var(--primary-yellow)]/10 text-[var(--primary-yellow)] px-4 py-2 rounded-full text-sm font-medium mb-4">
            কেন আমাদের বেছে নিবেন?
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="text-[var(--primary-yellow)]">
              WeTrain Education
            </span>{" "}
            এর বিশেষত্ব
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            শুধু শেখানো নয়—আমরা গড়ে তুলি আত্মবিশ্বাসী ট্রেডার যারা আন্তর্জাতিক
            ফান্ডেড প্রোগ্রামের জন্য প্রস্তুত।
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className="bg-white rounded-xl p-6 border border-gray-100 hover:border-[var(--primary-yellow)]/30 hover:shadow-lg transition-all h-full"
            >
              <div className="w-12 h-12 rounded-lg bg-[var(--primary-yellow)]/10 flex items-center justify-center mb-4 text-[var(--primary-yellow)]">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[var(--primary-yellow)]/5 to-[var(--secondary-yellow)]/5 border border-[var(--primary-yellow)]/20 rounded-2xl p-8 backdrop-blur-sm"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-[var(--primary-yellow)] mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

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
            কোর্স ব্রাউজ করুন
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
