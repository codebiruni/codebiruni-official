import { Metadata } from "next";
import StorePageClient from "./StorePageClient";
import "./storepage.css";

export const metadata: Metadata = {
  title: "StorePage by Code Biruni — প্রতিটি প্রোডাক্টের জন্য আলাদা ল্যান্ডিং পেজ",
  description:
    "একটি পূর্ণাঙ্গ অনলাইন শপ যেখানে প্রতিটি প্রোডাক্টের জন্য তৈরি হয় আলাদা হাই-কনভার্টিং সেলস ল্যান্ডিং পেজ। Built by Code Biruni.",
  keywords: [
    "StorePage",
    "Code Biruni",
    "E-Commerce website",
    "Product Landing Page",
    "Next.js E-Commerce",
    "Bangladeshi E-commerce Website",
    "Steadfast Courier Integration",
    "Pathao Courier Integration",
    "Courier Fraud Shield",
    "Telegram Order Notification",
    "Instant Order Alert",
    "ই-কমার্স ওয়েবসাইট",
    "ল্যান্ডিং পেইজ",
  ],
  openGraph: {
    title:
      "StorePage by Code Biruni — প্রতিটি প্রোডাক্টের জন্য আলাদা ল্যান্ডিং পেইজ সহ প্রিমিয়াম ই-কমার্স",
    description:
      "একটি পূর্ণাঙ্গ অনলাইন শপ যেখানে প্রতিটি প্রোডাক্টের জন্য তৈরি হয় আলাদা হাই-কনভার্টিং সেলস ল্যান্ডিং পেইজ। ১৫,০০০ টাকায় আজই শুরু করুন।",
    url: "https://www.codebiruni.com/storepage",
    siteName: "Code Biruni",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "StorePage by Code Biruni",
      },
    ],
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StorePage by Code Biruni — Next-Gen E-Commerce Engine",
    description:
      "প্রতিটি প্রোডাক্টের জন্য আলাদা ল্যান্ডিং পেইজ সহ প্রিমিয়াম ই-কমার্স ওয়েবসাইট।",
    images: ["/logo.png"],
  },
};

export default function StorePage() {
  return <StorePageClient />;
}

