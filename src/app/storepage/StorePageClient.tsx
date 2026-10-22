"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import "./storepage.css";


function WhatsAppIcon({ size = 20, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill={color}
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.737 5.472 2.027 7.773L0 32l8.476-2.003A15.932 15.932 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 01-6.77-1.853l-.486-.289-5.027 1.188 1.211-4.893-.317-.502A13.267 13.267 0 012.667 16C2.667 8.636 8.636 2.667 16 2.667c7.364 0 13.333 5.97 13.333 13.333 0 7.364-5.97 13.333-13.333 13.333zm7.307-9.973c-.4-.2-2.363-1.167-2.73-1.3-.367-.133-.634-.2-.9.2-.267.4-1.034 1.3-1.267 1.567-.233.267-.467.3-.867.1-.4-.2-1.688-.623-3.214-1.984-1.188-1.06-1.99-2.37-2.224-2.77-.233-.4-.025-.616.175-.815.18-.18.4-.467.6-.7.2-.233.267-.4.4-.667.133-.267.067-.5-.033-.7-.1-.2-.9-2.167-1.234-2.967-.325-.78-.655-.674-.9-.686-.233-.012-.5-.015-.767-.015s-.7.1-1.067.5c-.367.4-1.4 1.367-1.4 3.333s1.434 3.867 1.634 4.133c.2.267 2.82 4.307 6.833 6.034.955.412 1.7.658 2.281.842.958.305 1.831.262 2.52.159.769-.114 2.363-.967 2.697-1.9.333-.933.333-1.733.233-1.9-.1-.167-.367-.267-.767-.467z" />
    </svg>
  );
}

