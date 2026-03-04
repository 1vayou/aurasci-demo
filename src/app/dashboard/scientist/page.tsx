"use client";

import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Building2,
  Github,
  Clock,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Wrench,
} from "lucide-react";
import { useAppStore } from "@/store";

export default function ScientistDashboard() {
  const router = useRouter();
  const currentUser = useAppStore((s) => s.currentUser);
  const setScientistProfile = useAppStore((s) => s.setScientistProfile);
  const profile = currentUser.profile;

  // Redirect if no profile
  if (!profile) {
    return (
      <div className="min-h-screen hero-gradient grid-pattern flex items-center justify-center px-6">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-yellow-400/60 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            No Profile Found
          </h2>
          <p className="text-white/40 text-sm mb-6">
            You need to complete onboarding first.
          </p>
          <button
            onClick={() => router.push("/onboarding/scientist")}
            className="px-6 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium hover:bg-green-500/20 transition-all"
          >
            Start Onboarding
          </button>
        </div>
      </div>
    );
  }

  const isPending = profile.status === "pending_review";
  const isApproved = profile.status === "approved";

  // Mock admin approve
  const handleMockApprove = () => {
    setScientistProfile({ ...profile, status: "approved" });
  };

  return (
    <div className="min-h-screen hero-gradient grid-pattern py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Scientist Dashboard
          </h1>
          <p className="text-white/40 text-sm">
            Manage your Lab Profile and research intents
          </p>
        </div>

        {/* Status Banner */}
        <div
          className={`mb-8 p-4 rounded-xl border flex items-center gap-3 ${
            isPending
              ? "border-yellow-500/20 bg-yellow-500/5"
              : "border-green-500/20 bg-green-500/5"
          }`}
        >
          {isPending ? (
            <>
              <Clock className="w-5 h-5 text-yellow-400" />
              <div>
                <div className="text-sm font-medium text-yellow-300">
                  Pending Review
                </div>
                <div className="text-xs text-yellow-400/60">
                  Your profile is being reviewed by the AuraSci team. This
                  usually takes 24-48 hours.
                </div>
              </div>
            </>
          ) : (
            <>
              <ShieldCheck className="w-5 h-5 text-green-400 green-shield" />
              <div>
                <div className="text-sm font-medium text-green-300">
                  Approved
                </div>
                <div className="text-xs text-green-400/60">
                  Your profile has been verified. You can now publish Intent
                  Assets.
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
          {/* Profile Header */}
          <div className="p-6 border-b border-white/[0.06]">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {/* Avatar placeholder */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500/30 to-emerald-600/30 flex items-center justify-center border border-green-500/20">
                  <User className="w-8 h-8 text-green-300" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    {profile.fullName}
                    {isApproved && (
                      <ShieldCheck className="w-5 h-5 green-shield" />
                    )}
                  </h2>
                  <p className="text-sm text-white/40">{profile.handle}</p>
                </div>
              </div>

              {/* Status badge */}
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isPending
                    ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                    : "bg-green-500/10 text-green-400 border border-green-500/20"
                }`}
              >
                {isPending ? "Pending Review" : "Verified"}
              </span>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02]">
                <Mail className="w-4 h-4 text-white/30" />
                <div>
                  <div className="text-xs text-white/30">Email</div>
                  <div className="text-sm text-white/80">{profile.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02]">
                <Github className="w-4 h-4 text-white/30" />
                <div>
                  <div className="text-xs text-white/30">Handle</div>
                  <div className="text-sm text-white/80">{profile.handle}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] sm:col-span-2">
                <Building2 className="w-4 h-4 text-white/30" />
                <div>
                  <div className="text-xs text-white/30">Affiliation</div>
                  <div className="text-sm text-white/80">
                    {profile.affiliation}
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="p-4 rounded-lg bg-white/[0.02]">
              <div className="text-xs text-white/30 mb-2">Research Bio</div>
              <div className="text-sm text-white/70 leading-relaxed">
                {profile.bio}
              </div>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Create Intent - only enabled when approved */}
            <button
              onClick={() =>
                isApproved && router.push("/dashboard/scientist/create-intent")
              }
              disabled={!isApproved}
              className={`p-5 rounded-xl border text-left transition-all ${
                isApproved
                  ? "border-green-500/20 bg-green-500/5 hover:border-green-500/40 hover:bg-green-500/10 cursor-pointer"
                  : "border-white/[0.06] bg-white/[0.01] opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="text-sm font-medium text-white mb-1">
                📝 Create Intent Asset
              </div>
              <div className="text-xs text-white/40">
                {isApproved
                  ? "Publish a new research intent"
                  : "Requires approved profile"}
              </div>
            </button>

            {/* View Intents - placeholder */}
            <button
              disabled
              className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.01] text-left opacity-50 cursor-not-allowed"
            >
              <div className="text-sm font-medium text-white mb-1">
                📊 My Intent Assets
              </div>
              <div className="text-xs text-white/40">
                Phase 1 暂不支持
              </div>
            </button>
          </div>
        </div>

        {/* Dev Tools - Mock Admin Approve */}
        {isPending && (
          <div className="mt-12 p-4 rounded-xl border border-dashed border-orange-500/30 bg-orange-500/5">
            <div className="flex items-center gap-2 mb-3">
              <Wrench className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-mono text-orange-400 uppercase tracking-wider">
                Dev Tools
              </span>
            </div>
            <button
              onClick={handleMockApprove}
              className="px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs font-medium hover:bg-orange-500/20 transition-all"
            >
              [Dev] Mock Admin Approve
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
