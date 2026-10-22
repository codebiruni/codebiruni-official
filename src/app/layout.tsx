import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HomeNav from "./default/home-nav/HomeNav";
import { ThemeProvider } from "next-themes";
import HomeFooter from "./default/Footer/HomeFooter";
import ChatbotComponent from "./setup/ChatbotComponent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "Code Biruni - Custom Software Development & IT Solutions",
    template: "%s | Code Biruni",
  },
  description:
    "Code Biruni delivers cutting-edge custom software development, web applications, and digital transformation solutions for businesses worldwide.",
  keywords: [
    "software development",
    "web development",
    "custom software",
    "IT solutions",
    "digital transformation",
    "app development",
    "cloud solutions",
    "Code Biruni",
    "code biruni",
    "code biruny",
    "Code Biruny",
    "technology consulting",
  ],
  authors: [{ name: "Code Biruni", url: "https://www.codebiruni.com" }],
  creator: "Code Biruni",
  publisher: "Code Biruni",
  metadataBase: new URL("https://www.codebiruni.com"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },
  openGraph: {
    title: "Code Biruni - Building Digital Bridges Worldwide",
    description:
      "Custom software development and IT solutions tailored to your business needs.",
    url: "https://www.codebiruni.com",
    siteName: "Code Biruni",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Code Biruni - Digital Solutions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Code Biruni - Building Digital Bridges Worldwide",
    description:
      "Custom software development and IT solutions tailored to your business needs.",
    images: ["/logo.png"],
    creator: "@codebiruni",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "548jsiiwBxZPY3ss4bgLIk-tirGmZGrJTzHE0DKx2Uo",
    other: {
      "msvalidate.01": "YOUR_BING_VERIFICATION_CODE",
      "yandex-verification": "YOUR_YANDEX_VERIFICATION_CODE",
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/logo.png",
    },
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to important third-party origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <meta name="google-site-verification" content="Z8oAFw8y6ky4yW-iPN7L-BX_pBYFksEbvWLx7gYYLg8" />

        {/* Favicon links */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="any" />
        <link rel="apple-touch-icon" href="/logo.png" />

        {/* Mobile viewport optimization */}
        <meta name="mobile-web-app-capable" content="yes" />

        {/* PWA tags */}
        <meta name="application-name" content="Code Biruni" />
        <meta name="apple-mobile-web-app-title" content="Code Biruni" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />

        {/* Microsoft tags */}
        <meta name="msapplication-TileColor" content="#ffffff" />

        {/* Additional verification */}
        <meta
          name="google-site-verification"
          content="548jsiiwBxZPY3ss4bgLIk-tirGmZGrJTzHE0DKx2Uo"
        />

        {/* Structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Code Biruni",
            url: "https://www.codebiruni.com",
            logo: "https://www.codebiruni.com/logo.png",
            description:
              "Custom software development and IT solutions provider",
            sameAs: [
              "https://twitter.com/codebiruny",
              "https://linkedin.com/company/codebiruny",
            ],
          })}
        </script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <HomeNav />
          <ChatbotComponent />
          <div>{children}</div>
          <HomeFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
