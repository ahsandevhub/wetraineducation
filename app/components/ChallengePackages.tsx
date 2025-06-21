"use client";
import { motion } from "framer-motion";
import { CheckCircle, Star } from "lucide-react";
import Link from "next/link";

interface Package {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular: boolean;
  profitSplit: string;
  maxFunding: string;
  scaling: boolean;
}

const packages: Package[] = [
  {
    name: "বেসিক কোর্স",
    price: "৳৯৯৯",
    description: "নতুন শিক্ষার্থীদের জন্য ট্রেডিং এর বেসিক ধারণা ও প্র্যাকটিস",
    features: [
      "লাইফটাইম এক্সেস",
      "১০+ ভিডিও লেকচার",
      "বেসিক স্ট্র্যাটেজি",
      "রিভিশন কুইজ",
      "কমিউনিটি সাপোর্ট",
    ],
    popular: false,
    profitSplit: "-",
    maxFunding: "-",
    scaling: false,
  },
  {
    name: "প্রফেশনাল কোর্স",
    price: "৳১৯৯৯",
    description:
      "লাইভ ট্রেডিং, রিস্ক ম্যানেজমেন্ট ও সিগন্যাল বিশ্লেষণ সহ কোর্স",
    features: [
      "লাইফটাইম এক্সেস",
      "২০+ ভিডিও লেকচার",
      "লাইভ সেশন",
      "অ্যাসাইনমেন্ট",
      "স্কেলিং প্রস্তুতি",
    ],
    popular: true,
    profitSplit: "-",
    maxFunding: "-",
    scaling: true,
  },
  {
    name: "ফান্ডেড প্রস্তুতি",
    price: "৳৩৯৯৯",
    description: "ফান্ডেড অ্যাকাউন্টে প্রবেশের জন্য পূর্ণাঙ্গ প্রস্তুতি কোর্স",
    features: [
      "লাইফটাইম এক্সেস",
      "৩০+ ভিডিও লেকচার",
      "রিয়েল কেস স্টাডি",
      "ডেডিকেটেড মেন্টর",
      "সার্টিফিকেট",
    ],
    popular: false,
    profitSplit: "-",
    maxFunding: "-",
    scaling: true,
  },
];

export default function ChallengePackages() {
  return (
    <section
      id="packages"
      className="relative py-24 bg-[var(--tertiary-yellow)] overflow-hidden border-b-2 border-yellow-200/50 font-[Baloo Da 2]"
    >
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/wireframe.png')] opacity-10"></div>
        <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-[var(--primary-yellow)] blur-[100px] opacity-10"></div>
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 rounded-full bg-[var(--secondary-yellow)] blur-[100px] opacity-10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-[var(--primary-yellow)]/10 text-[var(--primary-yellow)] px-4 py-2 rounded-full text-sm font-medium mb-4">
            কোর্স প্যাকেজ
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            আপনার{" "}
            <span className="text-[var(--primary-yellow)]">শিক্ষার পথ</span>{" "}
            নির্বাচন করুন
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            স্বচ্ছ মূল্য নির্ধারণ এবং প্রতিটি ধাপে হাতে কলমে শেখা
          </p>
        </motion.div>

        {/* Package Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -10 }}
              className={`relative rounded-xl border ${
                pkg.popular
                  ? "border-[var(--primary-yellow)] shadow-lg"
                  : "border-gray-200 shadow-md"
              } bg-white transition-all`}
            >
              {pkg.popular && (
                <div className="absolute top-0 left-1/2 bg-[var(--primary-yellow)] text-white px-4 py-1 font-bold text-sm transform -translate-x-1/2 -translate-y-3 rounded-full flex items-center">
                  <Star className="w-4 h-4 mr-1 fill-white" />
                  সবচেয়ে জনপ্রিয়
                </div>
              )}

              <div className="p-8 h-full flex flex-col">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {pkg.name}
                  </h3>
                  <p className="text-gray-600">{pkg.description}</p>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-[var(--primary-yellow)]">
                    {pkg.price}
                  </span>
                  <span className="text-gray-500">/এককালীন</span>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-[var(--primary-yellow)] mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={"/courses"}>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full cursor-pointer py-3 rounded-lg font-bold mt-auto ${
                      pkg.popular
                        ? "bg-[var(--primary-yellow)] hover:bg-[var(--secondary-yellow)] text-white"
                        : "bg-gray-900 hover:bg-gray-800 text-white"
                    } transition-colors`}
                  >
                    ভর্তি হোন
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
