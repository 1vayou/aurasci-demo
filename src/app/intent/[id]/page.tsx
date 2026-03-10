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
import BoostButton from "@/components/BoostButton";
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
          className="stroke-gray-200"
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
          className="stroke-orange-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl sm:text-3xl font-bold text-gray-900">
          {Math.round(score)}
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
          className="stroke-gray-200"
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
          className="stroke-orange-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-xl sm:text-2xl font-bold text-orange-500">
          ${escrowed.toLocaleString()}
        </span>
        <span className="text-xs text-gray-500">
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
  status,
}: {
  milestone: { label: string; sublabel: string };
  status: "completed" | "active" | "locked";
}) {
  return (
    <div className="flex flex-col items-center gap-2 z-10 relative min-w-[64px]">
      <div className="relative">
        {status === "active" && (
          <div className="absolute inset-0 rounded-full bg-orange-200/60 blur-md animate-pulse scale-125" />
        )}

        <div
          className={[
            "relative w-9 h-9 rounded-full flex items-center justify-center bg-white transition-all duration-300",
            status === "completed"
              ? "border-2 border-emerald-400 text-emerald-500 shadow-[0_0_12px_rgba(52,211,153,0.18)]"
              : status === "active"
              ? "border-2 border-orange-500 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.28)]"
              : "border border-gray-200 bg-gray-50 text-gray-400",
          ].join(" ")}
        >
          {status === "completed" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : status === "active" ? (
            <Clock className="w-4 h-4" />
          ) : (
            <Lock className="w-3.5 h-3.5" />
          )}
        </div>
      </div>

      <div className="text-center leading-tight">
        <div className="text-xs font-semibold text-gray-700">{milestone.label}</div>
        <div className="text-[10px] text-gray-500">{milestone.sublabel}</div>
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
  const currentUser = useAppStore((s) => s.currentUser);
  const addPatronage = useAppStore((s) => s.addPatronage);
  const updateMilestone = useAppStore((s) => s.updateMilestone);
  const boostIntent = useAppStore((s) => s.boostIntent);

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
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Intent Not Found
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            This intent may have been removed or doesn&apos;t exist.
          </p>
          <button
            onClick={() => router.push("/market")}
            className="px-6 py-3 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 text-sm font-medium hover:bg-orange-100 transition-all"
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
    <div className="min-h-screen hero-gradient grid-pattern py-12 px-4 sm:px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <button
          onClick={() => router.push("/market")}
          className="flex items-center gap-2 text-gray-500 text-sm hover:text-gray-700 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Market
        </button>

        {/* ===== MAIN CARD ===== */}
        <div className="sci-fi-card p-1 bg-white border border-gray-200 aura-shadow-lg">
          <div className="relative z-10 rounded-[14px] bg-white p-6 sm:p-8">
            {/* Top row: Title + Funding Ring */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left: Main info */}
              <div className="flex-1 min-w-0">
                {/* Supporter count badge */}
                {intent.supporterCount && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 mb-4">
                    <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                    <span className="text-xs font-semibold text-orange-600">
                      {intent.supporterCount >= 1000
                        ? `${(intent.supporterCount / 1000).toFixed(1)}k`
                        : intent.supporterCount}
                    </span>
                  </div>
                )}

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-5">
                  {intent.title}
                </h1>

                {/* Scientist row */}
                {scientist && (
                  <div className="flex items-center gap-3 mb-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center border-2 border-emerald-300">
                      <span className="text-lg text-emerald-700 font-bold">
                        {scientist.fullName.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">
                          {scientist.fullName}
                        </span>
                        <ShieldCheck className="w-4 h-4 green-shield" />
                      </div>
                      <span className="text-xs text-gray-500">
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
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span className="text-[11px] font-semibold text-gray-700">
                        AI Score: {intent.aiScore}/100
                      </span>
                    </span>
                  )}
                </div>

                {/* Hypothesis */}
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
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
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs text-gray-600 hover:text-gray-900 hover:border-orange-300 transition-all"
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

                {/* Boost Button */}
                <div className="w-full">
                  <BoostButton
                    intentId={intent.id}
                    currentBoost={intent.boostScore || 0}
                    userCredits={currentUser.auraCredits}
                    onBoost={boostIntent}
                  />
                </div>

                {/* Resource Asks */}
                {intent.resourceAsks && intent.resourceAsks.length > 0 && (
                  <div className="w-full p-3 rounded-xl bg-orange-50 border border-orange-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Cpu className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider">
                        Resource Asks
                      </span>
                    </div>
                    {intent.resourceAsks.map((ask, i) => (
                      <div key={i} className="flex items-center gap-2 py-1">
                        <ResourceIcon type={ask.type} />
                        <span className="text-xs text-gray-700 font-medium">
                          {ask.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Trending badge */}
                {intent.trendingRank && intent.trendingRank <= 5 && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200">
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    <span className="text-xs font-semibold text-orange-600">
                      Trending Top {intent.trendingRank}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* ===== MILESTONE TIMELINE ===== */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="relative flex items-center justify-between w-full">
                {/* Background connecting line */}
                <div className="absolute left-0 right-0 top-[18px] h-[2px] bg-gray-200 z-0" />

                {/* M0 */}
                <TimelineStep
                  milestone={{ label: "M0", sublabel: "Fundraising" }}
                  status={
                    intent.escrowedAmountUSDC >= intent.fundingGoalUSDC
                      ? "completed"
                      : "active"
                  }
                />

                {/* M1, M2, M3 */}
                {intent.milestones.map((ms) => {
                  const isDone =
                    ms.status === "ai_verified" || ms.status === "released";
                  const isActive =
                    ms.status === "in_progress" || ms.status === "proof_submitted";
                  return (
                    <TimelineStep
                      key={ms.id}
                      milestone={{ label: ms.label, sublabel: ms.sublabel }}
                      status={isDone ? "completed" : isActive ? "active" : "locked"}
                    />
                  );
                })}

                {/* R (Result) */}
                <TimelineStep
                  milestone={{ label: "R", sublabel: "Result" }}
                  status="locked"
                />

                {/* SSR (Award) */}
                <TimelineStep
                  milestone={{ label: "SSR", sublabel: "Award" }}
                  status="locked"
                />
              </div>
            </div>

            {/* ===== BACKED BY + PATRONS ===== */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Backed by */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 font-medium">
                    Backed by:
                  </span>
                  {intent.backers && intent.backers.length > 0 ? (
                    <div className="flex items-center gap-2">
                      {intent.backers.map((backer) => (
                        <div
                          key={backer.id}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200"
                        >
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                            <span className="text-[8px] text-orange-700 font-bold">
                              {backer.name.charAt(0)}
                            </span>
                          </div>
                          <span className="text-xs text-gray-700 font-medium">
                            {backer.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">No backers yet</span>
                  )}

                  {/* Patron avatars */}
                  {intent.patrons && intent.patrons.length > 0 && (
                    <div className="flex items-center -space-x-2 ml-2">
                      {intent.patrons.slice(0, 4).map((patron) => (
                        <div
                          key={patron.id}
                          className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-200 to-amber-200 flex items-center justify-center border-2 border-white halo-ring"
                          title={patron.name}
                        >
                          <span className="text-[9px] text-orange-800 font-bold">
                            {patron.name.charAt(0)}
                          </span>
                        </div>
                      ))}
                      {intent.patrons.length > 4 && (
                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center border-2 border-white">
                          <span className="text-[9px] text-gray-500 font-medium">
                            +{intent.patrons.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== MILESTONE DETAILS ===== */}
        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Milestone Details
          </h2>

          {intent.milestones.map((ms) => {
            const isActive = ms.status === "in_progress";
            const isDone = ms.status === "ai_verified" || ms.status === "released";
            const isProof = ms.status === "proof_submitted";

            return (
              <div
                key={ms.id}
                className={`p-5 rounded-xl border transition-all bg-white ${
                  isActive
                    ? "border-orange-200"
                    : isDone
                    ? "border-emerald-200"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                        isDone
                          ? "bg-emerald-100 text-emerald-700"
                          : isActive || isProof
                          ? "bg-orange-100 text-orange-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {ms.label}
                    </div>
                    <div>
                      <h3
                        className={`text-sm font-semibold ${
                          isDone || isActive ? "text-gray-900" : "text-gray-500"
                        }`}
                      >
                        {ms.objective}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Est: {ms.estTime} · Release: ${ms.releaseAmountUSDC.toLocaleString()} USDC
                      </p>
                    </div>
                  </div>

                  {/* Status badge */}
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap ${
                      isDone
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : isProof
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : isActive
                        ? "bg-orange-50 text-orange-700 border border-orange-200"
                        : "bg-gray-50 text-gray-500 border border-gray-200"
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
                  <p className="text-xs text-gray-500">
                    <span className="text-gray-700 font-medium">Verification:</span>{" "}
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
                      className="px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 text-[10px] font-medium hover:bg-orange-100 transition-all"
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
                      className="px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 text-[10px] font-medium hover:bg-orange-100 transition-all"
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
        <div className="mt-8 p-6 rounded-2xl border border-orange-200 bg-white aura-shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-orange-500" />
            Provide Patronage
          </h2>
          <div className="flex gap-3">
            <input
              type="number"
              min="1"
              placeholder="Amount (USDC)"
              value={patronAmount}
              onChange={(e) => setPatronAmount(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100 transition-all"
            />
            <button
              onClick={handlePatronage}
              disabled={isPatronizing || !patronAmount}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold text-sm transition-all hover:shadow-lg hover:shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
          <p className="text-xs text-gray-500 mt-3">
            Patronage is escrowed and released upon AI-verified milestone completion.
          </p>
        </div>
      </div>
    </div>
  );
}
