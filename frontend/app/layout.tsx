import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "AI CRM - Intelligent Sales Pipeline & Lead Scoring",
    template: "%s | AI CRM"
  },
  description: "Revolutionize your sales process with AI-powered lead scoring, automated insights, and smart pipeline management. Close more deals with data-driven decisions.",
  keywords: ["CRM", "AI", "Lead Scoring", "Sales Pipeline", "Sales Intelligence", "Automation", "Business Intelligence"],
  authors: [{ name: "AI CRM Team" }],
  creator: "AI CRM",
  publisher: "AI CRM",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://ai-crm-olj.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AI CRM - Intelligent Sales Pipeline & Lead Scoring",
    description: "Revolutionize your sales process with AI-powered lead scoring, automated insights, and smart pipeline management.",
    url: "https://ai-crm-olj.vercel.app",
    siteName: "AI CRM",
    images: [
      {
        url: "/og-image.png", 
        width: 1200,
        height: 630,
        alt: "AI CRM Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI CRM - Intelligent Sales Pipeline & Lead Scoring",
    description: "Revolutionize your sales process with AI-powered lead scoring, automated insights, and smart pipeline management.",
    images: ["/og-image.png"], 
    creator: "@aicrm",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png" },
    ],
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "512x512",
        url: "/android-chrome-512x512.png",
      },
    ]
  },
  manifest: "/site.webmanifest",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased bg-background text-foreground`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
