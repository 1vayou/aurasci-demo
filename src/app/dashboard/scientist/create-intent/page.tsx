"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Sparkles,
  Plus,
  DollarSign,
  Beaker,
  Target,
  Clock,
  CheckSquare,
  Coins,
} from "lucide-react";
import { useAppStore } from "@/store";
import type { IntentAsset, Milestone } from "@/types";

interface MilestoneForm {
  objective: string;
  estTime: string;
  verificationCriteria: string;
  releaseAmountUSDC: string;
}

const emptyMilestone: MilestoneForm = {
  objective: "",
  estTime: "",
  verificationCriteria: "",
  releaseAmountUSDC: "",
};

export default function CreateIntent() {
  const router = useRouter();
  const currentUser = useAppStore((s) => s.currentUser);
  const addIntent = useAppStore((s) => s.addIntent);

  const [title, setTitle] = useState("");
  const [ticker, setTicker] = useState("");
  const [hypothesis, setHypothesis] = useState("");
  const [fundingGoal, setFundingGoal] = useState("");
  const [hypothesisWordCount, setHypothesisWordCount] = useState(0);

  const [milestones, setMilestones] = useState<MilestoneForm[]>([
    { ...emptyMilestone },
    { ...emptyMilestone },
    { ...emptyMilestone },
  ]);

  const [isScreening, setIsScreening] = useState(false);
  const [screeningStep, setScreeningStep] = useState(0);

  const screeningSteps = [
    "Analyzing hypothesis validity...",
    "Verifying milestone feasibility...",
    "Assessing funding structure...",
    "AI Gatekeeper Approved ✓",
  ];

  // Redirect if not approved scientist
  if (!currentUser.profile || currentUser.profile.status !== "approved") {
    return (
      <div className="min-h-screen hero-gradient grid-pattern flex items-center justify-center px-6">
        <div className="text-center">
          <ShieldCheck className="w-12 h-12 text-yellow-400/60 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Access Restricted
          </h2>
          <p className="text-white/40 text-sm mb-6">
            Only approved scientists can create Intent Assets.
          </p>
          <button
            onClick={() => router.push("/dashboard/scientist")}
            className="px-6 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium hover:bg-green-500/20 transition-all"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleHypothesisChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(Boolean);
    setHypothesisWordCount(words.length);
    setHypothesis(text);
  };

  const updateMilestone = (
    index: number,
    field: keyof MilestoneForm,
    value: string
  ) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
  };

  const isFormValid = () => {
    if (!title || !ticker || !hypothesis || !fundingGoal) return false;
    if (hypothesisWordCount > 250) return false;
    for (const m of milestones) {
      if (
        !m.objective ||
        !m.estTime ||
        !m.verificationCriteria ||
        !m.releaseAmountUSDC
      )
        return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setIsScreening(true);

    // Simulate AI Gatekeeper screening
    for (let i = 0; i < screeningSteps.length; i++) {
      setScreeningStep(i);
      await new Promise((resolve) =>
        setTimeout(resolve, i === screeningSteps.length - 1 ? 800 : 1000)
      );
    }

    const intentId = `intent_${Date.now()}`;
    const milestoneLabels = ["M1", "M2", "M3"] as const;
    const milestoneSublabels = ["Phase 1", "Phase 2", "Phase 3"];
    const intentMilestones: Milestone[] = milestones.map((m, idx) => ({
      id: `ms_${intentId}_${idx + 1}`,
      intentId,
      order: (idx + 1) as 1 | 2 | 3,
      label: milestoneLabels[idx],
      sublabel: milestoneSublabels[idx],
      estTime: m.estTime,
      objective: m.objective,
      deliverables: m.objective,
      verificationCriteria: m.verificationCriteria,
      releaseAmountUSDC: parseFloat(m.releaseAmountUSDC) || 0,
      status: idx === 0 ? "in_progress" : "locked",
    }));

    const intent: IntentAsset = {
      id: intentId,
      scientistId: currentUser.profile!.id,
      title,
      ticker: ticker.startsWith("$") ? ticker : `$${ticker}`,
      coreHypothesis: hypothesis,
      evidenceLinks: [],
      fundingGoalUSDC: parseFloat(fundingGoal) || 0,
      escrowedAmountUSDC: 0,
      status: "published",
      milestones: intentMilestones,
      aiScore: Math.floor(Math.random() * 20) + 75, // Mock: 75-94
      tags: currentUser.profile?.tags || ['#DeSci'],
      patrons: [],
      backers: [],
      resourceAsks: [],
      supporterCount: 0,
    };

    addIntent(intent);
    router.push("/market");
  };

  // AI Screening Overlay
  if (isScreening) {
    return (
      <div className="min-h-screen hero-gradient grid-pattern flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              {screeningStep < screeningSteps.length - 1 ? (
                <Loader2 className="w-10 h-10 text-green-400 animate-spin" />
              ) : (
                <ShieldCheck className="w-10 h-10 text-green-400 green-shield" />
              )}
            </div>
            {/* Pulse ring */}
            <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full border border-green-500/20 animate-ping" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-3">
            AI Gatekeeper Screening
          </h2>

          <div className="space-y-3 mb-6">
            {screeningSteps.map((step, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-500 ${
                  idx < screeningStep
                    ? "bg-green-500/5 border border-green-500/20"
                    : idx === screeningStep
                    ? "bg-white/[0.03] border border-white/[0.1]"
                    : "opacity-30"
                }`}
              >
                {idx < screeningStep ? (
                  <CheckSquare className="w-4 h-4 text-green-400 flex-shrink-0" />
                ) : idx === screeningStep ? (
                  <Loader2 className="w-4 h-4 text-white/60 animate-spin flex-shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-sm border border-white/20 flex-shrink-0" />
                )}
                <span
                  className={`text-sm ${
                    idx <= screeningStep ? "text-white/80" : "text-white/30"
                  }`}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-gradient grid-pattern py-16 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/dashboard/scientist")}
            className="flex items-center gap-2 text-white/40 text-sm hover:text-white/60 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-green-400" />
            Create Intent Asset
          </h1>
          <p className="text-white/40 text-sm">
            Define your research intent and set milestones for funding
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Beaker className="w-5 h-5 text-green-400" />
              Research Intent
            </h2>

            <div className="space-y-5">
              {/* Title & Ticker */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/[0.02] border border-white/[0.08] text-white placeholder:text-white/30 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
                    placeholder="e.g., Reversing Cellular Aging via mRNA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Ticker
                  </label>
                  <input
                    type="text"
                    required
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/[0.02] border border-white/[0.08] text-white placeholder:text-white/30 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all font-mono"
                    placeholder="$CELL-01"
                  />
                </div>
              </div>

              {/* Core Hypothesis */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Core Hypothesis
                  <span className="ml-2 text-xs text-white/40">
                    ({hypothesisWordCount}/250 words)
                  </span>
                </label>
                <textarea
                  required
                  value={hypothesis}
                  onChange={handleHypothesisChange}
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-white/[0.02] border border-white/[0.08] text-white placeholder:text-white/30 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all resize-none"
                  placeholder="Describe your core research hypothesis..."
                />
                {hypothesisWordCount > 250 && (
                  <p className="mt-2 text-xs text-red-400">
                    Hypothesis exceeds 250 word limit
                  </p>
                )}
              </div>

              {/* Funding Goal */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Funding Goal (USDC)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={fundingGoal}
                  onChange={(e) => setFundingGoal(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/[0.02] border border-white/[0.08] text-white placeholder:text-white/30 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
                  placeholder="50000"
                />
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
            <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" />
              Milestones
            </h2>
            <p className="text-xs text-white/40 mb-6">
              Define exactly 3 milestones. The sum of release amounts should
              equal your funding goal.
            </p>

            <div className="space-y-6">
              {milestones.map((milestone, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.01]"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 text-sm font-bold">
                      {idx + 1}
                    </div>
                    <h3 className="text-sm font-semibold text-white">
                      Milestone {idx + 1}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* Objective */}
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1.5 flex items-center gap-1.5">
                        <Target className="w-3 h-3" />
                        Objective
                      </label>
                      <input
                        type="text"
                        required
                        value={milestone.objective}
                        onChange={(e) =>
                          updateMilestone(idx, "objective", e.target.value)
                        }
                        className="w-full px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.08] text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        placeholder="What will be achieved in this milestone?"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* EST Time */}
                      <div>
                        <label className="block text-xs font-medium text-white/60 mb-1.5 flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          Estimated Time
                        </label>
                        <input
                          type="text"
                          required
                          value={milestone.estTime}
                          onChange={(e) =>
                            updateMilestone(idx, "estTime", e.target.value)
                          }
                          className="w-full px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.08] text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                          placeholder="e.g., 3 months"
                        />
                      </div>

                      {/* Release Amount */}
                      <div>
                        <label className="block text-xs font-medium text-white/60 mb-1.5 flex items-center gap-1.5">
                          <Coins className="w-3 h-3" />
                          Release Amount (USDC)
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={milestone.releaseAmountUSDC}
                          onChange={(e) =>
                            updateMilestone(
                              idx,
                              "releaseAmountUSDC",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.08] text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                          placeholder="15000"
                        />
                      </div>
                    </div>

                    {/* Verification Criteria */}
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1.5 flex items-center gap-1.5">
                        <CheckSquare className="w-3 h-3" />
                        Verification Criteria
                      </label>
                      <textarea
                        required
                        value={milestone.verificationCriteria}
                        onChange={(e) =>
                          updateMilestone(
                            idx,
                            "verificationCriteria",
                            e.target.value
                          )
                        }
                        rows={2}
                        className="w-full px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.08] text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                        placeholder="How will completion be verified?"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Milestone sum hint */}
            {fundingGoal && (
              <div className="mt-4 p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">
                    Sum of release amounts:
                  </span>
                  <span
                    className={`font-mono ${
                      milestones.reduce(
                        (sum, m) => sum + (parseFloat(m.releaseAmountUSDC) || 0),
                        0
                      ) === parseFloat(fundingGoal)
                        ? "text-green-400"
                        : "text-yellow-400"
                    }`}
                  >
                    $
                    {milestones
                      .reduce(
                        (sum, m) => sum + (parseFloat(m.releaseAmountUSDC) || 0),
                        0
                      )
                      .toLocaleString()}{" "}
                    / ${parseFloat(fundingGoal).toLocaleString() || "0"} USDC
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isFormValid()}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-5 h-5" />
            Submit to AI Gatekeeper
          </button>
        </form>
      </div>
    </div>
  );
}
