"use client";

import { useEffect, useRef, useState } from "react";
import WhatsAppIcon from "./WhatsAppIcon";

const SITE = "https://storepage.codebiruni.com";

const FIELDS = [
    { key: "url", label: "ওয়েবসাইট URL", value: "storepage.codebiruni.com", copy: SITE, visit: true },
    { key: "user", label: "ইউজারনেম (User)", value: "superadmin@online.shop", copy: "superadmin@online.shop" },
    { key: "pass", label: "পাসওয়ার্ড (Password)", value: "Storepage123&", copy: "Storepage123&", warm: true },
];

export default function DemoModal({ onClose }: { onClose: () => void }) {
    const [copied, setCopied] = useState<string | null>(null);
    const closeRef = useRef<HTMLButtonElement>(null);
    const timer = useRef<number | undefined>(undefined);

    useEffect(() => {
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        closeRef.current?.focus();
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = prevOverflow;
            window.clearTimeout(timer.current);
        };
    }, [onClose]);

    const copy = (text: string, key: string) => {
        navigator.clipboard?.writeText(text).catch(() => { });
        setCopied(key);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="md-overlay" onClick={onClose}>
            <div
                className="md-box"
                role="dialog"
                aria-modal="true"
                aria-labelledby="md-title"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="md-head">
                    <button
                        ref={closeRef}
                        type="button"
                        className="md-close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ✕
                    </button>
                    <span className="md-badge">লাইভ ডেমো অ্যাক্সেস</span>
                    <h3 id="md-title" className="md-title">StorePage ডেমো ও অ্যাডমিন লগইন</h3>
                    <p className="md-sub">নিচের ক্রেডেনশিয়াল দিয়ে ওয়েবসাইট ও অ্যাডমিন টেস্ট করুন:</p>
                </div>

                <div className="md-body">
                    {FIELDS.map((f) => (
                        <div className="md-field" key={f.key}>
                            <div className="md-label">{f.label}</div>
                            <div className="md-row">
                                <span className={`md-val${f.warm ? " warm" : ""}`}>{f.value}</span>
                                <div className="md-btns">
                                    <button
                                        type="button"
                                        className={`md-copy${copied === f.key ? " done" : ""}`}
                                        onClick={() => copy(f.copy, f.key)}
                                    >
                                        {copied === f.key ? "✓ কপি হয়েছে" : "কপি"}
                                    </button>
                                    {f.visit && (
                                        <a className="md-visit" href={SITE} target="_blank" rel="noopener noreferrer">
                                            ভিজিট ↗
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="md-actions">
                        <a className="btn md-full" href={SITE} target="_blank" rel="noopener noreferrer">
                            সরাসরি ডেমো ওয়েবসাইট ওপেন করুন ↗
                        </a>
                        <a
                            className="btn2 md-full md-wa"
                            href="https://wa.me/8801602957691"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <WhatsAppIcon size={18} color="#25D366" />
                            <span>WhatsApp-এ সহায়তা নিন (+8801602957691)</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}