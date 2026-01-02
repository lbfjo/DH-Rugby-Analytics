import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

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
        <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-8">
                <Link
                  href="/dashboard"
                  className="text-xl font-bold text-green-700 dark:text-green-500"
                >
                  Rugby Analytics
                </Link>
                <div className="hidden md:flex space-x-4">
                  <Link
                    href="/dashboard"
                    className="text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-500 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/teams"
                    className="text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-500 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Equipas
                  </Link>
                  <Link
                    href="/matches"
                    className="text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-500 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Jogos
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
