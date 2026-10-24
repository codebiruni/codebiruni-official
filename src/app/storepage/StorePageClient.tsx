"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Noto_Sans_Bengali } from "next/font/google";
import WhatsAppIcon from "./WhatsAppIcon";
import "./storepage.css";

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-bengali",
});

// Modal is only downloaded when someone opens it
const DemoModal = dynamic(() => import("./DemoModal"), { ssr: false });

const DEMO_FRAME_URL = "https://storepage.codebiruni.com/step/6ad0a67d26bd6a83391bd604";
const WA_LINK = "https://wa.me/8801602957691";

const BN_DIGITS = "০১২৩৪৫৬৭৮৯";
const normalizePhone = (p: string) =>
  p.replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d))).replace(/[\s\-()]/g, "");

// Bangladesh mobile: 013-019, 11 digits, optional +88 / 88
const validateBDPhone = (phone: string) => /^(?:\+?880|880|0)1[3-9]\d{8}$/.test(normalizePhone(phone));

/* ---------- Lazy iframe: loads only near viewport (and after page load if `idle`) ---------- */
function LazyFrame({ src, title, idle = false }: { src: string; title: string; idle?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || active) return;

    // Save-Data / very slow connections: wait for a tap
    const conn = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }).connection;
    if (conn?.saveData || /(^|-)2g$/.test(conn?.effectiveType || "")) return;

    let io: IntersectionObserver | undefined;
    let idleId: number | undefined;
    let timeoutId: number | undefined;

    const observe = () => {
      io = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setActive(true);
            io?.disconnect();
          }
        },
        { rootMargin: "300px" }
      );
      io.observe(el);
    };

    const afterLoad = () => {
      const win = window as Window & {
        requestIdleCallback?: (cb: () => void, options?: { timeout: number }) => number;
        cancelIdleCallback?: (id: number) => void;
      };
      if (typeof win.requestIdleCallback === "function") {
        idleId = win.requestIdleCallback(observe, { timeout: 3000 });
      } else {
        timeoutId = window.setTimeout(observe, 1500);
      }
    };

    if (idle) {
      if (document.readyState === "complete") afterLoad();
      else window.addEventListener("load", afterLoad, { once: true });
    } else {
      observe();
    }

    return () => {
      window.removeEventListener("load", afterLoad);
      io?.disconnect();
      if (idleId !== undefined && "cancelIdleCallback" in window) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [active, idle]);

  return (
    <div ref={ref} className="frame-box">
      {active ? (
        <iframe src={src} title={title} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      ) : (
        <button type="button" className="frame-ph" onClick={() => setActive(true)}>
          <span className="frame-ph-icon">▶</span>
          <span>লাইভ ডেমো লোড করুন</span>
        </button>
      )}
    </div>
  );
}

/* ---------- Browser-style top bar ---------- */
function BrowserBar({
  url,
  variant = "gray",
  onOpen,
  linkText,
}: {
  url: string;
  variant?: "mac" | "gray" | "blue";
  onOpen: () => void;
  linkText: string;
}) {
  return (
    <div className={`bar bar-between ${variant}`}>
      <div className="bar-left">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
        <span className="url">{url}</span>
      </div>
      <button type="button" className="bar-link" onClick={onOpen}>
        {linkText}
      </button>
    </div>
  );
}

const ANALYTICS_BARS: [number, string][] = [
  [40, "#BFD0F7"],
  [55, "#BFD0F7"],
  [48, "#BFD0F7"],
  [75, "#7F9FE0"],
  [68, "#7F9FE0"],
  [100, "#3F6DCF"],
];

