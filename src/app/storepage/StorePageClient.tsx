"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Hind_Siliguri } from "next/font/google";
import WhatsAppIcon from "./WhatsAppIcon";
import "./storepage.css";

const hind = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-hind",
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
      if ("requestIdleCallback" in window) {
        (window as Window & { requestIdleCallback: any }).requestIdleCallback(observe, { timeout: 3000 });
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

export default function StorePageClient() {
  const [formData, setFormData] = useState({ name: "", phone: "", businessName: "" });
  const [phoneError, setPhoneError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const openDemo = useCallback(() => setIsDemoModalOpen(true), []);
  const closeDemo = useCallback(() => setIsDemoModalOpen(false), []);

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
          projectType: "StorePage (E-Commerce ৳15,000)",
          address: brand || "Online Store Client",
          note: `StorePage Lead. Brand: ${brand || "N/A"}. Submitted from /storepage landing page.`,
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
    <div className={`sp ${hind.variable}`}>
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

        {/* Offer */}
        <section className="dark sec cv" id="offer">
          <div className="w offer-wrap">
            <span className="pill">লঞ্চ অফার · প্রথম ৫০ জনের জন্য</span>
            <h2 className="offer-title">৳১৮,০০০ ভ্যালুর বোনাস, সম্পূর্ণ ফ্রি</h2>
            <div className="g3 bonus-grid">
              <div className="bonus-card">
                <span className="pill">মূল্য ৳৮,০০০ — ফ্রি</span>
                <h3>ইনস্টলযোগ্য মোবাইল অ্যাপ (PWA)</h3>
                <p>প্লে স্টোর ছাড়াই কাস্টমার অ্যাপের মতো ওয়েবসাইট ফোনে ইনস্টল করবে।</p>
              </div>
              <div className="bonus-card">
                <span className="pill">মূল্য ৳৬,০০০ — ফ্রি</span>
                <h3>১ বছর টেকনিক্যাল সাপোর্ট</h3>
                <p>যেকোনো সমস্যায় সরাসরি ডেভেলপার সাপোর্ট ও দ্রুত মেইনটেন্যান্স।</p>
              </div>
              <div className="bonus-card">
                <span className="pill">মূল্য ৳৪,০০০ — ফ্রি</span>
                <h3>১ বছরের ডোমেইন ও হোস্টিং</h3>
                <p>হাই-স্পিড সার্ভার কনফিগারেশন ও এসএসএল সিকিউরিটিসহ সম্পূর্ণ সেটআপ।</p>
              </div>
            </div>
            <div className="pricing-card">
              <s>৳২৫,০০০</s>
              <div className="pricing-amount">৳১৫,০০০</div>
              <p className="pricing-frequency">একবারের পেমেন্ট</p>
              <div className="pricing-features">
                <div className="ck">মাসিক সাবস্ক্রিপশন নেই</div>
                <div className="ck">বিক্রিতে ০% কমিশন</div>
                <div className="ck">ইনস্ট্যান্ট টেলিগ্রাম অর্ডার নোটিফিকেশন</div>
                <div className="ck">২৪-৪৮ ঘণ্টায় ওয়েবসাইট লাইভ</div>
              </div>
              <a href="#order" className="btn pricing-btn">
                এখনই আপনার স্লট নিন
              </a>
              <p className="pricing-subtext">অগ্রিম পেমেন্ট ছাড়াই আলোচনা করুন</p>
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
                <summary>১৫,০০০ টাকার পর কোনো হিডেন খরচ আছে কি?</summary>
                <p>না। এটি একবারের সেটআপ ফি, কোনো মাসিক চার্জ বা পার-অর্ডার কমিশন নেই।</p>
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
                      : "১৫,০০০ টাকায় অর্ডার করুন"}
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
                  <p className="form-note">অগ্রিম পেমেন্ট ছাড়াই আলোচনা করুন</p>
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