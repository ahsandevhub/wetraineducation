"use client";

import { Eye, EyeOff, Shuffle, Type } from "lucide-react";
// import dynamic from "next/dynamic"; // Not needed for simple textarea
import { useState } from "react";

// Import ReactQuill CSS (commented out for simple textarea)
// import "react-quill-new/dist/quill.snow.css";

// Dynamically import ReactQuill to avoid SSR issues (commented out for simple textarea)
// const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface TextFormatterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function TextFormatter({
  value,
  onChange,
  placeholder,
}: TextFormatterProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Text anonymization functions
  const anonymizeText = (text: string): string => {
    // Remove HTML tags for text processing
    const textOnly = text.replace(/<[^>]*>/g, "");

    // Replace common patterns that might identify writing style
    const anonymized = textOnly
      // Normalize punctuation spacing
      .replace(/\s*([.,!?;:])\s*/g, "$1 ")
      // Replace multiple spaces with single space
      .replace(/\s+/g, " ")
      // Remove extra line breaks
      .replace(/\n\s*\n/g, "\n")
      // Normalize quotes
      .replace(/[""'']/g, '"')
      // Replace common contractions
      .replace(/\bcan't\b/gi, "cannot")
      .replace(/\bwon't\b/gi, "will not")
      .replace(/\bdon't\b/gi, "do not")
      .replace(/\bisn't\b/gi, "is not")
      .replace(/\baren't\b/gi, "are not")
      .replace(/\bwasn't\b/gi, "was not")
      .replace(/\bweren't\b/gi, "were not")
      .replace(/\bhasn't\b/gi, "has not")
      .replace(/\bhaven't\b/gi, "have not")
      .replace(/\bhadn't\b/gi, "had not")
      .replace(/\bshouldn't\b/gi, "should not")
      .replace(/\bwouldn't\b/gi, "would not")
      .replace(/\bcouldn't\b/gi, "could not")
      .replace(/\bmightn't\b/gi, "might not")
      .replace(/\bmustn't\b/gi, "must not");

    return anonymized.trim();
  };

  const scrambleWords = (text: string): string => {
    const textOnly = text.replace(/<[^>]*>/g, "");
    const words = textOnly.split(/(\s+)/);

    const scrambledWords = words.map((word) => {
      if (word.trim().length <= 3 || /^\s+$/.test(word)) return word;

      // Keep first and last letter, scramble middle
      const firstChar = word[0];
      const lastChar = word[word.length - 1];
      const middleChars = word.slice(1, -1).split("");

      // Simple shuffle for middle characters
      for (let i = middleChars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [middleChars[i], middleChars[j]] = [middleChars[j], middleChars[i]];
      }

      return firstChar + middleChars.join("") + lastChar;
    });

    return scrambledWords.join("");
  };

  const normalizeCase = (text: string): string => {
    const textOnly = text.replace(/<[^>]*>/g, "");
    // Convert to sentence case - capitalize first letter of sentences
    return textOnly.replace(
      /(^|[.!?]\s+)([a-z])/g,
      (match, p1, p2) => p1 + p2.toUpperCase()
    );
  };

  const handleAnonymize = () => {
    const anonymized = anonymizeText(value);
    onChange(`<p>${anonymized}</p>`);
  };

  const handleScramble = () => {
    const scrambled = scrambleWords(value);
    onChange(`<p>${scrambled}</p>`);
  };

  const handleNormalizeCase = () => {
    const normalized = normalizeCase(value);
    onChange(`<p>${normalized}</p>`);
  };

  // Custom toolbar configuration (commented out - not needed for simple textarea)
  // const modules = {
  //   toolbar: [
  //     [{ header: [1, 2, 3, false] }],
  //     ["bold", "italic", "underline"],
  //     [{ list: "ordered" }, { list: "bullet" }],
  //     ["clean"],
  //   ],
  // };

  // const formats = ["header", "bold", "italic", "underline", "list", "bullet"];

  return (
    <div className="w-full">
      <div className="mb-4 hidden flex-wrap gap-2">
        <button
          type="button"
          onClick={handleAnonymize}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          title="লেখার ধরন স্বাভাবিক করুন"
        >
          <Type size={16} />
          টেক্সট স্বাভাবিক করুন
        </button>

        <button
          type="button"
          onClick={handleScramble}
          className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          title="শব্দের ধরন এলোমেলো করুন"
        >
          <Shuffle size={16} />
          এলোমেলো করুন
        </button>

        <button
          type="button"
          onClick={handleNormalizeCase}
          className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          title="বড়-ছোট হাতের অক্ষর স্বাভাবিক করুন"
        >
          <Type size={16} />
          কেস ঠিক করুন
        </button>

        <button
          type="button"
          onClick={() => setIsPreviewMode(!isPreviewMode)}
          className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          title={isPreviewMode ? "সম্পাদনা মোড" : "প্রিভিউ মোড"}
        >
          {isPreviewMode ? <Eye size={16} /> : <EyeOff size={16} />}
          {isPreviewMode ? "সম্পাদনা" : "প্রিভিউ"}
        </button>
      </div>

      {isPreviewMode ? (
        <div className="min-h-[200px] p-4 border border-gray-300 rounded-lg bg-gray-50 whitespace-pre-wrap text-sm text-gray-900">
          {value.replace(/<[^>]*>/g, "") ||
            placeholder ||
            "আপনার অভিযোগ/মতামত এখানে লিখুন..."}
        </div>
      ) : (
        <div className="rounded-lg">
          <textarea
            value={value.replace(/<[^>]*>/g, "")} // Strip HTML tags for plain text
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "আপনার অভিযোগ/মতামত এখানে লিখুন..."}
            className="w-full border border-gray-300 min-h-[200px] p-3 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-[var(--primary-yellow)] focus:border-transparent"
            rows={8}
          />
        </div>
      )}

      <div className="mt-4 hidden text-sm text-gray-600">
        <p>
          <strong>গোপনীয়তার টিপস:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>
            <strong>টেক্সট স্বাভাবিক করুন:</strong> ব্যক্তিগত লেখার ধরন সরিয়ে
            দেয়
          </li>
          <li>
            <strong>এলোমেলো করুন:</strong> শব্দের অক্ষর এলোমেলোভাবে সাজায়
          </li>
          <li>
            <strong>কেস ঠিক করুন:</strong> বড়-ছোট হাতের অক্ষর মানসম্মত করে
          </li>
          <li>অজ্ঞাত থাকতে সরল, সরাসরি ভাষা ব্যবহার করুন</li>
        </ul>
      </div>
    </div>
  );
}