export interface PricingPlan {
  id: "starter" | "growth" | "pro";
  name: string;
  badge: string;
  popular?: boolean;
  priceNum: number;
  price: string;
  regularPrice: string;
  period: string;
  description: string;
  features: { text: string; included: boolean; highlight?: boolean }[];
  ctaText: string;
  projectType: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "স্টার্টার (Starter)",
    badge: "নতুন ও স্কেলিং বিজনেসের জন্য",
    popular: false,
    priceNum: 9999,
    price: "৳৯,৯৯৯",
    regularPrice: "৳১৪,৯৯৯",
    period: "একবারের এককালীন পেমেন্ট",
    description: "সম্পূর্ণ অনলাইন শপ, ডোমেইন-হোস্টিং ও ল্যান্ডিং পেজ সহ দ্রুত সেলস শুরু করতে।",
    features: [
      { text: "প্রতিটি প্রোডাক্টের জন্য অটো হাই-কনভার্টিং ল্যান্ডিং পেজ", included: true },
      { text: "১ বছরের ফ্রি ডোমেইন (.com) ও সুপারফাস্ট হোস্টিং", included: true, highlight: true },
      { text: "ইনস্টলযোগ্য মোবাইল অ্যাপ (PWA অন্তর্ভুক্ত)", included: true, highlight: true },
      { text: "মেটা পিক্সেল (Pixel) ও GA4 ট্র্যাকিং ফুল সেটআপ", included: true, highlight: true },
      { text: "ইনকমপ্লিট / ড্রপড অর্ডার ক্যাপচার (হারানো সেলস রিকভারি)", included: true, highlight: true },
      { text: "বারকোড সহ প্রফেশনাল ইনভয়েস জেনারেট ও প্রিন্ট", included: true, highlight: true },
      { text: "পাঠাও ও স্টেডফাস্ট ১-ক্লিক অটো কুরিয়ার বুকিং", included: true },
      { text: "ইনস্ট্যান্ট টেলিগ্রাম অর্ডার নোটিফিকেশন (১ সেকেন্ডে)", included: true },
      { text: "আনলিমিটেড প্রোডাক্ট ও ক্যাটাগরি ম্যানেজমেন্ট", included: true },
      { text: "৬ মাসের ডেডিকেটেড টেকনিক্যাল সাপোর্ট", included: true, highlight: true },
      { text: "০% সেলস কমিশন ও সাইটের আজীবন ওনারশিপ", included: true },
      { text: "n8n অটোমেশন ও ফেসবুক/মেসেঞ্জার সেলস ফানেল", included: false },
      { text: "MCP সার্ভার ও AI/LLM ইনভেন্টরি কন্ট্রোল", included: false },
    ],
    ctaText: "৯,৯৯৯ টাকায় শুরু করুন",
    projectType: "StorePage (Starter ৳9,999)",
  },
  {
    id: "growth",
    name: "গ্রোথ (Growth)",
    badge: "🔥 সর্বাধিক জনপ্রিয় · অটোমেশন পাওয়ারপ্যাক",
    popular: true,
    priceNum: 14999,
    price: "৳১৪,৯৯৯",
    regularPrice: "৳২৪,৯৯৯",
    period: "একবারের এককালীন পেমেন্ট",
    description: "অ্যাড স্কেলিং ও সোশ্যাল মিডিয়া অটো-সেলস কনভার্সনের জন্য সম্পূর্ণ সলিউশন।",
    features: [
      { text: "Starter প্যাকেজের সমস্ত ফিচার ও মডিউল অন্তর্ভুক্ত", included: true, highlight: true },
      { text: "n8n বিজনেস ওয়ার্কফ্লো অটোমেশন (অর্ডার ও সিআরএম ডেটা সিঙ্ক)", included: true, highlight: true },
      { text: "ফেসবুক কমেন্ট অটোমেশন (পোস্ট ও অ্যাডে স্মার্ট অটো-রিপ্লাই)", included: true, highlight: true },
      { text: "মেসেঞ্জার সেলস কনভার্সন ফানেল (চ্যাট টু ডিরেক্ট সেলস)", included: true, highlight: true },
      { text: "কমপ্লিট অটোমেশন সেটআপ এবং ৬ মাসের সম্পূর্ণ ফ্রি অপারেশন", included: true, highlight: true },
      { text: "১ জন ডেডিকেটেড পার্সন ২৪/৭ অ্যাক্টিভ সাপোর্ট ইঞ্জিনিয়ার", included: true, highlight: true },
      { text: "অ্যাডভান্সড কুরিয়ার ফ্রড শিল্ড (সাকসেস রেট ও রিটার্ন ট্র্যাকার)", included: true },
      { text: "রিয়েল-টাইম সেলস ড্যাশবোর্ড ও প্রফিট/লস রিপোর্ট", included: true },
      { text: "২৪-৪৮ ঘণ্টার মধ্যে ওয়েবসাইট ও অটোমেশন সম্পূর্ণ লাইভ", included: true },
      { text: "০% সেলস কমিশন ও সাইটের আজীবন ওনারশিপ", included: true },
      { text: "MCP সার্ভার ও AI/LLM ইনভেন্টরি কন্ট্রোল", included: false },
    ],
    ctaText: "১৪,৯৯৯ টাকায় অর্ডার করুন",
    projectType: "StorePage (Growth ৳14,999)",
  },
  {
    id: "pro",
    name: "প্রো বিজনেস (Pro / Enterprise)",
    badge: "👑 আলটিমেট AI & কাস্টম এন্টারপ্রাইজ",
    popular: false,
    priceNum: 17999,
    price: "৳১৭,৯৯৯",
    regularPrice: "৳২৯,৯৯৯",
    period: "একবারের এককালীন পেমেন্ট",
    description: "হাই-ভলিউম ব্র্যান্ড, টিম ও AI-চালিত অত্যাধুনিক স্টোরের জন্য সম্পূর্ণ সলিউশন।",
    features: [
      { text: "Growth প্যাকেজের সমস্ত ফিচার ও অটোমেশন অন্তর্ভুক্ত", included: true, highlight: true },
      { text: "ডেডিকেটেড MCP (Model Context Protocol) সার্ভার ইন্টিগ্রেশন", included: true, highlight: true },
      { text: "AI / LLM দিয়ে ইনভেন্টরি ও সেলস নিয়ন্ত্রণ (ন্যাচারাল ল্যাঙ্গুয়েজ কমান্ড)", included: true, highlight: true },
      { text: "শুরুতেই আপনার সব ধরনের কাস্টম রিকয়ার্ড ফিচার ডেভেলপমেন্ট", included: true, highlight: true },
      { text: "২ জন ডেডিকেটেড পার্সন সার্বক্ষণিক (All-time) ভিআইপি সাপোর্ট", included: true, highlight: true },
      { text: "কাস্টম ব্র্যান্ডিং ও আল্ট্রা-প্রিমিয়াম UI/UX কাস্টমাইজেশন", included: true },
      { text: "স্মার্ট মাল্টি-কুরিয়ার অটো অ্যালগরিদম রাউটিং", included: true },
      { text: "মাল্টিপল টেলিগ্রাম গ্রুপ ও মাল্টি-অ্যাডমিন রোলস পারমিশন", included: true },
      { text: "এক্সক্লুসিভ সেলস কনভার্সন ও স্পিড অপটিমাইজেশন কনসাল্টেশন", included: true },
      { text: "০% কমিশন ও সম্পূর্ণ কাস্টমাইজড কোড ওনারশিপ", included: true },
    ],
    ctaText: "১৭,৯৯৯ টাকায় প্রো প্ল্যান নিন",
    projectType: "StorePage (Pro ৳17,999)",
  },
];

