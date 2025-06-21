import { Toaster } from "react-hot-toast";
import DisclaimerBanner from "./components/DisclaimerBanner";
import Footer from "./components/Footer";
import Header from "./components/Header";
import "./globals.css";

export const metadata = {
  title: "WeTrain Education - বাংলাদেশে বিশ্বমানের ট্রেডিং শিক্ষা",
  description:
    "WeTrain Education - বাংলাদেশি ট্রেডারদের জন্য আধুনিক ট্রেডিং প্রশিক্ষণ ও গাইডলাইন। এখনই শুরু করুন এবং ফান্ডেড ট্রেডিংয়ের জন্য প্রস্তুত হোন।",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body className={`font-sans antialiased bg-quinary-yellow`}>
        <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
        <DisclaimerBanner />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
