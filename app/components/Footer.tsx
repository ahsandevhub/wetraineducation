// components/Footer.tsx
"use client";
import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = [
    { name: "আমাদের সম্পর্কে", href: "about" },
    { name: "প্রশ্নোত্তর", href: "/faq" },
    { name: "রিফান্ড নীতি", href: "/refund" },
    { name: "ব্যবহারের শর্তাবলী", href: "/terms" },
    { name: "অ্যাফিলিয়েট তথ্য", href: "/affiliate" },
  ];

  const contactInfo = [
    { icon: Mail, text: "support@wetraineducation.com" },
    { icon: Phone, text: "+880 1887-864760" },
    { icon: MapPin, text: "#৯৫৪, উষা তারা কুঞ্জ, সি এন্ড বি রোড, বরিশাল।" },
  ];

  const socialLinks = [
    { icon: Twitter, href: "#" },
    { icon: Facebook, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Linkedin, href: "#" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 font-[Baloo Da 2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Image
              src="/WeTrainEducation Logo White.png"
              alt="WeTrain Logo"
              className="h-10 w-auto"
              width={150}
              height={150}
            />
          </div>
          <p className="text-sm">
            বাংলাদেশের বিশ্বমানের ট্রেডিং শিক্ষা প্রতিষ্ঠান। প্রফেশনাল
            ট্রেডারদের জন্য উন্নত ট্রেনিং এবং গাইডলাইন প্রদান করি।
          </p>
          <div className="flex space-x-4">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                whileHover={{ y: -3 }}
                className="text-gray-400 hover:text-[var(--primary-yellow)] transition-colors"
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-white font-bold text-lg mb-4">দ্রুত লিঙ্ক</h3>
          <ul className="space-y-3">
            {links.map((link, index) => (
              <motion.li key={index} whileHover={{ x: 5 }}>
                <a
                  href={link.href}
                  className="text-sm hover:text-[var(--primary-yellow)] transition-colors"
                >
                  {link.name}
                </a>
              </motion.li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold text-lg mb-4">যোগাযোগ</h3>
          <ul className="space-y-3">
            {contactInfo.map((info, index) => (
              <li key={index} className="flex items-start space-x-3">
                <info.icon className="w-5 h-5 text-[var(--primary-yellow)] flex-shrink-0" />
                <span className="text-sm">{info.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold text-lg mb-4">নিউজলেটার</h3>
          <p className="text-sm mb-4">
            ট্রেডিং টিপস এবং এক্সক্লুসিভ অফার পেতে সাবস্ক্রাইব করুন।
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="আপনার ইমেইল"
              className="px-4 bg-slate-50 py-2 rounded-l-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-[var(--primary-yellow)] text-gray-900"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[var(--primary-yellow)] text-gray-900 px-4 py-2 rounded-r-lg text-sm font-medium"
            >
              সাবস্ক্রাইব
            </motion.button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">
            &copy; {currentYear} উইট্রেইন এডুকেশন। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <p className="text-sm mt-2 md:mt-0">
            ডেভেলপ করেছেন:{" "}
            <motion.a
              href="https://ahsandevhub.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ color: "#facc15" }}
              className="text-[var(--primary-yellow)] hover:underline"
            >
              Ahsan DevHub
            </motion.a>
          </p>
        </div>
      </div>
    </footer>
  );
}
