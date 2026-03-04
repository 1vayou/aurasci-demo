"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Lock,
  Clock,
  Loader2,
  Cpu,
  Database,
  Wrench as WrenchIcon,
  Users,
  Flame,
  DollarSign,
  ExternalLink,
} from "lucide-react";
import { useAppStore } from "@/store";
import type { Milestone, ResourceAsk } from "@/types";

/* ---- Circular Score Ring ---- */
function ScoreRing({
  score,
  size = 160,
}: {
  score: number;
  size?: number;
}) {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={8}
          className="score-ring-bg"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className="score-ring-fill"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl sm:text-3xl font-bold text-white">
          ${Math.round(score).toLocaleString()}
        </span>
      </div>
    </div>
  );
}

/* ---- Funding Ring (right side) ---- */
function FundingRing({
  escrowed,
  goal,
  size = 180,
}: {
  escrowed: number;
  goal: number;
  size?: number;
}) {
  const pct = goal > 0 ? Math.min((escrowed / goal) * 100, 100) : 0;
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={10}
          className="score-ring-bg"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className="score-ring-fill"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-xl sm:text-2xl font-bold neon-green-text">
          ${escrowed.toLocaleString()}
        </span>
        <span className="text-xs text-white/40">
          ${goal.toLocaleString()} Goal
        </span>
      </div>
    </div>
  );
}

/* ---- Resource icon helper ---- */
function ResourceIcon({ type }: { type: ResourceAsk["type"] }) {
  switch (type) {
    case "compute":
      return <Cpu className="w-4 h-4 text-green-400" />;
    case "data":
      return <Database className="w-4 h-4 text-blue-400" />;
    case "equipment":
      return <WrenchIcon className="w-4 h-4 text-purple-400" />;
    case "talent":
      return <Users className="w-4 h-4 text-yellow-400" />;
  }
}

/* ---- Milestone timeline step ---- */
function TimelineStep({
  milestone,
  isFirst,
  isLast,
}: {
  milestone: Milestone;
  isFirst: boolean;
  isLast: boolean;
}) {
  const isActive = milestone.status === "in_progress";
  const isDone =
    milestone.status === "ai_verified" || milestone.status === "released";
  const isProof = milestone.status === "proof_submitted";

  return (
    <div className="flex flex-col items-center flex-1 min-w-0">
      {/* Dot + connectors */}
      <div className="flex items-center w-full">
        {/* Left connector */}
        {!isFirst && (
          <div
            className={`flex-1 h-[2px] ${
              isDone ? "bg-green-500" : "bg-white/10"
            }`}
          />
        )}
        {isFirst && <div className="flex-1" />}

        {/* Dot */}
        <div
          className={`timeline-dot w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isDone
              ? "bg-green-500 active"
              : isActive || isProof
              ? "bg-green-500/20 border-2 border-green-500 active"
              : "bg-white/[0.06] border border-white/20"
          }`}
        >
          {isDone ? (
            <CheckCircle2 className="w-4 h-4 text-white" />
          ) : isActive ? (
            <Clock className="w-3.5 h-3.5 text-green-400" />
          ) : isProof ? (
            <Loader2 className="w-3.5 h-3.5 text-green-400 animate-spin" />
          ) : (
            <Lock className="w-3 h-3 text-white/30" />
          )}
        </div>

        {/* Right connector */}
        {!isLast && (
          <div
            className={`flex-1 h-[2px] ${
              isDone ? "bg-green-500" : "bg-white/10"
            }`}
          />
        )}
        {isLast && <div className="flex-1" />}
      </div>

      {/* Label */}
      <div className="mt-2 text-center">
        <div
          className={`text-xs font-bold ${
            isDone || isActive || isProof ? "text-white" : "text-white/40"
          }`}
        >
          {milestone.label}
        </div>
        <div className="text-[10px] text-white/30">{milestone.sublabel}</div>
      </div>
    </div>
  );
}

