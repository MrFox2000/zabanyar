import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const vazir = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazir",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "زبان‌یار — انگلیسی، بازی‌وار و پیوسته",
    template: "%s · زبان‌یار",
  },
  description:
    "زبان‌یار انگلیسی را با بازی یاد می‌دهد و هر درس را به درس‌های قبلی وصل می‌کند؛ برای فارسی‌زبان‌ها.",
  applicationName: "زبان‌یار",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }, { url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "زبان‌یار",
    description: "انگلیسی، بازی‌وار و پیوسته — ساخته‌شده برای فارسی‌زبان‌ها",
    locale: "fa_IR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f97316",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fa" dir="rtl" className={`${vazir.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
