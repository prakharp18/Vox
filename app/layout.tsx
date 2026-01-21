import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { CustomCursor } from "@/components/custom-cursor";
import { SmoothScrolling } from "@/components/smooth-scrolling";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vox | Anonymous Feedback",
  description: "Share your thoughts anonymously.",
  generator: "Next.js",
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
          suppressHydrationWarning
        >
          <SmoothScrolling>
            <CustomCursor />
            {children}
          </SmoothScrolling>
          <Analytics />
          <Toaster richColors />
        </body>
      </AuthProvider>
    </html>
  );
}