export default function StorePageClient() {
  const [formData, setFormData] = useState({ name: "", phone: "", businessName: "" });
  const [selectedPlanId, setSelectedPlanId] = useState<"starter" | "growth" | "pro">("growth");
  const [activeSlide, setActiveSlide] = useState(1);
  const sliderRef = useRef<HTMLDivElement>(null);

  const [phoneError, setPhoneError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const currentPlan = PRICING_PLANS.find((p) => p.id === selectedPlanId) || PRICING_PLANS[1];

  const openDemo = useCallback(() => setIsDemoModalOpen(true), []);
  const closeDemo = useCallback(() => setIsDemoModalOpen(false), []);

  const scrollToSlide = useCallback((index: number) => {
    setActiveSlide(index);
    if (!sliderRef.current) return;
    const cards = sliderRef.current.children;
    if (cards[index]) {
      (cards[index] as HTMLElement).scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, []);

  const handleSelectPlan = useCallback((planId: "starter" | "growth" | "pro") => {
    setSelectedPlanId(planId);
    const orderSection = document.getElementById("order");
    if (orderSection) {
      orderSection.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Sync active slide index when swiping on mobile
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const cards = Array.from(slider.children) as HTMLElement[];
          const sliderCenter = slider.scrollLeft + slider.offsetWidth / 2;
          let closestIndex = 0;
          let minDistance = Infinity;

          cards.forEach((card, idx) => {
            const cardCenter = card.offsetLeft + card.offsetWidth / 2;
            const distance = Math.abs(sliderCenter - cardCenter);
            if (distance < minDistance) {
              minDistance = distance;
              closestIndex = idx;
            }
          });

          setActiveSlide(closestIndex);
          ticking = false;
        });
        ticking = true;
      }
    };

    slider.addEventListener("scroll", handleScroll, { passive: true });
    return () => slider.removeEventListener("scroll", handleScroll);
  }, []);

  // Initial load: on mobile, center the popular plan smoothly
  useEffect(() => {
    if (sliderRef.current && window.innerWidth <= 900) {
      const cards = sliderRef.current.children;
      if (cards[1]) {
        (cards[1] as HTMLElement).scrollIntoView({
          behavior: "auto",
          inline: "center",
          block: "nearest",
        });
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || submitted) return;
    if (!formData.name.trim()) return;

    if (!validateBDPhone(formData.phone)) {
      setPhoneError("একটি সঠিক 11 ডিজিটের বাংলাদেশি ফোন নম্বর দিন (যেমন: 017xxxxxxxx)");
      return;
    }

    setPhoneError("");
    setSubmitError("");
    setSubmitting(true);

    const brand = formData.businessName.trim();
    try {
      const res = await fetch("/api/v2/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          name: formData.name.trim(),
          number: normalizePhone(formData.phone),
          projectType: currentPlan.projectType,
          address: brand || "Online Store Client",
          note: `StorePage Lead. Plan: ${currentPlan.name} (${currentPlan.price}). Brand: ${brand || "N/A"}. Submitted from /storepage landing page.`,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSubmitted(true);
    } catch (err) {
      console.warn("Order submission failed:", err);
      setSubmitError("সাবমিট করা যায়নি। আবার চেষ্টা করুন অথবা WhatsApp-এ মেসেজ দিন।");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`sp ${notoSansBengali.variable}`}>
      {/* Header */}
      <header className="sp-header">
        <div className="w sp-nav">
          <div className="sp-logo">
            <Image
              src="/assets/e8d7b1bc09e2e2bff385ba623d2ca01a.png"
              alt="StorePage logo"
              width={38}
              height={38}
              className="sp-logo-img"
              priority
            />
            <span>StorePage</span>
          </div>
          <div className="sp-nav-actions">
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="wa-nav-btn"
              title="WhatsApp-এ মেসেজ দিন"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon size={18} color="#25D366" />
              <span className="wa-nav-text">WhatsApp</span>
            </a>
            <a href="#order" className="btn nav-order-btn">
              অর্ডার করুন
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="hero-sec">
          <div className="w">
            <div className="g2">
              <div className="hero-content">
                <span className="tag">বার বার ল্যান্ডিং পেইজে টাকা নষ্ট হচ্ছে?</span>
                <h1 className="hero-title">
                  যে প্রোডাক্টের Ads চালাবেন, <span>সেটার জন্যই আলাদা সেলস পেজ।</span>
                </h1>
                <p className="hero-desc">
                  প্রতিটি প্রোডাক্টের জন্য নিজস্ব ল্যান্ডিং পেজ: একটাই পেইজ, একটাই অফার, একটাই অর্ডার বাটন। সাথে পূর্ণাঙ্গ অনলাইন শপও।
                </p>
                <div className="hero-ctas">
                  <a href="#order" className="btn">
                    অর্ডার করুন
                  </a>
                  <button type="button" onClick={openDemo} className="btn2">
                    লাইভ ডেমো দেখুন
                  </button>
                </div>
                <p className="hero-subtext">একবারের ফি · মাসিক চার্জ নেই · ০% কমিশন</p>
              </div>

              <div className="hero-demo-card">
                <BrowserBar
                  variant="mac"
                  url="storepage.codebiruni.com/p/demo"
                  onOpen={openDemo}
                  linkText="ফুলস্ক্রিন ডেমো ↗"
                />
                <div className="hero-frame">
                  <LazyFrame src={DEMO_FRAME_URL} title="StorePage Live Landing Page Demo" idle />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pain points */}
        <section className="dark sec cv">
          <div className="w">
            <h2 className="h-left">
              Ad এর ক্লিক আসে একটা প্রোডাক্টের জন্য, কিন্তু কাস্টমার পৌঁছায় পুরো ক্যাটালগে।
            </h2>
            <div className="g3">
              <div className="pain-point-card">
                <h3>ভিড়ে হারিয়ে যায়</h3>
                <p>১০০ প্রোডাক্টের মাঝে কনফিউজড হয়ে কাস্টমার অর্ডার না দিয়েই ফিরে যায়।</p>
              </div>
              <div className="pain-point-card">
                <h3>বারবার খরচ</h3>
                <p>প্রতিটি নতুন প্রোডাক্টে আলাদা ল্যান্ডিং পেজ বানাতে সময় ও অনেক টাকা লাগে।</p>
              </div>
              <div className="pain-point-card">
                <h3>রিটার্ন ও মাসিক চার্জ</h3>
                <p>ফেক অর্ডারে কুরিয়ার খরচ নষ্ট, তার ওপর অতিরিক্ত সাবস্ক্রিপশন বা সেলস কমিশন।</p>
              </div>
            </div>
          </div>
        </section>

        {/* Demo */}
        <section className="sec cv" id="demo">
          <div className="w">
            <div className="sec-head">
              <span className="tag">মূল ফিচার</span>
              <h2>স্টোরে যোগ করুন একবার। কাস্টমার দেখবে নিজস্ব ল্যান্ডিং পেজ।</h2>
              <p>একই প্রোডাক্ট, দুই রকম অভিজ্ঞতা: স্টোরে ব্রাউজ করা, ল্যান্ডিং পেজে অর্ডার করা।</p>
            </div>

            <div className="g5">
              <div className="step-card">
                <div className="step-header">
                  <span className="step-badge">১. সাধারণ অনলাইন শপ</span>
                  <h3 className="step-title">কাস্টমার সব প্রোডাক্ট ব্রাউজ করে</h3>
                  <p className="step-desc">প্রথাগত ই-কমার্স শপের মতো সব কালেকশন ও ক্যাটাগরি সাজানো থাকে</p>
                </div>
                <div className="bf">
                  <BrowserBar
                    url="storepage.codebiruni.com/products"
                    onOpen={openDemo}
                    linkText="ভিজিট করুন ↗"
                  />
                  <button
                    type="button"
                    className="demo-store-frame"
                    onClick={openDemo}
                    title="ডেমো ও অ্যাডমিন বিস্তারিত দেখতে ক্লিক করুন"
                  >
                    <Image
                      src="/assets/allproductpage.png"
                      alt="StorePage All Products"
                      width={1524}
                      height={1214}
                      sizes="(max-width: 900px) 92vw, 560px"
                    />
                  </button>
                </div>
              </div>

              <div className="arr">
                <span className="pill">→</span>
              </div>

              <div className="step-card">
                <div className="step-header">
                  <span className="step-badge blue">২. ডেডিকেটেড সেলস পেজ</span>
                  <h3 className="step-title blue">সরাসরি ১টি প্রোডাক্টের ল্যান্ডিং পেজে অর্ডার</h3>
                  <p className="step-desc">কোনো বিভ্রান্তি নেই — একটাই প্রোডাক্ট, একটাই ডিসকাউন্ট অফার, ১-ক্লিকে অর্ডার</p>
                </div>
                <div className="bf accent">
                  <BrowserBar
                    variant="blue"
                    url="storepage.codebiruni.com/step/..."
                    onOpen={openDemo}
                    linkText="ফুলস্ক্রিন ডেমো ↗"
                  />
                  <div className="demo-landing-frame">
                    <LazyFrame src={DEMO_FRAME_URL} title="StorePage Single Product Landing Page" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard features */}
        <section className="sec feat cv">
          <div className="w">
            <h2 className="h-left feat-title">ড্যাশবোর্ডে যা দেখবেন, সবই অর্ডার বাঁচায় ও লাভ বাড়ায়</h2>

            <div className="feature-grid">
              {/* 1. Courier */}
              <div className="feature-row">
                <div className="feature-content">
                  <span className="tag">১-ক্লিকে কুরিয়ার বুকিং</span>
                  <h3>কপি-পেস্ট ছাড়া বুকিং, বারকোডসহ ইনভয়েস</h3>
                  <p>পাঠাও ও স্টেডফাস্টে এক ক্লিকে পার্সেল বুক করুন এবং প্রফেশনাল ইনভয়েস প্রিন্ট করুন।</p>
                </div>
                <div className="feature-visual">
                  <div className="bf">
                    <div className="bar">ডেমো ডেটা · ইনভয়েস</div>
                    <div className="inv">
                      <div className="inv-top">
                        <b>#1024 · Ultra 2 Smartwatch</b>
                        <b className="accent-text">৳২,৪৯০</b>
                      </div>
                      <div className="barcode" aria-hidden="true" />
                      <div className="inv-btns">
                        <div className="btn mock-btn">পাঠাও বুক করুন</div>
                        <div className="btn2 mock-btn">স্টেডফাস্ট</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Leads */}
              <div className="feature-row alt">
                <div className="feature-content">
                  <span className="tag">ইনস্ট্যান্ট লিড ক্যাপচার</span>
                  <h3>অর্ডার শেষ না করলেও নম্বর আপনার কাছে</h3>
                  <p>নাম বা নম্বর টাইপ করলেই লিড ড্যাশবোর্ডে। সাথে সাথে কল দিয়ে ড্রপ হওয়া কাস্টমার ফিরিয়ে আনুন।</p>
                </div>
                <div className="feature-visual">
                  <div className="bf">
                    <div className="bar">ডেমো ডেটা · লাইভ লিড</div>
                    <div className="leads">
                      <div className="lead-row">
                        <div>
                          <b>সাকিব হাসান</b>
                          <div className="lead-sub">Ultra 2 Smartwatch</div>
                        </div>
                        <span className="pill">অসম্পূর্ণ</span>
                      </div>
                      <div className="lead-row">
                        <div>
                          <b>নুসরাত জাহান</b>
                          <div className="lead-sub">Cotton Panjabi</div>
                        </div>
                        <span className="chip ok">কনফার্মড</span>
                      </div>
                      <div className="lead-row">
                        <div>
                          <b>রাকিব আহমেদ</b>
                          <div className="lead-sub">Power Bank</div>
                        </div>
                        <span className="pill">অসম্পূর্ণ</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Analytics */}
              <div className="feature-row alt">
                <div className="feature-content">
                  <span className="tag">অ্যাড ট্র্যাকিং ও অ্যানালিটিক্স</span>
                  <h3>কোন প্রোডাক্ট লাভ দিচ্ছে, এক নজরে</h3>
                  <p>Meta Pixel, Conversion API ও GA4 সহ রিয়েল-টাইম সেলস ও নেট প্রফিট রিপোর্ট।</p>
                </div>
                <div className="feature-visual">
                  <div className="bf">
                    <div className="bar">ডেমো ডেটা · রিয়েল-টাইম অ্যানালিটিক্স</div>
                    <div className="analytics">
                      <div className="stat-grid">
                        <div className="tile">
                          অর্ডার<br />
                          <b className="stat">১২৮</b>
                        </div>
                        <div className="tile">
                          নেট প্রফিট<br />
                          <b className="stat accent-text">৳৪৮,৫০০</b>
                        </div>
                      </div>
                      <div className="bars" aria-hidden="true">
                        {ANALYTICS_BARS.map(([h, c], i) => (
                          <i key={i} style={{ height: `${h}%`, background: c }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. PWA */}
              <div className="feature-row">
                <div className="feature-content">
                  <span className="tag">মোবাইল অ্যাপ (PWA)</span>
                  <h3>কাস্টমার ফোনে অ্যাপের মতো ইনস্টল করবে</h3>
                  <p>প্লে স্টোরের ঝামেলা ছাড়াই। Next.js 15 ও React 19 দিয়ে তৈরি, তাই পেজ পলকে লোড হয়।</p>
                </div>
                <div className="feature-visual">
                  <div className="phone-wrap">
                    <div className="phone">
                      <Image
                        src="/assets/appss.jpeg"
                        alt="StorePage Mobile App (PWA)"
                        fill
                        sizes="240px"
                        style={{ objectFit: "cover", objectPosition: "top" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Telegram */}
              <div className="feature-row alt">
                <div className="feature-content">
                  <span className="tag tg">ইনস্ট্যান্ট টেলিগ্রাম অ্যালার্ট</span>
                  <h3>অর্ডার আসার সাথে সাথে টেলিগ্রামে নোটিফিকেশন</h3>
                  <p>
                    কাস্টমার অর্ডার প্লেস করা মাত্রই ১ সেকেন্ডে অ্যাডমিন ও ম্যানেজমেন্টের টেলিগ্রাম গ্রুপে চলে আসবে সম্পূর্ণ বিবরণ। কোনো অর্ডার আর মিস হবে না — সাথে সাথে কল দিয়ে কনফার্ম করে দ্রুত ডেলিভারি নিশ্চিত করুন।
                  </p>
                </div>
                <div className="feature-visual">
                  <div className="bf">
                    <div className="bar bar-between tgbar">
                      <div className="bar-left">
                        <span className="dot" />
                        <span className="dot" />
                        <span className="dot" />
                        <span className="tg-bar-title">ডেমো ডেটা · টেলিগ্রাম বট নোটিশ</span>
                      </div>
                      <span className="tg-live">
                        <i />
                        Telegram Live
                      </span>
                    </div>
                    <div className="tg-body">
                      <div className="tg-card">
                        <div className="tg-head">
                          <div className="tg-id">
                            <div className="tg-avatar">✈</div>
                            <div>
                              <b className="tg-name">StorePage Order Bot</b>
                              <div className="tg-bot">BOT · এইমাত্র প্রাপ্ত</div>
                            </div>
                          </div>
                          <span className="chip ok">নতুন অর্ডার #1025</span>
                        </div>
                        <div className="tg-lines">
                          <div><b>🛍 প্রোডাক্ট:</b> Ultra 2 Smartwatch</div>
                          <div>
                            <b>💰 মোট মূল্য:</b> <span className="accent-text tg-price">৳২,৪৯০</span> (ক্যাশ অন ডেলিভারি)
                          </div>
                          <div><b>👤 কাস্টমার:</b> সাকিব হাসান</div>
                          <div><b>📱 ফোন:</b> 01712-XXXXXX</div>
                          <div><b>📍 ঠিকানা:</b> বাড়ি #১২, রোড #৪, মিরপুর ১০, ঢাকা</div>
                        </div>
                        <div className="tg-actions">
                          <div className="tg-call">১-ক্লিকে কল দিন 📞</div>
                          <button type="button" className="tg-view" onClick={openDemo}>
                            ড্যাশবোর্ডে দেখুন ↗
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Offer & 3 Pricing Models */}
        <section className="dark sec cv" id="offer">
          <div className="w offer-wrap">
            {/* Free Included Modules Banner & Cards */}
            <span className="pill">লঞ্চ অফার · সম্পূর্ণ ফ্রি মডিউল</span>
            <h2 className="offer-title">৳২৪,৫০০+ মূল্যের প্রিমিয়াম মডিউল, সম্পূর্ণ ফ্রি!</h2>
            <p className="offer-subtitle">
              কোনো লুকানো চার্জ বা এক্সট্রা ফি ছাড়া আপনার বিজনেসের প্রতিটি প্যাকেজের সাথে অন্তর্ভুক্ত এই পাওয়ারফুল মডিউলগুলো:
            </p>
            <div className="bonus-grid">
              <div className="bonus-card">
                <span className="pill">মূল্য ৳৮,০০০ — সম্পূর্ণ ফ্রি</span>
                <h3>📱 ইনস্টলযোগ্য মোবাইল অ্যাপ (PWA)</h3>
                <p>প্লে স্টোরের ঝামেলা ছাড়াই কাস্টমার সরাসরি ফোনে অ্যাপের মতো সাইট ইনস্টল করতে পারবে। পলকে লোড হবে।</p>
              </div>
              <div className="bonus-card">
                <span className="pill">মূল্য ৳৫,০০০ — সম্পূর্ণ ফ্রি</span>
                <h3>🌐 ১ বছরের ফ্রি ডোমেইন ও হোস্টিং</h3>
                <p>হাই-স্পিড ক্লাউড হোস্টিং, লাইফটাইম ফ্রি SSL সিকিউরিটি ও কাস্টম .com ডোমেইন সেটআপ ফুল রেডি।</p>
              </div>
              <div className="bonus-card">
                <span className="pill">মূল্য ৳৫,৫০০ — সম্পূর্ণ ফ্রি</span>
                <h3>📊 মেটা পিক্সেল ও GA4 সেটআপ</h3>
                <p>পারফেক্ট ইভেন্ট ট্র্যাকিং, কনভার্সন API (CAPI) ও অডিয়েন্স রিটার্গেটিং সেটআপ যাতে ফেসবুক অ্যাডের কোনো সেলস ডাটা মিস না হয়।</p>
              </div>
              <div className="bonus-card">
                <span className="pill">মূল্য ৳৬,০০০ — সম্পূর্ণ ফ্রি</span>
                <h3>🧾 বারকোড ইনভয়েস ও ড্রপড অর্ডার ক্যাপচার</h3>
                <p>১-ক্লিকে বারকোড সহ প্রফেশনাল পার্সেল ইনভয়েস প্রিন্ট এবং যেসব কাস্টমার ফর্ম পূরণ করেও অর্ডার সম্পন্ন করেনি তাদের অটো রিকভারি।</p>
              </div>
            </div>

            {/* 3 Pricing Models */}
            <div className="pricing-main-wrap">
              <div className="pricing-header">
                <span className="pill">স্বচ্ছ ও সাশ্রয়ী প্রাইসিং</span>
                <h2 className="pricing-headline">আপনার ব্যবসার জন্য সঠিক প্ল্যানটি বেছে নিন</h2>
                <p className="pricing-subheadline">
                  কোনো লুকানো চার্জ নেই, কোনো মাসিক সাবস্ক্রিপশন নেই — একবারের ইনভেস্টমেন্টে সম্পূর্ণ ওনারশিপ।
                </p>
              </div>

              {/* Mobile Quick Selector Tabs */}
              <div className="pricing-mobile-tabs" role="tablist" aria-label="Pricing Packages">
                {PRICING_PLANS.map((plan, idx) => (
                  <button
                    key={plan.id}
                    type="button"
                    role="tab"
                    aria-selected={activeSlide === idx}
                    className={`pricing-tab-btn ${activeSlide === idx ? "active" : ""}`}
                    onClick={() => scrollToSlide(idx)}
                  >
                    <span className="tab-pill-price">{plan.price}</span>
                    <span className="tab-pill-name">{plan.name.split(" ")[0]}</span>
                    {plan.popular && <span className="tab-pill-star">★</span>}
                  </button>
                ))}
              </div>

              {/* Slider Track (Grid on Desktop, Horizontal Swipe Slider on Mobile) */}
              <div
                ref={sliderRef}
                className="pricing-slider"
                tabIndex={0}
                aria-label="Pricing packages slider"
              >
                {PRICING_PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    className={`pricing-card ${plan.popular ? "featured" : ""}`}
                  >
                    {plan.popular && (
                      <div className="pricing-ribbon">🔥 সর্বাধিক জনপ্রিয় · সেরা ভ্যালু</div>
                    )}
                    <div className="plan-header">
                      <span className="plan-badge">{plan.badge}</span>
                      <h3 className="plan-name">{plan.name}</h3>
                      <p className="plan-desc">{plan.description}</p>
                    </div>

                    <div className="plan-price-wrap">
                      <s>{plan.regularPrice}</s>
                      <div className="plan-price">{plan.price}</div>
                      <p className="plan-period">{plan.period}</p>
                    </div>

                    <div className="pricing-features">
                      {plan.features.map((feat, fIdx) => (
                        <div
                          key={fIdx}
                          className={`ck ${feat.highlight ? "ck-highlight" : ""} ${
                            !feat.included ? "ck-no" : ""
                          }`}
                        >
                          <span>{feat.text}</span>
                        </div>
                      ))}
                    </div>

                    <div className="plan-action">
                      <button
                        type="button"
                        onClick={() => handleSelectPlan(plan.id)}
                        className={`btn pricing-btn ${plan.popular ? "featured" : "secondary"}`}
                      >
                        {plan.ctaText}
                      </button>
                      <p className="pricing-subtext">অগ্রিম পেমেন্ট ছাড়াই আলোচনা করুন</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Controls: Dots + Arrows */}
              <div className="slider-controls">
                <button
                  type="button"
                  className="slider-nav-btn prev"
                  onClick={() => scrollToSlide(Math.max(0, activeSlide - 1))}
                  disabled={activeSlide === 0}
                  aria-label="পূর্ববর্তী প্ল্যান"
                >
                  ‹
                </button>
                <div className="slider-dots">
                  {PRICING_PLANS.map((p, idx) => (
                    <button
                      key={p.id}
                      type="button"
                      className={`slider-dot ${activeSlide === idx ? "active" : ""}`}
                      onClick={() => scrollToSlide(idx)}
                      aria-label={`${p.name} দেখুন`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className="slider-nav-btn next"
                  onClick={() => scrollToSlide(Math.min(PRICING_PLANS.length - 1, activeSlide + 1))}
                  disabled={activeSlide === PRICING_PLANS.length - 1}
                  aria-label="পরবর্তী প্ল্যান"
                >
                  ›
                </button>
              </div>
              <p className="mobile-swipe-hint">সোয়াইপ করে ৩টি প্যাকেজ তুলনা করুন ↔</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="sec faq cv">
          <div className="w narrow">
            <h2 className="faq-title">সচরাচর জিজ্ঞাসিত প্রশ্ন</h2>
            <div className="faq-list">
              <details>
                <summary>নিজে প্রোডাক্ট, ক্যাটাগরি ও দাম পরিবর্তন করতে পারব?</summary>
                <p>হ্যাঁ। ড্যাশবোর্ড থেকে সবকিছু নিজেই সহজে পরিবর্তন ও ম্যানেজ করতে পারবেন।</p>
              </details>
              <details>
                <summary>নতুন অর্ডার আসলে আমি সাথে সাথে নোটিফিকেশন পাব?</summary>
                <p>হ্যাঁ! কাস্টমার অর্ডার প্লেস করা মাত্রই ১ সেকেন্ডে অ্যাডমিন ও ম্যানেজমেন্টের টেলিগ্রাম গ্রুপে সম্পূর্ণ কাস্টমার ডিটেইলস সহ অ্যালার্ট চলে যাবে।</p>
              </details>
              <details>
                <summary>পাঠাও ও স্টেডফাস্ট কুরিয়ার কীভাবে যুক্ত হয়?</summary>
                <p>সেটআপের সময় আমরাই আপনার কুরিয়ার অ্যাকাউন্ট যুক্ত করে দিই, যাতে এক ক্লিকেই বুকিং করা যায়।</p>
              </details>
              <details>
                <summary>প্যাকেজের মূল্যের পর কোনো হিডেন খরচ বা মাসিক ফি আছে কি?</summary>
                <p>না। এটি একবারের সেটআপ ও ডেভেলপমেন্ট ফি, কোনো মাসিক চার্জ বা পার-অর্ডার কমিশন নেই। সম্পূর্ণ কোড ও সাইটের লাইফটাইম ওনারশিপ আপনার।</p>
              </details>
              <details>
                <summary>আমি কি পরবর্তীতে স্টার্টার থেকে গ্রোথ বা প্রো প্ল্যানে আপগ্রেড করতে পারব?</summary>
                <p>হ্যাঁ, অবশ্যই! ব্যবসা বৃদ্ধির সাথে সাথে যেকোনো সময় অতিরিক্ত পার্থক্য পরিশোধ করে সহজেই পরবর্তী প্ল্যানে আপগ্রেড করতে পারবেন।</p>
              </details>
              <details>
                <summary>ওয়েবসাইট ডেলিভারিতে কতদিন লাগবে?</summary>
                <p>সব তথ্য পাওয়ার পর সর্বোচ্চ ২৪-৪৮ ঘণ্টার মধ্যে ওয়েবসাইট সম্পূর্ণ রেডি ও লাইভ।</p>
              </details>
            </div>
          </div>
        </section>

        {/* Order form */}
        <section className="sec order cv" id="order">
          <div className="w">
            <div className="g2">
              <div className="order-cta-content">
                <h2>আপনার পরের অ্যাডের আগেই StorePage সেট করে নিন</h2>
                <p>ফর্ম পূরণ করুন। আমরা সর্বোচ্চ ২ ঘণ্টার মধ্যে কল করে ডেমো দেখাব এবং সেটআপ বুঝিয়ে দেব।</p>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="order-wa-link">
                  <WhatsAppIcon size={22} color="#25D366" />
                  <span>WhatsApp করুন: +8801602957691</span>
                </a>
              </div>

              <form onSubmit={handleSubmit} className="order-form-card" noValidate={false}>
                {/* Plan Selection Pills inside Form */}
                <div className="order-plan-selector">
                  <span className="order-plan-label">নির্বাচিত প্যাকেজ:</span>
                  <div className="order-plan-pills">
                    {PRICING_PLANS.map((plan) => (
                      <button
                        key={plan.id}
                        type="button"
                        className={`order-plan-pill ${selectedPlanId === plan.id ? "active" : ""}`}
                        onClick={() => setSelectedPlanId(plan.id)}
                      >
                        <span className="opp-name">{plan.name.split(" ")[0]}</span>
                        <span className="opp-price">{plan.price}</span>
                        {plan.popular && <span className="opp-badge">পপুলার</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <label>
                  আপনার নাম *
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="যেমন: সাকিব হাসান"
                  />
                </label>
                <label>
                  মোবাইল / WhatsApp নম্বর *
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    value={formData.phone}
                    className={phoneError ? "invalid" : undefined}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (phoneError) setPhoneError("");
                    }}
                    placeholder="017xxxxxxxx"
                  />
                  {phoneError && <span className="field-err">{phoneError}</span>}
                </label>
                <label>
                  আপনার ব্র্যান্ডের নাম (ঐচ্ছিক)
                  <input
                    type="text"
                    autoComplete="organization"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="যেমন: Smart Store BD"
                  />
                </label>
                <button
                  type="submit"
                  disabled={submitting || submitted}
                  className={`btn submit-btn${submitted ? " done" : ""}`}
                >
                  {submitting
                    ? "পাঠানো হচ্ছে..."
                    : submitted
                      ? "✓ ধন্যবাদ! তথ্য সাবমিট হয়েছে"
                      : `${currentPlan.price} এ অর্ডার করুন`}
                </button>
                {submitted ? (
                  <p className="form-note form-ok" role="status">
                    ✓ আপনার তথ্য সফলভাবে জমা হয়েছে। আমরা শীঘ্রই যোগাযোগ করব।
                  </p>
                ) : submitError ? (
                  <p className="form-note form-error" role="alert">
                    {submitError}
                  </p>
                ) : (
                  <p className="form-note">অগ্রিম পেমেন্ট ছাড়াই আলোচনা করুন • কোনো হিডেন চার্জ নেই</p>
                )}
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="sp-footer">
        <div className="w">© 2026 Code Biruni. All rights reserved</div>
      </footer>

      {isDemoModalOpen && <DemoModal onClose={closeDemo} />}
    </div>
  );
}