export default function StorePageClient() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    businessName: "",
  });
  const [phoneError, setPhoneError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Validate Bangladesh phone numbers (013-019, 11 digits, optional +88 / 88)
  const validateBDPhone = (phone: string): boolean => {
    const cleaned = phone.replace(/[\s\-()]/g, "");
    return /^(?:\+?880|880|0)1[3-9]\d{8}$/.test(cleaned);
  };

  const handleCopy = (text: string, field: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsDemoModalOpen(false);
    };
    if (isDemoModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isDemoModalOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (!validateBDPhone(formData.phone)) {
      setPhoneError("একটি সঠিক 11 ডিজিটের বাংলাদেশি ফোন নম্বর দিন (যেমন: 017xxxxxxxx)");
      return;
    }

    setPhoneError("");
    setSubmitting(true);

    try {
      await fetch("/api/v2/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          number: formData.phone.trim(),
          projectType: "StorePage (E-Commerce ৳15,000)",
          address: formData.businessName.trim() || "Online Store Client",
          note: `StorePage Lead. Brand: ${formData.businessName.trim() || "N/A"}. Submitted from /storepage landing page.`,
        }),
      });
      setSubmitted(true);
    } catch (err) {
      console.warn("API submission notice:", err);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>


      <div className="sp">
        {/* Navigation */}
        <div
          className="w"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "20px",
            paddingBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontWeight: 700,
              fontSize: "26px",
            }}
          >
            <Image
              src="/assets/e8d7b1bc09e2e2bff385ba623d2ca01a.png"
              alt="StorePage logo"
              width={48}
              height={48}
              style={{ borderRadius: "50%" }}
            />
            <span style={{ color: "#000000" }}>StorePage</span>
          </div>
          <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
            <a
              href="https://wa.me/8801602957691"
              target="_blank"
              rel="noopener noreferrer"
              className="wa-nav-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                minHeight: "44px",
                padding: "0 18px",
                borderRadius: "12px",
                border: "2px solid #25D366",
                color: "#1B6B3A",
                background: "#ffffff",
                fontWeight: 600,
                fontSize: "15px",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              <WhatsAppIcon size={18} color="#25D366" />
              <span className="wa-nav-text">WhatsApp: +8801602957691</span>
            </a>
            <a
              href="#order"
              className="btn"
              style={{ minHeight: "44px", fontSize: "16px", padding: "0px 22px", boxShadow: "none" }}
            >
              অর্ডার করুন
            </a>
          </div>
        </div>

        {/* Hero Section */}
        <div className="w" style={{ paddingTop: "48px", paddingBottom: "96px" }}>
          <div className="g2">
            <div style={{ display: "flex", flexDirection: "column", gap: "26px", alignItems: "flex-start" }}>
              <span className="tag">বার বার ল্যান্ডিং পেইজে টাকা নষ্ট হচ্ছে?</span>
              <h1 className="hh" style={{ fontSize: "56px", lineHeight: 1.18, fontWeight: 700 }}>
                যে প্রোডাক্টের Ads চালাবেন, <span style={{ color: "rgb(63, 109, 207)" }}>সেটার জন্যই আলাদা সেলস পেজ।</span>
              </h1>
              <p style={{ fontSize: "21px", color: "#44506B" }}>
                প্রতিটি প্রোডাক্ট জন্য নিজস্ব ল্যান্ডিং পেজ: একটাই পেইজ, একটাই অফার, একটাই অর্ডার বাটন। সাথে পূর্ণাঙ্গ অনলাইন শপও।
              </p>
              <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", color: "#0f1b3d", position: "relative" }}>
                <a href="#order" className="btn" style={{ minWidth: "160px" }}>
                  অর্ডার করুন
                </a>
                <button
                  type="button"
                  onClick={() => setIsDemoModalOpen(true)}
                  className="btn2"
                  style={{ cursor: "pointer" }}
                >
                  লাইভ ডেমো দেখুন
                </button>
              </div>
              <p style={{ fontSize: "16px", color: "#44506B" }}>
                একবারের ফি · মাসিক চার্জ নেই · ০% কমিশন
              </p>
            </div>
            {/* Live Landing Page Demo Frame */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #DDE5F5",
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 24px 56px rgba(63,109,207,.18)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 18px",
                  background: "#EEF2FB",
                  borderBottom: "1px solid #DDE5F5",
                  fontSize: "13px",
                  color: "#44506B",
                  gap: "8px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0, overflow: "hidden" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#FF5F56", display: "inline-block", flexShrink: 0 }}></span>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#FFBD2E", display: "inline-block", flexShrink: 0 }}></span>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#27C93F", display: "inline-block", flexShrink: 0 }}></span>
                  <span
                    style={{
                      marginLeft: "6px",
                      background: "#fff",
                      padding: "4px 10px",
                      borderRadius: "8px",
                      border: "1px solid #DDE5F5",
                      fontSize: "12px",
                      color: "#44506B",
                      fontFamily: "monospace",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "180px",
                    }}
                  >
                    storepage.codebiruni.com/p/demo
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDemoModalOpen(true)}
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#3F6DCF",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    font: "inherit",
                  }}
                >
                  ফুলস্ক্রিন ডেমো ↗
                </button>
              </div>
              <div
                className="hero-frame"
                style={{
                  position: "relative",
                  width: "100%",
                  height: "540px",
                  background: "#fff",
                  overflow: "hidden",
                }}
              >
                <iframe
                  src="https://storepage.codebiruni.com/step/6ad0a67d26bd6a83391bd604"
                  title="StorePage Live Landing Page Demo"
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    display: "block",
                  }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dark / Pain Points Section */}
        <div className="dark sec">
          <div className="w">
            <h2 style={{ maxWidth: "760px", marginBottom: "44px" }}>
              Ad এর ক্লিক আসে একটা প্রোডাক্টের জন্য, কিন্তু কাস্টমার পৌঁছায় পুরো ক্যাটালগে।
            </h2>
            <div className="g3">
              <div>
                <h3 style={{ fontSize: "22px", color: "#FFB38A" }}>ভিড়ে হারিয়ে যায়</h3>
                <p style={{ marginTop: "10px", color: "#C9D5F2", fontSize: "18px" }}>
                  ১০০ প্রোডাক্টের মাঝে কনফিউজড হয়ে কাস্টমার ফিরে যায়।
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: "22px", color: "#FFB38A" }}>বারবার খরচ</h3>
                <p style={{ marginTop: "10px", color: "#C9D5F2", fontSize: "18px" }}>
                  প্রতিটি নতুন প্রোডাক্টে আলাদা ল্যান্ডিং পেজ বানাতে সময় ও টাকা লাগে।
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: "22px", color: "#FFB38A" }}>রিটার্ন ও মাসিক চার্জ</h3>
                <p style={{ marginTop: "10px", color: "#C9D5F2", fontSize: "18px" }}>
                  ফেক অর্ডারে কুরিয়ার খরচ নষ্ট, তার ওপর সাবস্ক্রিপশন বা কমিশন।
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Section */}
        <div className="w sec" id="demo">
          <div style={{ textAlign: "center", maxWidth: "760px", margin: "0 auto 52px" }}>
            <span className="tag">মূল ফিচার</span>
            <h2 style={{ marginTop: "16px" }}>স্টোরে যোগ করুন একবার। কাস্টমার দেখবে নিজস্ব ল্যান্ডিং পেজ।</h2>
            <p style={{ marginTop: "14px", fontSize: "20px", color: "#44506B" }}>
              একই প্রোডাক্ট, দুই রকম অভিজ্ঞতা: স্টোরে ব্রাউজ করা, ল্যান্ডিং পেজে অর্ডার করা।
            </p>
          </div>
          <div className="g5">
            {/* 1. Store: Customer Browses */}
            <div>
              <div className="bf" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div
                  className="bar"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    gap: "8px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: 0, overflow: "hidden" }}>
                    <span className="dot" style={{ flexShrink: 0 }}></span>
                    <span className="dot" style={{ flexShrink: 0 }}></span>
                    <span className="dot" style={{ flexShrink: 0 }}></span>
                    <span
                      style={{
                        marginLeft: "6px",
                        background: "#fff",
                        padding: "2px 8px",
                        borderRadius: "6px",
                        border: "1px solid #DDE5F5",
                        fontSize: "12px",
                        fontFamily: "monospace",
                        color: "#44506B",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "180px",
                      }}
                    >
                      storepage.codebiruni.com/products
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDemoModalOpen(true)}
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#3F6DCF",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      font: "inherit",
                    }}
                  >
                    ভিজিট করুন ↗
                  </button>
                </div>
                <div
                  onClick={() => setIsDemoModalOpen(true)}
                  className="demo-store-frame"
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "460px",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#fff",
                    cursor: "pointer",
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setIsDemoModalOpen(true);
                  }}
                  title="ডেমো ও অ্যাডমিন বিস্তারিত দেখতে ক্লিক করুন"
                >
                  <Image
                    src="/assets/allproductpage.png"
                    alt="StorePage All Products"
                    fill
                    sizes="(max-width: 900px) 100vw, 560px"
                    style={{ objectFit: "contain", objectPosition: "top" }}
                  />
                </div>
              </div>
              <p style={{ textAlign: "center", marginTop: "14px", fontWeight: 600, color: "#44506B" }}>
                ১. স্টোর: কাস্টমার ব্রাউজ করে
              </p>
            </div>
            <div className="arr">
              <span className="pill">
                →
              </span>
            </div>
            {/* 2. Landing Page: Customer Orders */}
            <div>
              <div
                className="bf"
                style={{
                  border: "2px solid #3F6DCF",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  className="bar"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    gap: "8px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: 0, overflow: "hidden" }}>
                    <span className="dot" style={{ background: "#3F6DCF", flexShrink: 0 }}></span>
                    <span className="dot" style={{ background: "#3F6DCF", flexShrink: 0 }}></span>
                    <span className="dot" style={{ background: "#3F6DCF", flexShrink: 0 }}></span>
                    <span
                      style={{
                        marginLeft: "6px",
                        background: "#fff",
                        padding: "2px 8px",
                        borderRadius: "6px",
                        border: "1px solid #DDE5F5",
                        fontSize: "12px",
                        fontFamily: "monospace",
                        color: "#44506B",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "180px",
                      }}
                    >
                      storepage.codebiruni.com/step/...
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDemoModalOpen(true)}
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#3F6DCF",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      font: "inherit",
                    }}
                  >
                    ফুলস্ক্রিন ডেমো ↗
                  </button>
                </div>
                <div
                  className="demo-landing-frame"
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "460px",
                    background: "#fff",
                    overflow: "hidden",
                  }}
                >
                  <iframe
                    src="https://storepage.codebiruni.com/step/6ad0a67d26bd6a83391bd604"
                    title="StorePage Single Product Landing Page"
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                      display: "block",
                    }}
                    loading="lazy"
                  />
                </div>
              </div>
              <p style={{ textAlign: "center", marginTop: "14px", fontWeight: 600, color: "#3F6DCF" }}>
                ২. ল্যান্ডিং পেজ: কাস্টমার অর্ডার করে
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Features Section */}
        <div style={{ background: "#fff", borderTop: "1px solid #DDE5F5", borderBottom: "1px solid #DDE5F5" }} className="sec">
          <div className="w" style={{ display: "grid", gap: "88px" }}>
            <h2 style={{ maxWidth: "760px" }}>ড্যাশবোর্ডে যা দেখবেন, সবই অর্ডার বাঁচায় ও লাভ বাড়ায়</h2>

            {/* Item 1: Courier Booking */}
            <div className="g2 mob-full" style={{ width: "100%", maxWidth: "100%" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <span className="tag" style={{ alignSelf: "flex-start" }}>১-ক্লিকে কুরিয়ার বুকিং</span>
                <h3 style={{ fontSize: "30px", lineHeight: 1.3 }}>কপি-পেস্ট ছাড়া বুকিং, বারকোডসহ ইনভয়েস</h3>
                <p style={{ fontSize: "19px", color: "#44506B" }}>
                  পাঠাও ও স্টেডফাস্টে এক ক্লিকে পার্সেল বুক করুন এবং প্রফেশনাল ইনভয়েস প্রিন্ট করুন।
                </p>
              </div>
              <div className="bf">
                <div className="bar">ডেমো ডেটা · ইনভয়েস</div>
                <div style={{ padding: "20px", display: "grid", gap: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <b>#1024 · Ultra 2 Smartwatch</b>
                    <b style={{ color: "#3F6DCF" }}>৳২,৪৯০</b>
                  </div>
                  <div
                    style={{
                      height: "46px",
                      background: "repeating-linear-gradient(90deg,#0F1B3D 0 2px,#fff 2px 5px,#0F1B3D 5px 6px,#fff 6px 10px)",
                      borderRadius: "4px",
                    }}
                  ></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div className="btn" style={{ minHeight: "48px", fontSize: "16px", boxShadow: "none" }}>
                      পাঠাও বুক করুন
                    </div>
                    <div className="btn2" style={{ minHeight: "48px", fontSize: "16px" }}>
                      স্টেডফাস্ট
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Item 2: Instant Lead Capture */}
            <div className="g2">
              <div className="bf">
                <div className="bar">ডেমো ডেটা · লাইভ লিড</div>
                <div style={{ padding: "8px 20px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 0",
                      borderBottom: "1px solid #DDE5F5",
                    }}
                  >
                    <div>
                      <b>সাকিব হাসান</b>
                      <div style={{ fontSize: "14px", color: "#44506B" }}>Ultra 2 Smartwatch</div>
                    </div>
                    <span className="pill">অসম্পূর্ণ</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 0",
                      borderBottom: "1px solid #DDE5F5",
                    }}
                  >
                    <div>
                      <b>নুসরাত জাহান</b>
                      <div style={{ fontSize: "14px", color: "#44506B" }}>Cotton Panjabi</div>
                    </div>
                    <span className="chip ok">কনফার্মড</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 0",
                    }}
                  >
                    <div>
                      <b>রাকিব আহমেদ</b>
                      <div style={{ fontSize: "14px", color: "#44506B" }}>Power Bank</div>
                    </div>
                    <span className="pill">অসম্পূর্ণ</span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <span className="tag" style={{ alignSelf: "flex-start" }}>ইনস্ট্যান্ট লিড ক্যাপচার</span>
                <h3 style={{ fontSize: "30px", lineHeight: 1.3 }}>অর্ডার শেষ না করলেও নম্বর আপনার কাছে</h3>
                <p style={{ fontSize: "19px", color: "#44506B" }}>
                  নাম বা নম্বর টাইপ করলেই লিড ড্যাশবোর্ডে। সাথে সাথে কল দিয়ে ড্রপ হওয়া কাস্টমার ফিরিয়ে আনুন।
                </p>
              </div>
            </div>

            {/* Item 3: Ad Tracking & Analytics */}
            <div className="g2">
              <div className="bf">
                <div className="bar">ডেমো ডেটা · রিয়েল-টাইম অ্যানালিটিক্স</div>
                <div style={{ padding: "20px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                    <div className="tile">
                      অর্ডার<br />
                      <b style={{ fontSize: "22px" }}>১২৮</b>
                    </div>
                    <div className="tile">
                      নেট প্রফিট<br />
                      <b style={{ fontSize: "22px", color: "#3F6DCF" }}>৳৪৮,৫০০</b>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", height: "110px" }}>
                    <div style={{ flex: 1, height: "40%", background: "#BFD0F7", borderRadius: "6px" }}></div>
                    <div style={{ flex: 1, height: "55%", background: "#BFD0F7", borderRadius: "6px" }}></div>
                    <div style={{ flex: 1, height: "48%", background: "#BFD0F7", borderRadius: "6px" }}></div>
                    <div style={{ flex: 1, height: "75%", background: "#7F9FE0", borderRadius: "6px" }}></div>
                    <div style={{ flex: 1, height: "68%", background: "#7F9FE0", borderRadius: "6px" }}></div>
                    <div style={{ flex: 1, height: "100%", background: "#3F6DCF", borderRadius: "6px" }}></div>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <span className="tag" style={{ alignSelf: "flex-start" }}>অ্যাড ট্র্যাকিং ও অ্যানালিটিক্স</span>
                <h3 style={{ fontSize: "30px", lineHeight: 1.3 }}>কোন প্রোডাক্ট লাভ দিচ্ছে, এক নজরে</h3>
                <p style={{ fontSize: "19px", color: "#44506B" }}>
                  Meta Pixel, Conversion API ও GA4 সহ রিয়েল-টাইম সেলস ও নেট প্রফিট রিপোর্ট।
                </p>
              </div>
            </div>

            {/* Item 4: Mobile App (PWA) */}
            <div className="g2">
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <span className="tag" style={{ alignSelf: "flex-start" }}>মোবাইল অ্যাপ (PWA)</span>
                <h3 style={{ fontSize: "30px", lineHeight: 1.3 }}>কাস্টমার ফোনে অ্যাপের মতো ইনস্টল করবে</h3>
                <p style={{ fontSize: "19px", color: "#44506B" }}>
                  প্লে স্টোরের ঝামেলা ছাড়াই। Next.js 15 ও React 19 দিয়ে তৈরি, তাই পেজ পলকে লোড হয়।
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  backgroundColor: "transparent",
                  width: "100%",
                  maxWidth: "471px",
                  margin: "0 auto",
                }}
              >
                <div
                  style={{
                    width: "240px",
                    height: "480px",
                    border: "8px solid #16295C",
                    borderRadius: "36px",
                    background: "#000",
                    overflow: "hidden",
                    boxShadow: "0 24px 48px rgba(22,41,92,.25)",
                    position: "relative",
                  }}
                >
                  <Image
                    src="/assets/appss.jpeg"
                    alt="StorePage Mobile App (PWA)"
                    fill
                    style={{ objectFit: "cover", objectPosition: "top" }}
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Item 5: Instant Telegram Order Notice */}
            <div className="g2">
              <div className="bf">
                <div
                  className="bar"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span className="dot" style={{ background: "#229ED9" }}></span>
                    <span className="dot" style={{ background: "#229ED9" }}></span>
                    <span className="dot" style={{ background: "#229ED9" }}></span>
                    <span style={{ marginLeft: "8px", fontWeight: 600 }}>ডেমো ডেটা · টেলিগ্রাম বট নোটিশ</span>
                  </div>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      color: "#229ED9",
                      fontWeight: 600,
                      fontSize: "12px",
                      background: "#E8F2FD",
                      padding: "2px 8px",
                      borderRadius: "6px",
                    }}
                  >
                    <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#229ED9" }}></span>
                    Telegram Live
                  </span>
                </div>
                <div style={{ padding: "18px 20px", display: "grid", gap: "12px", background: "#F5F8FC" }}>
                  <div
                    style={{
                      background: "#fff",
                      border: "1px solid #DDE5F5",
                      borderRadius: "14px",
                      padding: "16px",
                      boxShadow: "0 4px 14px rgba(34,158,217,0.12)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                          style={{
                            width: "34px",
                            height: "34px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #2AABEE, #229ED9)",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "17px",
                            fontWeight: 700,
                          }}
                        >
                          ✈
                        </div>
                        <div>
                          <b style={{ fontSize: "15px", color: "#0F1B3D" }}>StorePage Order Bot</b>
                          <div style={{ fontSize: "11px", color: "#229ED9", fontWeight: 600 }}>BOT · এইমাত্র প্রাপ্ত</div>
                        </div>
                      </div>
                      <span className="chip ok" style={{ fontSize: "12px" }}>নতুন অর্ডার #1025</span>
                    </div>

                    <div
                      style={{
                        fontSize: "14px",
                        lineHeight: "1.65",
                        color: "#1F2D4D",
                        borderTop: "1px solid #EEF2FB",
                        paddingTop: "10px",
                        display: "grid",
                        gap: "4px",
                      }}
                    >
                      <div><b>🛍 প্রোডাক্ট:</b> Ultra 2 Smartwatch</div>
                      <div><b>💰 মোট মূল্য:</b> <span style={{ color: "#3F6DCF", fontWeight: 700 }}>৳২,৪৯০</span> (ক্যাশ অন ডেলিভারি)</div>
                      <div><b>👤 কাস্টমার:</b> সাকিব হাসান</div>
                      <div><b>📱 ফোন:</b> 01712-XXXXXX</div>
                      <div><b>📍 ঠিকানা:</b> বাড়ি #১২, রোড #৪, মিরপুর ১০, ঢাকা</div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "8px",
                        marginTop: "12px",
                        paddingTop: "10px",
                        borderTop: "1px solid #EEF2FB",
                      }}
                    >
                      <div
                        style={{
                          background: "#E8F2FD",
                          color: "#229ED9",
                          borderRadius: "8px",
                          padding: "8px 12px",
                          fontSize: "13px",
                          fontWeight: 600,
                          textAlign: "center",
                          cursor: "pointer",
                        }}
                      >
                        ১-ক্লিকে কল দিন 📞
                      </div>
                      <div
                        onClick={() => setIsDemoModalOpen(true)}
                        style={{
                          background: "#3F6DCF",
                          color: "#fff",
                          borderRadius: "8px",
                          padding: "8px 12px",
                          fontSize: "13px",
                          fontWeight: 600,
                          textAlign: "center",
                          cursor: "pointer",
                        }}
                      >
                        ড্যাশবোর্ডে দেখুন ↗
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <span className="tag" style={{ alignSelf: "flex-start", background: "#E5F4FB", color: "#1C88BD" }}>
                  ইনস্ট্যান্ট টেলিগ্রাম অ্যালার্ট
                </span>
                <h3 style={{ fontSize: "30px", lineHeight: 1.3 }}>
                  অর্ডার আসার সাথে সাথে টেলিগ্রামে নোটিফিকেশন
                </h3>
                <p style={{ fontSize: "19px", color: "#44506B" }}>
                  কাস্টমার অর্ডার প্লেস করা মাত্রই ১ সেকেন্ডে অ্যাডমিন ও ম্যানেজমেন্টের টেলিগ্রাম গ্রুপে চলে আসবে সম্পূর্ণ বিবরণ। কোনো অর্ডার আর মিস হবে না — সাথে সাথে কল দিয়ে কনফার্ম করে দ্রুত ডেলিভারি নিশ্চিত করুন।
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Offer Section */}
        <div className="dark sec" id="offer">
          <div className="w" style={{ textAlign: "center" }}>
            <span className="pill">লঞ্চ অফার · প্রথম ৫০ জনের জন্য</span>
            <h2 style={{ marginTop: "20px" }}>৳১৮,০০০ ভ্যালুর বোনাস, সম্পূর্ণ ফ্রি</h2>
            <div className="g3" style={{ marginTop: "44px", textAlign: "left" }}>
              <div style={{ border: "1px solid rgba(255,255,255,.18)", borderRadius: "20px", padding: "28px" }}>
                <span className="pill">মূল্য ৳৮,০০০ — ফ্রি</span>
                <h3 style={{ fontSize: "21px", marginTop: "14px" }}>ইনস্টলযোগ্য মোবাইল অ্যাপ (PWA)</h3>
                <p style={{ marginTop: "8px", color: "#C9D5F2", fontSize: "17px" }}>
                  প্লে স্টোর ছাড়াই কাস্টমার অ্যাপের মতো ওয়েবসাইট ইনস্টল করবে।
                </p>
              </div>
              <div style={{ border: "1px solid rgba(255,255,255,.18)", borderRadius: "20px", padding: "28px" }}>
                <span className="pill">মূল্য ৳৬,০০০ — ফ্রি</span>
                <h3 style={{ fontSize: "21px", marginTop: "14px" }}>১ বছর টেকনিক্যাল সাপোর্ট</h3>
                <p style={{ marginTop: "8px", color: "#C9D5F2", fontSize: "17px" }}>
                  যেকোনো সমস্যায় সরাসরি ডেভেলপার সাপোর্ট ও মেইনটেন্যান্স।
                </p>
              </div>
              <div style={{ border: "1px solid rgba(255,255,255,.18)", borderRadius: "20px", padding: "28px" }}>
                <span className="pill">মূল্য ৳৪,০০০ — ফ্রি</span>
                <h3 style={{ fontSize: "21px", marginTop: "14px" }}>১ বছরের ডোমেইন ও হোস্টিং</h3>
                <p style={{ marginTop: "8px", color: "#C9D5F2", fontSize: "17px" }}>
                  সার্ভার কনফিগারেশন ও এসএসএল সিকিউরিটিসহ সম্পূর্ণ সেটআপ।
                </p>
              </div>
            </div>
            <div
              style={{
                margin: "48px auto 0",
                maxWidth: "520px",
                background: "#fff",
                color: "#0F1B3D",
                borderRadius: "24px",
                padding: "36px",
              }}
            >
              <s style={{ color: "#6B7690", fontSize: "22px" }}>৳২৫,০০০</s>
              <div style={{ fontSize: "64px", fontWeight: 700, color: "#3F6DCF", lineHeight: 1.1 }}>৳১৫,০০০</div>
              <p style={{ fontWeight: 600, marginBottom: "20px" }}>একবারের পেমেন্ট</p>
              <div style={{ display: "grid", gap: "12px", textAlign: "left", marginBottom: "26px" }}>
                <div className="ck">মাসিক সাবস্ক্রিপশন নেই</div>
                <div className="ck">বিক্রিতে ০% কমিশন</div>
                <div className="ck">ইনস্ট্যান্ট টেলিগ্রাম অর্ডার নোটিফিকেশন</div>
                <div className="ck">২৪-৪৮ ঘণ্টায় ওয়েবসাইট লাইভ</div>
              </div>
              <a href="#order" className="btn" style={{ width: "100%", color: "#ffffff" }}>
                এখনই আপনার স্লট নিন
              </a>
              <p style={{ marginTop: "14px", fontSize: "15px", color: "#44506B" }}>
                অগ্রিম পেমেন্ট ছাড়াই আলোচনা করুন
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="w sec" style={{ maxWidth: "860px", paddingBottom: "72px" }}>
          <h2 style={{ textAlign: "center", marginBottom: "36px" }}>সচরাচর জিজ্ঞাসিত প্রশ্ন</h2>
          <div style={{ display: "grid", gap: "12px" }}>
            <details>
              <summary>নিজে প্রোডাক্ট, ক্যাটাগরি ও দাম পরিবর্তন করতে পারব?</summary>
              <p style={{ marginTop: "10px", color: "#44506B" }}>হ্যাঁ। ড্যাশবোর্ড থেকে সবকিছু নিজেই ম্যানেজ করতে পারবেন।</p>
            </details>
            <details>
              <summary>নতুন অর্ডার আসলে আমি সাথে সাথে নোটিফিকেশন পাব?</summary>
              <p style={{ marginTop: "10px", color: "#44506B" }}>হ্যাঁ! কাস্টমার অর্ডার প্লেস করা মাত্রই ১ সেকেন্ডে অ্যাডমিন ও ম্যানেজমেন্টের টেলিগ্রাম গ্রুপে সম্পূর্ণ কাস্টমার ডিটেইলস সহ অ্যালার্ট চলে যাবে।</p>
            </details>
            <details>
              <summary>পাঠাও ও স্টেডফাস্ট কুরিয়ার কীভাবে যুক্ত হয়?</summary>
              <p style={{ marginTop: "10px", color: "#44506B" }}>সেটআপের সময় আমরাই আপনার কুরিয়ার অ্যাকাউন্ট যুক্ত করে দিই।</p>
            </details>
            <details>
              <summary>১৫,০০০ টাকার পর কোনো হিডেন খরচ আছে কি?</summary>
              <p style={{ marginTop: "10px", color: "#44506B" }}>না। এটি একবারের ফি, মাসিক চার্জ নেই।</p>
            </details>
            <details>
              <summary>ওয়েবসাইট ডেলিভারিতে কতদিন লাগবে?</summary>
              <p style={{ marginTop: "10px", color: "#44506B" }}>সর্বোচ্চ ২৪-৪৮ ঘণ্টার মধ্যে ওয়েবসাইট লাইভ।</p>
            </details>
          </div>
        </div>

        {/* Order Form Section */}
        <div style={{ background: "#3F6DCF", color: "#fff" }} className="sec" id="order">
          <div className="w">
            <div className="g2">
              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <h2>আপনার পরের অ্যাডের আগেই StorePage সেট করে নিন</h2>
                <p style={{ fontSize: "20px" }}>
                  ফর্ম পূরণ করুন। আমরা সর্বোচ্চ ২ ঘণ্টার মধ্যে কল করে ডেমো দেখাব এবং সেটআপ বুঝিয়ে দেব।
                </p>
                <a
                  href="https://wa.me/8801602957691"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    background: "#ffffff",
                    color: "#3F6DCF",
                    fontWeight: 700,
                    fontSize: "18px",
                    minHeight: "52px",
                    padding: "0 28px",
                    borderRadius: "14px",
                    textDecoration: "none",
                    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.12)",
                    width: "fit-content",
                    transition: "transform 0.15s ease",
                  }}
                >
                  <WhatsAppIcon size={22} color="#25D366" />
                  <span>WhatsApp করুন: +8801602957691</span>
                </a>
              </div>
              <form
                onSubmit={handleSubmit}
                style={{
                  background: "#fff",
                  color: "#0F1B3D",
                  borderRadius: "22px",
                  padding: "30px",
                  display: "grid",
                  gap: "14px",
                }}
              >
                <label style={{ fontWeight: 600 }}>
                  আপনার নাম *
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="যেমন: সাকিব হাসান"
                    style={{ marginTop: "6px" }}
                  />
                </label>
                <label style={{ fontWeight: 600 }}>
                  মোবাইল / WhatsApp নম্বর *
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (phoneError) setPhoneError("");
                    }}
                    placeholder="017xxxxxxxx"
                    style={{
                      marginTop: "6px",
                      borderColor: phoneError ? "#ef4444" : undefined,
                    }}
                  />
                  {phoneError && (
                    <span
                      style={{
                        display: "block",
                        color: "#ef4444",
                        fontSize: "12px",
                        marginTop: "5px",
                        fontWeight: 500,
                      }}
                    >
                      {phoneError}
                    </span>
                  )}
                </label>
                <label style={{ fontWeight: 600 }}>
                  আপনার ব্র্যান্ডের নাম (ঐচ্ছিক)
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="যেমন: Smart Store BD"
                    style={{ marginTop: "6px" }}
                  />
                </label>
                <button
                  type="submit"
                  disabled={submitting || submitted}
                  className="btn"
                  style={{
                    border: 0,
                    cursor: submitting ? "not-allowed" : submitted ? "default" : "pointer",
                    fontFamily: "inherit",
                    opacity: submitting ? 0.7 : 1,
                    background: submitted ? "#059669" : undefined,
                    color: submitted ? "#ffffff" : undefined,
                    transition: "all 0.25s ease",
                  }}
                >
                  {submitting
                    ? "পাঠানো হচ্ছে..."
                    : submitted
                    ? "✓ ধন্যবাদ! তথ্য সাবমিট হয়েছে"
                    : "১৫,০০০ টাকায় অর্ডার করুন"}
                </button>
                {submitted ? (
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#059669",
                      textAlign: "center",
                      fontWeight: 600,
                      margin: 0,
                    }}
                  >
                    ✓ আপনার তথ্য সফলভাবে জমা হয়েছে। আমরা শীঘ্রই যোগাযোগ করব।
                  </p>
                ) : (
                  <p style={{ fontSize: "15px", color: "#44506B", textAlign: "center", margin: 0 }}>
                    অগ্রিম পেমেন্ট ছাড়াই আলোচনা করুন
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="w"
          style={{
            paddingTop: "28px",
            paddingBottom: "28px",
            textAlign: "center",
            color: "#44506B",
            fontSize: "15px",
          }}
        >
          © 2026 Code Biruni. All rights reserved
        </div>

        {/* Demo Credentials Modal */}
        {isDemoModalOpen && (
          <div
            onClick={() => setIsDemoModalOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(15, 27, 61, 0.72)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 999999,
              padding: "16px",
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#ffffff",
                borderRadius: "24px",
                maxWidth: "500px",
                width: "100%",
                boxShadow: "0 24px 64px rgba(15, 27, 61, 0.35)",
                overflow: "hidden",
                position: "relative",
                animation: "spModalFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  background: "#16295C",
                  color: "#ffffff",
                  padding: "24px 28px",
                  position: "relative",
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsDemoModalOpen(false)}
                  aria-label="Close"
                  style={{
                    position: "absolute",
                    top: "18px",
                    right: "18px",
                    background: "rgba(255, 255, 255, 0.12)",
                    border: "none",
                    color: "#ffffff",
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    fontSize: "18px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ✕
                </button>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "12px",
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "99px",
                    background: "rgba(255, 255, 255, 0.15)",
                    marginBottom: "8px",
                  }}
                >
                  লাইভ ডেমো অ্যাক্সেস
                </span>
                <h3 style={{ fontSize: "22px", fontWeight: 700, margin: 0, color: "#fff" }}>
                  StorePage ডেমো ও অ্যাডমিন লগইন
                </h3>
                <p style={{ margin: "6px 0 0", color: "#C9D5F2", fontSize: "14px" }}>
                  নিচের ক্রেডেনশিয়াল দিয়ে ওয়েবসাইট ও অ্যাডমিন টেস্ট করুন:
                </p>
              </div>

              {/* Body */}
              <div style={{ padding: "24px 28px", display: "grid", gap: "14px" }}>
                {/* Website */}
                <div
                  style={{
                    background: "#F4F7FD",
                    border: "1px solid #DDE5F5",
                    borderRadius: "12px",
                    padding: "12px 14px",
                  }}
                >
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#44506B", marginBottom: "4px" }}>
                    ওয়েবসাইট URL
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontFamily: "monospace", fontSize: "15px", fontWeight: 700, color: "#0F1B3D" }}>
                      storepage.codebiruni.com
                    </span>
                    <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={() => handleCopy("https://storepage.codebiruni.com", "url")}
                        style={{
                          background: copiedField === "url" ? "#DFF3E6" : "#ffffff",
                          color: copiedField === "url" ? "#1B6B3A" : "#3F6DCF",
                          border: "1px solid #DDE5F5",
                          padding: "5px 12px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {copiedField === "url" ? "✓ কপি হয়েছে" : "কপি"}
                      </button>
                      <a
                        href="https://storepage.codebiruni.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: "#3F6DCF",
                          color: "#ffffff",
                          padding: "5px 12px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: 600,
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        ভিজিট ↗
                      </a>
                    </div>
                  </div>
                </div>

                {/* User */}
                <div
                  style={{
                    background: "#F4F7FD",
                    border: "1px solid #DDE5F5",
                    borderRadius: "12px",
                    padding: "12px 14px",
                  }}
                >
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#44506B", marginBottom: "4px" }}>
                    ইউজারনেম (User)
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontFamily: "monospace", fontSize: "15px", fontWeight: 700, color: "#0F1B3D" }}>
                      superadmin@online.shop
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy("superadmin@online.shop", "user")}
                      style={{
                        background: copiedField === "user" ? "#DFF3E6" : "#ffffff",
                        color: copiedField === "user" ? "#1B6B3A" : "#3F6DCF",
                        border: "1px solid #DDE5F5",
                        padding: "5px 14px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    >
                      {copiedField === "user" ? "✓ কপি হয়েছে" : "কপি"}
                    </button>
                  </div>
                </div>

                {/* Password */}
                <div
                  style={{
                    background: "#F4F7FD",
                    border: "1px solid #DDE5F5",
                    borderRadius: "12px",
                    padding: "12px 14px",
                  }}
                >
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#44506B", marginBottom: "4px" }}>
                    পাসওয়ার্ড (Password)
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontFamily: "monospace", fontSize: "15px", fontWeight: 700, color: "#C94B0E" }}>
                      Storepage123&
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy("Storepage123&", "pass")}
                      style={{
                        background: copiedField === "pass" ? "#DFF3E6" : "#ffffff",
                        color: copiedField === "pass" ? "#1B6B3A" : "#3F6DCF",
                        border: "1px solid #DDE5F5",
                        padding: "5px 14px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    >
                      {copiedField === "pass" ? "✓ কপি হয়েছে" : "কপি"}
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "grid", gap: "10px", marginTop: "4px" }}>
                  <a
                    href="https://storepage.codebiruni.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                    style={{ width: "100%", minHeight: "48px", fontSize: "16px", color: "#ffffff" }}
                  >
                    সরাসরি ডেমো ওয়েবসাইট ওপেন করুন ↗
                  </a>
                  <a
                    href="https://wa.me/8801602957691"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn2"
                    style={{
                      width: "100%",
                      minHeight: "46px",
                      fontSize: "15px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    <WhatsAppIcon size={18} color="#25D366" />
                    <span>WhatsApp-এ সহায়তা নিন (+8801602957691)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}