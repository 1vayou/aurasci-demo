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
      <body className="antialiased min-h-screen">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-lg font-semibold tracking-tight">
                Aura<span className="text-green-400">Sci</span>
              </span>
            </a>
            
            {/* Nav links */}
            <div className="flex items-center gap-6">
              <a href="/market" className="text-sm text-white/50 hover:text-white/80 transition-colors">
                Market
              </a>
              <a href="/dashboard/patron" className="text-sm text-white/50 hover:text-white/80 transition-colors">
                Portfolio
              </a>
              <span className="text-sm text-white/20 cursor-not-allowed" title="Phase 1 暂不支持">
                Governance
              </span>
              <span className="text-sm text-white/20 cursor-not-allowed" title="Phase 1 暂不支持">
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
