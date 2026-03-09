"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  DollarSign,
  TrendingUp,
  Target,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Clock,
  Loader2,
  Gem,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useAppStore } from "@/store";
import ActivityFeed from "@/components/ActivityFeed";

export default function PatronDashboard() {
  const router = useRouter();
  const intents = useAppStore((s) => s.intents);

  // In a real app, we'd filter by current patron ID.
  // For MVP, treat all patronized intents as "mine".
  const backedIntents = useMemo(
    () => intents.filter((i) => (i.patrons?.length || 0) > 0),
    [intents]
  );

  // Metrics
  const totalPatronage = useMemo(
    () =>
      backedIntents.reduce((sum, i) => {
        const patronTotal =
          i.patrons?.reduce((s, p) => s + p.amountUSDC, 0) || 0;
        return sum + patronTotal;
      }, 0),
    [backedIntents]
  );

  const activeMilestones = useMemo(
    () =>
      backedIntents.reduce(
        (count, i) =>
          count +
          i.milestones.filter((m) => m.status === "in_progress").length,
        0
      ),
    [backedIntents]
  );

  const verifiedMilestones = useMemo(
    () =>
      backedIntents.reduce(
        (count, i) =>
          count +
          i.milestones.filter(
            (m) => m.status === "ai_verified" || m.status === "released"
          ).length,
        0
      ),
    [backedIntents]
  );

  return (
    <div className="min-h-screen hero-gradient grid-pattern py-12 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-200 bg-orange-50 mb-4">
            <Gem className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-medium text-orange-600 tracking-wide uppercase">
              Patron Dashboard
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Patronage Portfolio
          </h1>
          <p className="text-gray-600 text-sm">
            Track your funded research and milestone progress
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ===== LEFT: Main content ===== */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Total Patronage */}
              <div className="sci-fi-card p-5 bg-white border border-gray-200 aura-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-orange-500" />
                  </div>
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                    Total Patronage
                  </span>
                </div>
                <div className="text-2xl font-bold text-orange-500 font-mono">
                  ${totalPatronage.toLocaleString()}
                </div>
                <div className="text-[10px] text-gray-400 mt-1">USDC</div>
              </div>

              {/* Intents Backed */}
              <div className="sci-fi-card p-5 bg-white border border-gray-200 aura-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                  </div>
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                    Intents Backed
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900 font-mono">
                  {backedIntents.length}
                </div>
                <div className="text-[10px] text-gray-400 mt-1">Research Intents</div>
              </div>

              {/* Active Milestones */}
              <div className="sci-fi-card p-5 bg-white border border-gray-200 aura-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                    <Target className="w-5 h-5 text-orange-500" />
                  </div>
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                    Active Milestones
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900 font-mono">
                  {activeMilestones}
                </div>
                <div className="text-[10px] text-gray-400 mt-1">
                  {verifiedMilestones} verified
                </div>
              </div>
            </div>

            {/* Portfolio Cards */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-500" />
                My Portfolio
              </h2>

              {backedIntents.length === 0 ? (
                <div className="text-center py-16 rounded-2xl border border-gray-200 bg-white aura-shadow">
                  <Gem className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Patronage Yet
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">
                    Explore the market to fund promising research
                  </p>
                  <button
                    onClick={() => router.push("/market")}
                    className="px-6 py-3 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 text-sm font-medium hover:bg-orange-100 transition-all"
                  >
                    Explore Market
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {backedIntents.map((intent) => {
                    const myTotal =
                      intent.patrons?.reduce((s, p) => s + p.amountUSDC, 0) ||
                      0;
                    const fundingPct =
                      intent.fundingGoalUSDC > 0
                        ? (intent.escrowedAmountUSDC /
                            intent.fundingGoalUSDC) *
                          100
                        : 0;

                    // Current active milestone
                    const activeMilestone = intent.milestones.find(
                      (m) =>
                        m.status === "in_progress" ||
                        m.status === "proof_submitted"
                    );
                    const verifiedCount = intent.milestones.filter(
                      (m) =>
                        m.status === "ai_verified" || m.status === "released"
                    ).length;

                    return (
                      <button
                        key={intent.id}
                        onClick={() => router.push(`/intent/${intent.id}`)}
                        className="w-full rounded-2xl border border-gray-200 bg-white p-5 text-left group transition-all hover:border-orange-300 aura-shadow"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          {/* Left: Ticker + Title */}
                          <div className="flex-1 min-w-0 text-left">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-xl font-bold font-mono text-gray-900">
                                {intent.ticker}
                              </span>
                              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                                <ShieldCheck className="w-3 h-3 text-emerald-600 green-shield" />
                                <span className="text-[9px] font-medium text-emerald-700">
                                  AI Screened
                                </span>
                              </div>
                            </div>
                            <h3 className="text-sm font-medium text-gray-700 truncate">
                              {intent.title}
                            </h3>
                          </div>

                          {/* Center: Milestone Progress */}
                          <div className="flex items-center gap-4 sm:gap-6">
                            {/* Mini milestone dots */}
                            <div className="flex items-center gap-1">
                              {intent.milestones.map((ms) => {
                                const done =
                                  ms.status === "ai_verified" ||
                                  ms.status === "released";
                                const active =
                                  ms.status === "in_progress" ||
                                  ms.status === "proof_submitted";
                                return (
                                  <div
                                    key={ms.id}
                                    className="flex flex-col items-center gap-1"
                                  >
                                    <div
                                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                        done
                                          ? "bg-emerald-500"
                                          : active
                                          ? "bg-orange-50 border border-orange-300"
                                          : "bg-gray-50 border border-gray-200"
                                      }`}
                                    >
                                      {done ? (
                                        <CheckCircle2 className="w-3 h-3 text-white" />
                                      ) : active ? (
                                        <Clock className="w-2.5 h-2.5 text-orange-500" />
                                      ) : (
                                        <Lock className="w-2.5 h-2.5 text-gray-400" />
                                      )}
                                    </div>
                                    <span className="text-[8px] text-gray-400 font-mono">
                                      {ms.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Funding info */}
                            <div className="text-right">
                              <div className="text-xs text-gray-500 mb-0.5">
                                My Patronage
                              </div>
                              <div className="text-sm font-bold text-gray-900 font-mono">
                                ${myTotal.toLocaleString()}
                              </div>
                              <div className="text-[10px] text-gray-400 mt-0.5">
                                {fundingPct.toFixed(0)}% funded
                              </div>
                            </div>

                            {/* Status */}
                            <div className="hidden sm:flex flex-col items-end gap-1">
                              {activeMilestone ? (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-orange-50 text-orange-700 border border-orange-200">
                                  {activeMilestone.label}{" "}
                                  {activeMilestone.status === "proof_submitted"
                                    ? "Verifying"
                                    : "Active"}
                                </span>
                              ) : verifiedCount === 3 ? (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  Complete
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                  In Escrow
                                </span>
                              )}
                            </div>

                            {/* Arrow */}
                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-orange-500 transition-colors hidden sm:block" />
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="mt-3 h-1 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-500"
                            style={{
                              width: `${Math.min(fundingPct, 100)}%`,
                            }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ===== RIGHT: Activity Feed ===== */}
          <div className="lg:w-[320px] lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)]">
            <ActivityFeed maxItems={15} />
          </div>
        </div>
      </div>
    </div>
  );
}
