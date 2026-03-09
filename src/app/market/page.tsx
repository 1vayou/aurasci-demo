"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Sparkles,
  Search,
  Filter,
  Flame,
} from "lucide-react";
import { useAppStore } from "@/store";
import ActivityFeed from "@/components/ActivityFeed";
import SeasonLeaderboard from "@/components/SeasonLeaderboard";

export default function Market() {
  const router = useRouter();
  const intents = useAppStore((s) => s.intents);
  const scientists = useAppStore((s) => s.scientists);

  const publishedIntents = useMemo(
    () =>
      intents.filter(
        (i) =>
          i.status === "published" ||
          i.status === "funded" ||
          i.status === "completed"
      ),
    [intents]
  );

  const getScientist = (id: string) => scientists.find((s) => s.id === id);

  return (
    <div className="min-h-screen hero-gradient grid-pattern py-12 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-200 bg-orange-50 mb-6">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-medium text-orange-600 tracking-wide uppercase">
              Research Market
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Discover{" "}
            <span className="bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">
              AI-Verified
            </span>{" "}
            Research
          </h1>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto">
            Browse milestone-based research intents screened by AI Gatekeeper.
            Provide patronage to promising science.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ===== LEFT: Cards ===== */}
          <div className="flex-1 min-w-0">
            {/* Search bar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search intents..."
                  disabled
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange-300 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <button
                disabled
                className="px-5 py-3 rounded-xl bg-white border border-gray-200 text-gray-500 text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>

            {/* Empty State */}
            {publishedIntents.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/[0.02] border border-white/[0.08] flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-white/20" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Intents Published Yet
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  Be the first scientist to publish a research intent!
                </p>
                <button
                  onClick={() => router.push("/onboarding/scientist")}
                  className="px-6 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm font-medium hover:bg-emerald-100 transition-all"
                >
                  Become a Scientist
                </button>
              </div>
            )}

            {/* Cards Grid */}
            {publishedIntents.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {publishedIntents.map((intent) => {
                  const scientist = getScientist(intent.scientistId);
                  const fundingPct =
                    intent.fundingGoalUSDC > 0
                      ? (intent.escrowedAmountUSDC / intent.fundingGoalUSDC) *
                        100
                      : 0;

                  return (
                    <button
                      key={intent.id}
                      onClick={() => router.push(`/intent/${intent.id}`)}
                      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 text-left transition-all duration-500 hover:scale-[1.02] hover:border-orange-300 aura-shadow"
                    >
                      {/* Top accent */}
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Header: Ticker + Badges */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className="text-xl font-bold font-mono text-gray-900">
                            {intent.ticker}
                          </span>
                          {intent.aiScore && (
                            <span className="ml-2 text-[10px] text-gray-500 font-mono">
                              AI {intent.aiScore}/100
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          {intent.trendingRank &&
                            intent.trendingRank <= 5 && (
                              <Flame className="w-3.5 h-3.5 text-orange-500" />
                            )}
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                            <ShieldCheck className="w-3 h-3 text-emerald-600 green-shield shield-pulse" />
                            <span className="text-[9px] font-medium text-emerald-600">
                              AI Screened
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 leading-snug">
                        {intent.title}
                      </h3>

                      {/* Tags */}
                      {intent.tags && intent.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {intent.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-gray-50 border border-gray-200 text-gray-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Scientist */}
                      {scientist && (
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center border border-emerald-300">
                            <span className="text-[8px] text-emerald-700 font-bold">
                              {scientist.fullName.charAt(0)}
                            </span>
                          </div>
                          <span className="text-xs text-gray-600">
                            {scientist.fullName}
                          </span>
                          <ShieldCheck className="w-3 h-3 text-emerald-500 green-shield" />
                        </div>
                      )}

                      {/* Funding */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Funding</span>
                          <span className="text-gray-700 font-mono">
                            ${intent.escrowedAmountUSDC.toLocaleString()} / $
                            {intent.fundingGoalUSDC.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all"
                            style={{
                              width: `${Math.min(fundingPct, 100)}%`,
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-500">
                          <span>
                            {intent.milestones.length} milestones
                          </span>
                          {intent.supporterCount && (
                            <span>
                              {intent.supporterCount.toLocaleString()} supporters
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Hover arrow */}
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <TrendingUp className="w-4 h-4 text-orange-500" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Bottom CTA */}
            {publishedIntents.length > 0 && (
              <div className="mt-12 text-center">
                <p className="text-gray-600 text-sm mb-4">
                  Are you a scientist with breakthrough research?
                </p>
                <button
                  onClick={() => router.push("/onboarding/scientist")}
                  className="px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 hover:border-orange-300 transition-all"
                >
                  Publish Your Intent
                </button>
              </div>
            )}
          </div>

          {/* ===== RIGHT: Leaderboard + Activity Feed Sidebar ===== */}
          <div className="lg:w-[320px] space-y-6">
            <SeasonLeaderboard intents={publishedIntents} />
            <div className="lg:sticky lg:top-20">
              <ActivityFeed maxItems={15} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
