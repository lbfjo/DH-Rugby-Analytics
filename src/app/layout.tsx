import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { MobileNav } from "@/components/ui/MobileNav";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Rugby Analytics Dashboard",
  description: "Analytics dashboard for Portuguese rugby championship",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <nav className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 md:h-16">
              <Link
                href="/dashboard"
                className="text-lg md:text-xl font-bold text-green-700 dark:text-green-500"
              >
                Rugby Analytics
              </Link>
              <MobileNav />
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 md:py-8">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
