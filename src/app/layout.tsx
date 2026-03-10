import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AuraSci — AI-Powered Open Science Funding",
  description: "Milestone-based open science funding infrastructure powered by AI Agents. From proof to capital.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-white text-gray-900">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-orange-100 bg-white/90 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-emerald-400 flex items-center justify-center shadow-[0_8px_24px_rgba(249,115,22,0.22)]">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-lg font-semibold tracking-tight text-gray-900">
                Aura<span className="text-orange-500">Sci</span>
              </span>
            </a>

            {/* Nav links */}
            <div className="flex items-center gap-6">
              <a href="/market" className="text-sm text-gray-600 hover:text-orange-600 transition-colors">
                Market
              </a>
              <a href="/dashboard/patron" className="text-sm text-gray-600 hover:text-orange-600 transition-colors">
                Portfolio
              </a>
              <span className="text-sm text-gray-300 cursor-not-allowed" title="Phase 1 暂不支持">
                Governance
              </span>
              <span className="text-sm text-gray-300 cursor-not-allowed" title="Phase 1 暂不支持">
                Leaderboard
              </span>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