/* ============ MAIN PAGE ============ */
export default function IntentDetail() {
  const params = useParams();
  const router = useRouter();
  const intents = useAppStore((s) => s.intents);
  const scientists = useAppStore((s) => s.scientists);
  const addPatronage = useAppStore((s) => s.addPatronage);
  const updateMilestone = useAppStore((s) => s.updateMilestone);

  const intent = useMemo(
    () => intents.find((i) => i.id === params.id),
    [intents, params.id]
  );
  const scientist = useMemo(
    () => (intent ? scientists.find((s) => s.id === intent.scientistId) : undefined),
    [scientists, intent]
  );

  const [patronAmount, setPatronAmount] = useState("");
  const [isPatronizing, setIsPatronizing] = useState(false);

  if (!intent) {
    return (
      <div className="min-h-screen hero-gradient grid-pattern flex items-center justify-center px-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">
            Intent Not Found
          </h2>
          <p className="text-white/40 text-sm mb-6">
            This intent may have been removed or doesn&apos;t exist.
          </p>
          <button
            onClick={() => router.push("/market")}
            className="px-6 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium hover:bg-green-500/20 transition-all"
          >
            Back to Market
          </button>
        </div>
      </div>
    );
  }

  const handlePatronage = async () => {
    const amount = parseFloat(patronAmount);
    if (!amount || amount <= 0) return;
    setIsPatronizing(true);
    await new Promise((r) => setTimeout(r, 1500));
    addPatronage(intent.id, {
      id: `patron_${Date.now()}`,
      name: "You",
      amountUSDC: amount,
    });
    setPatronAmount("");
    setIsPatronizing(false);
  };

  // Combine milestones with M0 (Fundraising) at start
  const allSteps = [
    {
      id: "m0",
      intentId: intent.id,
      order: 0 as const,
      label: "M0" as const,
      sublabel: "Fundraising",
      status:
        intent.escrowedAmountUSDC >= intent.fundingGoalUSDC
          ? ("released" as const)
          : ("in_progress" as const),
      estTime: "",
      objective: "",
      deliverables: "",
      verificationCriteria: "",
      releaseAmountUSDC: 0,
    },
    ...intent.milestones,
  ];

  // Tag color mapper
  const tagColor = (tag: string) => {
    if (tag.includes("Longevity") || tag.includes("Genomics")) return "tag-green";
    if (tag.includes("Neuro") || tag.includes("Quantum")) return "tag-blue";
    return "tag-purple";
  };

  return (
    <div className="min-h-screen hero-gradient grid-pattern py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <button
          onClick={() => router.push("/market")}
          className="flex items-center gap-2 text-white/40 text-sm hover:text-white/60 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Market
        </button>

        {/* ===== MAIN SCI-FI CARD ===== */}
        <div className="sci-fi-card sci-fi-corners p-1">
          <div className="relative z-10 rounded-[14px] bg-[#0b0f14]/95 p-6 sm:p-8">
            {/* Top row: Title + Funding Ring */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left: Main info */}
              <div className="flex-1 min-w-0">
                {/* Supporter count badge */}
                {intent.supporterCount && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
                    <Sparkles className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-xs font-semibold text-green-400">
                      {intent.supporterCount >= 1000
                        ? `${(intent.supporterCount / 1000).toFixed(1)}k`
                        : intent.supporterCount}
                    </span>
                  </div>
                )}

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-5">
                  {intent.title}
                </h1>

                {/* Scientist row */}
                {scientist && (
                  <div className="flex items-center gap-3 mb-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500/40 to-emerald-600/40 flex items-center justify-center border-2 border-green-500/30">
                      <span className="text-lg text-green-200 font-bold">
                        {scientist.fullName.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">
                          {scientist.fullName}
                        </span>
                        <ShieldCheck className="w-4 h-4 green-shield" />
                      </div>
                      <span className="text-xs text-white/40">
                        {scientist.affiliation}
                      </span>
                    </div>
                  </div>
                )}

                {/* Tags + AI Score */}
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  {(intent.tags || []).map((tag) => (
                    <span
                      key={tag}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${tagColor(tag)}`}
                    >
                      {tag}
                    </span>
                  ))}
                  {intent.aiScore && (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10">
                      <ShieldCheck className="w-3 h-3 text-green-400" />
                      <span className="text-[11px] font-semibold text-white/70">
                        AI Score: {intent.aiScore}/100
                      </span>
                    </span>
                  )}
                </div>

                {/* Hypothesis */}
                <p className="text-sm text-white/60 leading-relaxed mb-6">
                  {intent.coreHypothesis}
                </p>

                {/* Evidence Links */}
                {intent.evidenceLinks.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {intent.evidenceLinks.map((link, i) => (
                      <a
                        key={i}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-white/50 hover:text-white/70 hover:border-white/20 transition-all"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {link.includes("github") ? "GitHub" : link.includes("arxiv") ? "ArXiv" : "Link"}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Funding Ring + Stats */}
              <div className="flex flex-col items-center gap-4 lg:min-w-[220px]">
                <FundingRing
                  escrowed={intent.escrowedAmountUSDC}
                  goal={intent.fundingGoalUSDC}
                  size={180}
                />

                {/* Resource Asks */}
                {intent.resourceAsks && intent.resourceAsks.length > 0 && (
                  <div className="w-full p-3 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                    <div className="flex items-center gap-2 mb-2">
                      <Cpu className="w-3.5 h-3.5 text-white/40" />
                      <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">
                        Resource Asks
                      </span>
                    </div>
                    {intent.resourceAsks.map((ask, i) => (
                      <div key={i} className="flex items-center gap-2 py-1">
                        <ResourceIcon type={ask.type} />
                        <span className="text-xs text-white/70 font-medium">
                          {ask.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Trending badge */}
                {intent.trendingRank && intent.trendingRank <= 5 && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20">
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    <span className="text-xs font-semibold text-orange-400">
                      Trending Top {intent.trendingRank}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* ===== MILESTONE TIMELINE ===== */}
            <div className="mt-8 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center w-full">
                {allSteps.map((step, idx) => (
                  <TimelineStep
                    key={step.id}
                    milestone={step as Milestone}
                    isFirst={idx === 0}
                    isLast={idx === allSteps.length - 1}
                  />
                ))}
                {/* R (Result) */}
                <div className="flex flex-col items-center flex-1 min-w-0">
                  <div className="flex items-center w-full">
                    <div className="flex-1 h-[2px] bg-white/10" />
                    <div className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] text-white/30">●</span>
                    </div>
                    <div className="flex-1 h-[2px] bg-white/10" />
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-xs font-bold text-white/40">R</div>
                    <div className="text-[10px] text-white/30">Result</div>
                  </div>
                </div>
                {/* SSR (Award) */}
                <div className="flex flex-col items-center flex-1 min-w-0">
                  <div className="flex items-center w-full">
                    <div className="flex-1 h-[2px] bg-white/10" />
                    <div className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] text-white/30">★</span>
                    </div>
                    <div className="flex-1" />
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-xs font-bold text-white/40">SSR</div>
                    <div className="text-[10px] text-white/30">Award</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== BACKED BY + PATRONS ===== */}
            <div className="mt-6 pt-6 border-t border-white/[0.06]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Backed by */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/40 font-medium">
                    Backed by:
                  </span>
                  {intent.backers && intent.backers.length > 0 ? (
                    <div className="flex items-center gap-2">
                      {intent.backers.map((backer) => (
                        <div
                          key={backer.id}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.1]"
                        >
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500/40 to-blue-500/40 flex items-center justify-center">
                            <span className="text-[8px] text-white font-bold">
                              {backer.name.charAt(0)}
                            </span>
                          </div>
                          <span className="text-xs text-white/70 font-medium">
                            {backer.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-white/30">No backers yet</span>
                  )}

                  {/* Patron avatars */}
                  {intent.patrons && intent.patrons.length > 0 && (
                    <div className="flex items-center -space-x-2 ml-2">
                      {intent.patrons.slice(0, 4).map((patron) => (
                        <div
                          key={patron.id}
                          className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500/50 to-pink-500/50 flex items-center justify-center border-2 border-[#0b0f14] halo-ring"
                          title={patron.name}
                        >
                          <span className="text-[9px] text-white font-bold">
                            {patron.name.charAt(0)}
                          </span>
                        </div>
                      ))}
                      {intent.patrons.length > 4 && (
                        <div className="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center border-2 border-[#0b0f14]">
                          <span className="text-[9px] text-white/60 font-medium">
                            +{intent.patrons.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Diagonal accent */}
                <div className="hidden sm:block w-16 h-4 diagonal-stripes rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* ===== MILESTONE DETAILS ===== */}
        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-400" />
            Milestone Details
          </h2>

          {intent.milestones.map((ms) => {
            const isActive = ms.status === "in_progress";
            const isDone = ms.status === "ai_verified" || ms.status === "released";
            const isProof = ms.status === "proof_submitted";

            return (
              <div
                key={ms.id}
                className={`p-5 rounded-xl border transition-all ${
                  isActive
                    ? "border-green-500/30 bg-green-500/[0.03]"
                    : isDone
                    ? "border-green-500/20 bg-green-500/[0.02]"
                    : "border-white/[0.06] bg-white/[0.01]"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                        isDone
                          ? "bg-green-500/20 text-green-400"
                          : isActive || isProof
                          ? "bg-green-500/10 text-green-400"
                          : "bg-white/[0.04] text-white/30"
                      }`}
                    >
                      {ms.label}
                    </div>
                    <div>
                      <h3
                        className={`text-sm font-semibold ${
                          isDone || isActive ? "text-white" : "text-white/50"
                        }`}
                      >
                        {ms.objective}
                      </h3>
                      <p className="text-xs text-white/30 mt-1">
                        Est: {ms.estTime} · Release: ${ms.releaseAmountUSDC.toLocaleString()} USDC
                      </p>
                    </div>
                  </div>

                  {/* Status badge */}
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap ${
                      isDone
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : isProof
                        ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                        : isActive
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        : "bg-white/[0.04] text-white/30 border border-white/[0.08]"
                    }`}
                  >
                    {isDone
                      ? "✓ Verified"
                      : isProof
                      ? "Proof Submitted"
                      : isActive
                      ? "In Progress"
                      : "Locked"}
                  </span>
                </div>

                {/* Verification criteria */}
                <div className="mt-3 pl-[52px]">
                  <p className="text-xs text-white/30">
                    <span className="text-white/50 font-medium">Verification:</span>{" "}
                    {ms.verificationCriteria}
                  </p>
                </div>

                {/* Dev: mock milestone actions */}
                {isActive && (
                  <div className="mt-3 pl-[52px]">
                    <button
                      onClick={() =>
                        updateMilestone(intent.id, ms.id, {
                          status: "proof_submitted",
                        })
                      }
                      className="px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-300 text-[10px] font-medium hover:bg-orange-500/20 transition-all"
                    >
                      [Dev] Submit Proof
                    </button>
                  </div>
                )}
                {isProof && (
                  <div className="mt-3 pl-[52px]">
                    <button
                      onClick={() =>
                        updateMilestone(intent.id, ms.id, {
                          status: "ai_verified",
                        })
                      }
                      className="px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-300 text-[10px] font-medium hover:bg-orange-500/20 transition-all"
                    >
                      [Dev] AI Verify
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ===== PATRONAGE SECTION ===== */}
        <div className="mt-8 p-6 rounded-2xl border border-purple-500/20 bg-purple-500/[0.03]">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-purple-400" />
            Provide Patronage
          </h2>
          <div className="flex gap-3">
            <input
              type="number"
              min="1"
              placeholder="Amount (USDC)"
              value={patronAmount}
              onChange={(e) => setPatronAmount(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.08] text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
            <button
              onClick={handlePatronage}
              disabled={isPatronizing || !patronAmount}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white font-semibold text-sm transition-all hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isPatronizing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Fund"
              )}
            </button>
          </div>
          <p className="text-xs text-white/30 mt-3">
            Patronage is escrowed and released upon AI-verified milestone completion.
          </p>
        </div>
      </div>
    </div>
  );
}
